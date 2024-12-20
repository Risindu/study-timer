import { nanoid } from "nanoid";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import { Nav } from "./components/Nav";
import { SettingsCard } from "./components/SettingsCard";
import { SettingsCogwheel } from "./components/SettingsCogwheel";
import { Tasks } from "./components/Tasks";
import { Timer } from "./components/Timer";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { UserView } from "./components/UserView";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import { SettingsContext } from "./contexts/SettingsContext";

import { Task } from "./types";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG1NWlywerCoSfUJ4u5o5VSg5TbR435U8",
  authDomain: "studytimer-aa1bf.firebaseapp.com",
  projectId: "studytimer-aa1bf",
  storageBucket: "studytimer-aa1bf.firebasestorage.app",
  messagingSenderId: "293550573392",
  appId: "1:293550573392:web:ceb9b62d75fc603ace0e55",
  measurementId: "G-DXQPS1C77K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();
const provider = new GoogleAuthProvider();

const STATUS = {
  STARTED: "started",
  STOPPED: "stopped",
};

const defaultSettings = {
  pomoLength: 0.05,
  shortBreak: 0.05,
  longBreak: 0.05,
  font: "kumbh",
  color: "hl",
};

function App() {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(() => {
    if (localStorage.getItem("settings")) {
      const localSettings = JSON.parse(localStorage.getItem("settings") || "");
      return localSettings;
    }
    return defaultSettings;
  });

  const [selectedFont, setSelectedFont] = useState("kumbh");
  const [selectedColor, setSelectedColor] = useState("hl");
  const [percentLeft, setPercentLeft] = useState(100);

  const [secondsRemaining, setSecondsRemaining] = useState(2);

  const [status, setStatus] = useState(STATUS.STOPPED);
  const intervalRef: MutableRefObject<number | NodeJS.Timer> = useRef(0);

  const [mode, setMode] = useState("pomoLength");

  const [focusedTask, setFocusedTask] = useState<Task | null>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>("");

  const defaultTasks = [
    {
      title: "important thing ",
      estimatedPomos: 20,
      completedPomos: 0,
      taskId: nanoid(),
      dateCreated: new Date(),
    },
    {
      title: "important stuff",
      estimatedPomos: 5,
      completedPomos: 0,
      taskId: nanoid(),
      dateCreated: new Date(),
    },
    {
      title: "important task",
      estimatedPomos: 2,
      completedPomos: 0,
      taskId: nanoid(),
      dateCreated: new Date(),
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  async function signin() {
    const result = await signInWithPopup(auth, provider);

    setUserName(result.user.displayName);
    setIsSignedIn(true);

    // try to load any existing tasks saved to the user:
    const savedTasks: Task[] = [];

    // create a reference to the `tasks` collection
    const tasksRef = collection(db, "tasks");
    // create a query
    const q = query(tasksRef, where("uid", "==", `${result.user.uid}`));

    // execute the query
    const querySnapshot = await getDocs(q);

    // loop through query results and push each result to `savedTasks`
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data()); // docs matched by the query
      savedTasks.push(doc.data() as Task);
    });

    // if the user had existing tasks, overwrite the default tasks
    if (savedTasks.length > 0) {
      setTasks(savedTasks);
    }
  }

  function signout() {
    auth.signOut();
    setIsSignedIn(false);
    setUserName("");
    setTasks(defaultTasks);
  }

  //reset clock when user changes settings
  useEffect(() => {
    setSecondsRemaining(settings.pomoLength * 60);
    setMode("pomoLength");
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  function startPomo() {
    if (status === STATUS.STOPPED) {
      setStatus(STATUS.STARTED);
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((secondsRemaining) => {
          if (secondsRemaining > 0) {
            setPercentLeft(
              ((secondsRemaining - 1) / 60 / settings[mode]) * 100
            );
            return secondsRemaining - 1;
          } else {
            alert("Times up!");
            clearInterval(intervalRef.current);
            setStatus(STATUS.STOPPED);

            if (mode === "pomoLength") {
              if (focusedTask) {
                focusedTask.completedPomos += 1;

                // if a user is signed in, update doc in firestore
                if (auth.currentUser) {
                  const tasksRef = collection(db, "tasks");

                  async function updateDocs() {
                    const q = query(
                      tasksRef,
                      where("uid", "==", `${auth.currentUser?.uid}`),
                      where("taskId", "==", `${focusedTask!.taskId}`)
                    );

                    const querySnapshot = await getDocs(q);

                    querySnapshot.forEach(async (document) => {
                      const docRef = doc(db, "tasks", document.id);

                      await updateDoc(docRef, {
                        completedPomos: focusedTask!.completedPomos,
                      });
                    });
                  }

                  updateDocs();
                }
              }
              setMode("shortBreak");
              setPercentLeft(100);
              return settings.shortBreak * 60;
            } else if (mode === "shortBreak") {
              setMode("longBreak");
              setPercentLeft(100);
              return settings.longBreak * 60;
            } else {
              setMode("pomoLength");
              setPercentLeft(100);
              return settings.pomoLength * 60;
            }
          }
        });
      }, 1000);
    }
    //pause the timer
    else {
      setStatus(STATUS.STOPPED);
      clearInterval(intervalRef.current);
    }
  }

  function openSettings() {
    if (settingsRef.current) {
      settingsRef.current.style.display = "block";
      setSelectedFont(settings.font);
      setSelectedColor(settings.color);
    }
  }

  function manuallyChangeMode(newMode: string) {
    clearInterval(intervalRef.current);
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(settings[newMode] * 60);
    setMode(newMode);
    setPercentLeft(100);
  }

  return (
    <>
      <SettingsContext.Provider value={settings}>
        <div
          className={`container font-${settings.font} flex flex-col justify-center align-center gap-10 pb-20`}
        >
          <h1 className="text-light-purple text-4xl m-auto mt-5 xl:text-5xl">
            pomodoro
          </h1>

          <div className="m-auto md:absolute top-5 right-20 ">
            <UserView
              signin={signin}
              isSignedIn={isSignedIn}
              userName={userName}
              signout={signout}
            />
          </div>

          <Nav mode={mode} manuallyChangeMode={manuallyChangeMode} />

          <Timer
            startPomo={startPomo}
            percentLeft={percentLeft}
            secondsRemaining={secondsRemaining}
            status={status}
          />

          <Tasks
            tasks={tasks}
            setTasks={setTasks}
            focusedTask={focusedTask}
            setFocusedTask={setFocusedTask}
            db={db}
            auth={auth}
          >
            <SettingsCogwheel openSettings={openSettings} />
          </Tasks>
        </div>
        <div
          ref={settingsRef}
          className={`FULLPAGE hidden w-full h-full fixed top-0 right-0 p-4 bg-grayed-out`}
        >
          <SettingsCard
            settingsRef={settingsRef}
            setSettings={setSettings}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      </SettingsContext.Provider>
    </>
  );
}

export default App;
