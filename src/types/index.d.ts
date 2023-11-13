export interface UserInputState  {
  modal: string, // take out? 
  screenDimensions: ScreenDimensions,
  settings: {
    darkMode: bool, 
    developerMode: bool 
  }
}

export type ScreenDimensions = {
  width: number,
  height: number
}

export type Notification = {
  id: string;
  message?: string;
  colour?: "red" | "yellow" | "green" | "gray" | "invisible"
  durationInMs?: number | "noTimer";
  progressInPercent?: number | "noProgress";
  visible?: boolean; 
}
