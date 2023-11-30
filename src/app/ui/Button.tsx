// I am using this as an example for now to create modular range slider (and modal). 
// Taken from react-graph-gallery github repo.  

type ButtonProps = {
  isDisabled?: boolean;
  isFilled?: boolean;
  children: any;
  onClick: () => void;
  size?: "sm" | "md";
};

export const Button = ({
  children,
  onClick,
  isFilled,
  size = "md",
}: ButtonProps) => {
  let appearance = "rounded m-1 grow ";

  if (size === "sm") {
    appearance += "text-sm pb-1";
  }
  if (size === "md") {
    appearance += "text-md py-2 px-12";
  }

  if (isFilled) {
    appearance += " bg-blue-500 hover:bg-blue-600 text-white";
  } else {
    appearance +=
      "border-2 border-gray-500 bg-white/50 hover:bg-gray-400 hover:text-white";
  }

  return (
    <button className={appearance} onClick={onClick}>
      {children}
    </button>
  );
};
