// TODO
// proper types

export const AddTaskModal = ({
  setShowTaskModal,
  taskTitleRef,
  estPomosRef,
  addTask,
}: any) => {
  return (
    <div className="MODAL-WRAPPER fixed w-full h-full top-0 left-0 flex justify-center items-center bg-grayed-out">
      <form className="flex flex-col gap-2 p-4 bg-white rounded-2xl">
        <div
          className="cursor-pointer ml-auto"
          onClick={() => setShowTaskModal(false)}
        >
          X
        </div>
        <label htmlFor="task-title">What's next?</label>
        <input
          className="bg-off-white border rounded-md outline-none p-1 "
          id="task-title"
          ref={taskTitleRef}
        />
        <label htmlFor="estimated-pomos">Estimated Pomodoros?</label>
        <input
          className="bg-off-white border rounded-md outline-none p-1 "
          type="number"
          min="1"
          step="1"
          defaultValue="1"
          id="estimated-pomos"
          ref={estPomosRef}
        />
        <button
          className="mt-2 border bg-green-400 hover:bg-green-300 rounded-md"
          onClick={addTask}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};
