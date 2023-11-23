type SubTitleProps = {
  title: string, 
  size: "sm" | "md" | "lg"
}

export const SectionTitle = ({
  title, 
  size = "md",
}: SubTitleProps) => {
  let appearance = "text-center";

  if (size === "sm") {
    appearance += "text-sm py-1 px-12";
  }
  if (size === "md") {
    appearance += "text-md py-2 px-16";
  }
  if (size === "lg") {
    appearance += "text-lg py-3 px-24";
  }

  return (
    <div className={appearance}>
      {title}
    </div>
  );
};