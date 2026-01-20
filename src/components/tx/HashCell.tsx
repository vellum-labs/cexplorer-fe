import { useHoverHighlight } from "@/hooks/useHoverHighlight";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";

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
  const {
    handleMouseEnter,
    handleMouseLeave,
    handleCopyMouseEnter,
    isHighlighted,
  } = useHoverHighlight(hash, enableHover);

  if (!hash) return "-";

  return (
    <div onMouseLeave={handleMouseLeave} className='flex items-center gap-1'>
      <Link
        to={href || "/tx/$hash"}
        params={{ hash: hash }}
        onMouseEnter={handleMouseEnter}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"}text-text-sm text-primary`}
      >
        {formatString(hash, formatType)}
      </Link>
      <div onMouseEnter={handleCopyMouseEnter}>
        <Copy copyText={hash} />
      </div>
    </div>
  );
};
