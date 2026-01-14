import { useHoverHighlight } from "@/hooks/useHoverHighlight";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";

export const PolicyCell = ({
  policyId,
  enableHover = false,
}: {
  policyId: string;
  enableHover?: boolean;
}) => {
  const {
    handleMouseEnter,
    handleMouseLeave,
    handleCopyMouseEnter,
    isHighlighted,
  } = useHoverHighlight(policyId, enableHover);
  return (
    <div onMouseLeave={handleMouseLeave} className='flex items-center gap-1'>
      <Link
        to='/policy/$policyId'
        params={{ policyId: policyId }}
        onMouseEnter={handleMouseEnter}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary`}
      >
        {formatString(policyId, "long")}
      </Link>
      <div onMouseEnter={handleCopyMouseEnter}>
        <Copy copyText={policyId} />
      </div>
    </div>
  );
};
