import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
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
  const { hoverValue, setHoverValue } = useHoverHighlightState();

  const handleMouseEnter = () => {
    if (enableHover) setHoverValue(policyId);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const isHighlighted = hoverValue === policyId;
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='flex items-center gap-1'
    >
      <Link
        to='/policy/$policyId'
        params={{ policyId: policyId }}
        className={` ${isHighlighted ? "rounded-s bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1/2" : "px-0"} text-text-sm text-primary`}
      >
        {formatString(policyId, "long")}
      </Link>
      <Copy copyText={policyId} />
    </div>
  );
};
