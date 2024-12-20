interface IColorOptionProps {
  colorRef: React.MutableRefObject<string>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  color: string;
}

export interface IColorVariants {
  hl: string;
  teal: string;
  violet: string;
}

export const ColorOption = ({
  colorRef,
  selectedColor,
  setSelectedColor,
  color,
}: IColorOptionProps) => {
  // https://tailwindcss.com/docs/content-configuration#class-detection-in-depth
  const colorVariants: IColorVariants = {
    hl: "bg-hl w-10 h-10 rounded-full flex justify-center items-center cursor-pointer",
    teal: "bg-teal w-10 h-10 rounded-full flex justify-center items-center cursor-pointer",
    violet:
      "bg-violet w-10 h-10 rounded-full flex justify-center items-center cursor-pointer",
  };

  // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
  // colorVariants[color as keyof IColorVariants]

  return (
    <div
      className={colorVariants[color as keyof IColorVariants]}
      onClick={() => {
        setSelectedColor(color);
        colorRef.current = color;
      }}
    >
      <div
        className={`${
          selectedColor === color ? "scale-1" : "scale-0"
        } duration-200`}
      >
        X
      </div>
    </div>
  );
};
