// TODO
// format long task titles
// style

import { FormEvent, ReactNode, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { AddTaskModal } from "./AddTaskModal";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  Firestore,
} from "firebase/firestore";
import { Task } from "../types";
import { Auth } from "firebase/auth";

const taskStyling = {
  default:
    "flex w-full justify-between  rounded-md bg-dark-bg p-4 cursor-pointer border-l-4 border-transparent",
  focused:
    "flex w-full justify-between rounded-md bg-dark-bg p-4 cursor-pointer border-l-4 border-green-400",
};

type TasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  focusedTask: Task | null;
  setFocusedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  children: ReactNode;
  db: Firestore;
  auth: Auth;
};

export const Tasks = ({
  tasks,
  setTasks,
  focusedTask,
  setFocusedTask,
  children,
  db,
  auth,
}: TasksProps) => {
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const estPomosRef = useRef<HTMLInputElement>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  function openTaskModal() {
    setShowTaskModal(true);
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();

    if (taskTitleRef.current?.value.trim() === "") {
      alert("Please provide a task name");
      return;
    }

    const newTask = {
      title: taskTitleRef.current!.value,
      estimatedPomos: Number(estPomosRef.current!.value),
      completedPomos: 0,
      taskId: nanoid(),
      dateCreated: new Date(),
    };

    tasks.push(newTask);
    setTasks((tasks) => [...tasks]);

    taskTitleRef.current!.value = "";
    estPomosRef.current!.value = "1";
    setShowTaskModal(false);
    setFocusedTask(newTask);

    // if a user is signed in add the created task to the `tasks` collection
    if (auth.currentUser) {
      try {
        const docRef = await addDoc(collection(db, "tasks"), {
          ...newTask,
          uid: auth.currentUser.uid,
        });
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        // console.error("Error adding document: ", e);
      }
    }
  }

  function focusTask(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;

    // do nothing if the user clicks on the delete button
    if (target.className.includes("delete-btn")) return;

    const li = target.closest("li");

    if (li) {
      const taskId = li.dataset.id;

      const match = tasks.find((task) => task.taskId === taskId);

      if (match) setFocusedTask(match);
    }
  }

  async function deleteTask(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;

    const li = target.closest("li");

    if (li) {
      const taskId = li.dataset.id;

      // filter out the clicked task from `tasks`
      const newTasks = tasks.filter((task) => task.taskId != taskId);

      setTasks(newTasks);
      if (focusedTask && focusedTask.taskId === taskId) {
        // re-set the focusedTask to null if user deletes the focusedTask
        setFocusedTask(null);
      }

      // if a user is signed in, delete the task document from db
      if (auth.currentUser) {
        const tasksRef = collection(db, "tasks");

        const q = query(
          tasksRef,
          where("uid", "==", `${auth.currentUser?.uid}`),
          where("taskId", "==", `${taskId}`)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          deleteDoc(doc.ref);
        });
      }
    }
  }

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-center text-slate-400 h-4">
          {focusedTask ? focusedTask.title : "What are you focusing on?"}
        </h2>
        <div className="mt-8 flex items-center gap-6 justify-center">
          <img
            className="cursor-pointer"
            src="./add.svg"
            alt="add task"
            onClick={openTaskModal}
          />
          {children}
        </div>
      </div>
      <ul
        onClick={focusTask}
        className="flex flex-col gap-4 items-center justify-center text-slate-400"
      >
        {tasks.map((task) => {
          return (
            <li
              key={task.taskId}
              className={
                focusedTask
                  ? focusedTask.taskId === task.taskId
                    ? taskStyling.focused
                    : taskStyling.default
                  : taskStyling.default
              }
              data-id={task.taskId}
            >
              <p className="max-w-sm break-words">{task.title} </p>
              <div className="flex gap-4">
                <p>
                  {task.completedPomos} / {task.estimatedPomos}
                </p>
                <p
                  className="delete-btn cursor-pointer p-[2px] hover:text-red-400"
                  onClick={deleteTask}
                >
                  X
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {showTaskModal && (
        <AddTaskModal
          setShowTaskModal={setShowTaskModal}
          taskTitleRef={taskTitleRef}
          estPomosRef={estPomosRef}
          addTask={addTask}
        />
      )}
    </>
  );
};
