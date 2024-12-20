export type Settings = {
    pomoLength: number;
    shortBreak: number;
    longBreak: number;
    font: string;
    color: string;
}

export type Task = {
    title: string;
    estimatedPomos: number;
    completedPomos: number;
    taskId: string;
    dateCreated: Date;
  };