import { useHoverHighlight } from "@/hooks/useHoverHighlight";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";

export const DrepHashCell = ({
  view,
  enableHover = false,
}: {
  view: string;
  enableHover?: boolean;
}) => {
  const {
    handleMouseEnter,
    handleMouseLeave,
    handleCopyMouseEnter,
    isHighlighted,
  } = useHoverHighlight(view, enableHover);

  if (!view) return "-";

  return (
    <div onMouseLeave={handleMouseLeave} className='flex items-center gap-1'>
      <Link
        to='/drep/$hash'
        params={{ hash: view }}
        onMouseEnter={handleMouseEnter}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary`}
      >
        {formatString(view, "long")}
      </Link>
      <div onMouseEnter={handleCopyMouseEnter}>
        <Copy copyText={view} />
      </div>
    </div>
  );
};
