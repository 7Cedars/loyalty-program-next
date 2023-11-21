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
  let appearance = "rounded m-1  text-blue-500 ";

  if (size === "sm") {
    appearance += "text-sm py-1 px-12";
  }
  if (size === "md") {
    appearance += "text-md py-2 px-16";
  }

  if (isFilled) {
    appearance += " bg-blue-500 hover:bg-blue-600 text-white";
  } else {
    appearance +=
      "border border-blue-500 bg-white text-gray-400 hover:bg-gray-400 hover:text-white";
  }

  return (
    <button className={appearance} onClick={onClick}>
      {children}
    </button>
  );
};
