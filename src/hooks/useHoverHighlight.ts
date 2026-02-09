import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";

export const useHoverHighlight = (
  value: string,
  enableHover: boolean = false,
) => {
  const { hoverValue, setHoverValue } = useHoverHighlightState();

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleCopyMouseEnter = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === value;

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleCopyMouseEnter,
    isHighlighted,
  };
};
