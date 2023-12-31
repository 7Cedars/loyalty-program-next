type TitleTextProps = {
  title: string; 
  subtitle?: string;
  size?: 0 | 1 | 2;
}

type NoteTextProps = {
  message: string; 
  size?: 0 | 1 | 2;
}

const appearanceTitle = [
  "text-sm py-1 px-12",
  "text-lg py-1 px-16",
  "text-2xl py-1 px-24"
]

const appearanceSubtitle = [
  "text-xs",
  "text-md",
  "text-lg"
]

const appearanceNote = [
  "text-xs",
  "text-md",
  "text-lg"
]

export const TitleText = ({
  title, 
  subtitle, 
  size = 1,
}: TitleTextProps) => {

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className={`text-center font-bold ${appearanceTitle[size]}`}>
        {title}
      </div>
      <div className={`text-center text-gray-800 ${appearanceSubtitle[size]}`}>
        {subtitle}
      </div>
    </div>
  );
};

export const NoteText = ({
  message, 
  size = 1,
}: NoteTextProps) => {

  return (
    <div className="grid grid-cols-1 gap-1 text-center text-gray-500 font-sm">
      <div className={`text-center italic ${appearanceNote[size]}`}>
        {message}
      </div>
    </div>
  );
};