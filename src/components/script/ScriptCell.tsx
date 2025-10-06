import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";

export const ScriptCell = ({
  hash,
  enableHover = false,
}: {
  hash: string;
  enableHover?: boolean;
}) => {
  const { hoverValue, setHoverValue } = useHoverHighlightState();

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(hash);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === hash;
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='flex items-center gap-1'
    >
      <Link
        to='/script/$hash'
        params={{ hash: hash }}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary`}
      >
        {formatString(hash, "long")}
      </Link>
      <Copy copyText={hash} />
    </div>
  );
};
