import { useHoverHighlight } from "@/hooks/useHoverHighlight";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";

export const ScriptCell = ({
  hash,
  enableHover = false,
}: {
  hash: string;
  enableHover?: boolean;
}) => {
  const { handleMouseEnter, handleMouseLeave, handleCopyMouseEnter, isHighlighted } =
    useHoverHighlight(hash, enableHover);
  return (
    <div
      onMouseLeave={handleMouseLeave}
      className='flex items-center gap-1'
    >
      <Link
        to='/script/$hash'
        params={{ hash: hash }}
        onMouseEnter={handleMouseEnter}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary`}
      >
        {formatString(hash, "long")}
      </Link>
      <div onMouseEnter={handleCopyMouseEnter}>
        <Copy copyText={hash} />
      </div>
    </div>
  );
};
