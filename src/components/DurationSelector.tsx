import { nanoid } from "nanoid";
import { forwardRef } from "react";

interface IDurationSelectorProps {
  mode: string;
  options: number[];
}

export const DurationSelector = forwardRef(
  (
    { mode, options }: IDurationSelectorProps,
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => {
    return (
      <div className="flex justify-between">
        <p className="text-gray-400">{mode}</p>
        <select
          ref={ref}
          name="short-break"
          className="bg-off-white pr-16 pl-2 py-1 rounded-md border"
        >
          {options.map((duration) => (
            <option key={nanoid()} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
