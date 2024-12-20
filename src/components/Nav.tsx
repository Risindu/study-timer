import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { IColorVariants } from "./ColorOption";

interface INavProps {
  mode: string;
  manuallyChangeMode: Function;
}

const defaultStyling = "cursor-pointer p-4 text-center";

export const Nav = ({ mode, manuallyChangeMode }: INavProps) => {
  const settings = useContext(SettingsContext);

  const colorOptions: IColorVariants = {
    hl: "bg-hl p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700",
    teal: "bg-teal p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700",
    violet:
      "bg-violet p-4 rounded-full text-dark-bg text-center cursor-pointer duration-700",
  };

  return (
    <nav className="flex max-sm:text-xs">
      <ul className="flex items-center justify-around px-4 py-2 gap-9 text-light-purple font-bold bg-dark-bg rounded-full m-auto xl:scale-110">
        <li
          className={
            mode === "pomoLength"
              ? colorOptions[settings!.color as keyof IColorVariants]
              : defaultStyling
          }
          onClick={() => manuallyChangeMode("pomoLength")}
        >
          pomodoro
        </li>
        <li
          className={
            mode === "shortBreak"
              ? colorOptions[settings!.color as keyof IColorVariants]
              : defaultStyling
          }
          onClick={() => manuallyChangeMode("shortBreak")}
        >
          short break
        </li>
        <li
          className={
            mode === "longBreak"
              ? colorOptions[settings!.color as keyof IColorVariants]
              : defaultStyling
          }
          onClick={() => manuallyChangeMode("longBreak")}
        >
          long break
        </li>
      </ul>
    </nav>
  );
};
