import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { formatString } from "@/utils/format/format";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";

export const HashCell = ({
  hash,
  enableHover = false,
  href,
  formatType = "long",
}: {
  hash: string;
  enableHover?: boolean;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  formatType?: "short" | "long" | "shorter" | "longer";
}) => {
  const { hoverValue, setHoverValue } = useHoverHighlightState();

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(hash);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === hash;

  if (!hash) return "-";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='flex items-center gap-1'
    >
      <Link
        to={href || "/tx/$hash"}
        params={{ hash: hash }}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"}text-text-sm text-primary`}
      >
        {formatString(hash, formatType)}
      </Link>
      <Copy copyText={hash} />
    </div>
  );
};
