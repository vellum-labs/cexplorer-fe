import type { ReactNode } from "@tanstack/react-router";

interface Props {
  color:
    | "red"
    | "yellow"
    | "blue"
    | "purple"
    | "gray"
    | "green"
    | "light"
    | "none";
  children: ReactNode;
  rounded?: boolean;
  className?: string;
  small?: boolean;
  style?: React.CSSProperties;
}

export const Badge = ({
  color,
  children,
  rounded = true,
  className,
  small,
  style,
}: Props) => {
  let colorStyles = "";

  switch (color) {
    case "yellow":
      colorStyles = "bg-yellow-100 border-yellow-800/50 text-yellow-800";
      break;
    case "blue":
      colorStyles = "bg-blue-100 border-blue-800/50 text-blue-800";
      break;
    case "purple":
      colorStyles = "bg-purple-100 border-purple-800/50 text-purple-800";
      break;
    case "red":
      colorStyles = "bg-red-100 border-red-800/50 text-red-800";
      break;
    case "green":
      colorStyles = "bg-green-100 border-green-800/50 text-green-800";
      break;
    case "light":
      colorStyles = "bg-cardBg text-text border-border";
      break;
    case "gray":
      colorStyles = "bg-darker text-text border-border";
      break;
    case "none":
      colorStyles = "border-transparent bg-transparent border-none text-text";
      break;
  }

  return (
    <span
      style={style}
      className={`flex w-fit items-center gap-1 ${rounded ? "rounded-full" : "rounded"} border ${small ? "min-w-[18px] shrink-0 justify-center px-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"} text-right font-medium ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
};
