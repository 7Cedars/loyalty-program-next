// I am using this as an example for now to create modular range slider (and modal). 
// Taken from react-graph-gallery github repo.  

type ButtonProps = {
  isDisabled?: boolean;
  isFilled?: boolean;
  children: any;
  onClick: () => void;
  appearance?: "blueFilled" | "blueEmpty" | "grayFilled" | "grayEmpty" |  "greenFilled" | "greenEmpty" | "redFilled" | "redEmpty" 
};

export const Button = ({
  children,
  onClick,
  appearance = "blueEmpty",
  isDisabled = false
}: ButtonProps) => {

  const appearanceButton = {
    blueFilled:  "rounded m-1 grow text-md py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white", 
    blueEmpty:   "rounded m-1 grow text-md py-2 px-4 border-2 border-blue-400 text-blue-400 bg-white/50 hover:text-blue-700 hover:border-blue-700", 
    grayFilled:  "rounded m-1 grow text-md py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white", 
    grayEmpty:   "rounded m-1 grow text-md py-2 px-4 border-2 border-gray-400 text-gray-400 bg-white/50 hover:text-gray-700 hover:border-gray-700", 
    greenFilled: "rounded m-1 grow text-md py-2 px-4 bg-green-500 hover:bg-green-600 text-white", 
    greenEmpty:  "rounded m-1 grow text-md py-2 px-4 border-2 border-green-400 text-green-400 bg-white/50 hover:text-green-700 hover:border-green-700", 
    redFilled:   "rounded m-1 grow text-md py-2 px-4 bg-red-500 hover:bg-red-600 text-white", 
    redEmpty:    "rounded m-1 grow text-md py-2 px-4 border-2 border-red-400 text-red-400 bg-white/50 hover:bg-red-200/50 hover:text-red-700 hover:border-red-700", 
  }

  return (
    <button className={appearanceButton[appearance]} onClick={onClick} disabled= {isDisabled} >
      {children}
    </button>
  );
};
