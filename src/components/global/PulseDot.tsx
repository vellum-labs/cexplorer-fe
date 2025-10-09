interface Props {
  size?: number;
  color?: string;
  animate?: boolean;
  overrideColor?: string;
}

const PulseDot = ({
  size = 2,
  color,
  animate = true,
  overrideColor = "",
}: Props) => {
  const sizeClass = `h-${size} w-${size}`;
  const isTailwindClass = color?.startsWith("bg-");
  const appliedClass = overrideColor || (isTailwindClass ? color : "");
  const appliedStyle = !isTailwindClass && color ? { backgroundColor: color } : {};

  return (
    <span className={`relative flex ${sizeClass}`}>
      <span
        className={`absolute inline-flex ${sizeClass} rounded-max ${appliedClass || "bg-greenText"} ${animate ? "animate-ping" : ""} opacity-75`}
        style={appliedStyle}
      />
      <span
        className={`relative inline-flex ${sizeClass} rounded-max ${appliedClass || "bg-greenText"}`}
        style={appliedStyle}
      />
    </span>
  );
};

export default PulseDot;
