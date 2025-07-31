import { useHoverHighlightState } from "@/stores/states/hoverHighlightState";
import { formatString } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";

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
      className='flex items-center gap-2'
    >
      <Link
        to='/policy/$policyId'
        params={{ policyId: policyId }}
        className={` ${isHighlighted ? "rounded-md bg-hoverHighlight outline outline-1 outline-highlightBorder" : ""} block overflow-hidden overflow-ellipsis whitespace-nowrap ${enableHover ? "px-1" : "px-0"} text-sm text-primary`}
      >
        {formatString(policyId, "long")}
      </Link>
      <Copy copyText={policyId} />
    </div>
  );
};
