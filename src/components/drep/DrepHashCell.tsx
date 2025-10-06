import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";

export const DrepHashCell = ({
  view,
  enableHover = false,
}: {
  view: string;
  enableHover?: boolean;
}) => {
  const { hoverValue, setHoverValue } = useHoverHighlightState();

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(view);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === view;

  if (!view) return "-";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='flex items-center gap-1'
    >
      <Link
        to='/drep/$hash'
        params={{ hash: view }}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-sm text-primary`}
      >
        {formatString(view, "long")}
      </Link>
      <Copy copyText={view} />
    </div>
  );
};
