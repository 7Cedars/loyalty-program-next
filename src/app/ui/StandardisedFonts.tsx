type TitleTextProps = {
  title: string; 
  subtitle?: string;
  size?: 0 | 1 | 2;
  colourMode?: 0 | 1; // 0 = dark 1 = light 
}

type NoteTextProps = {
  message: string; 
  size?: 0 | 1 | 2;
}

const appearanceTitle = [
  "text-sm py-0",
  "text-lg py-0",
  "text-2xl py-1"
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

const colourTitle = [
  "text-slate-700 dark:text-slate-300",
  "text-slate-300 dark:text-slate-700"
]

export const TitleText = ({
  title, 
  subtitle, 
  size = 1,
  colourMode = 0
}: TitleTextProps) => {

  return (
    <div className="grid grid-cols-1 pb-2 px-2">
      <div className={`text-center font-bold ${colourTitle[colourMode]} ${appearanceTitle[size]}`}>
        {title}
      </div>
      <div className={`text-center text-slate-400 ${appearanceSubtitle[size]}`}>
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