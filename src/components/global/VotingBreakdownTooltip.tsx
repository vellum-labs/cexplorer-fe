import { FC } from "react";
import { Tooltip } from "../ui/tooltip";
import { Info } from "lucide-react";

interface VotingBreakdownTooltipProps {
  voters?: number;
  delegators?: number;
  autoStake?: number;
  manualStake?: number;
  type?: "Abstain" | "No confidence" | "Yes" | "No" | "Not voted";
  voterType?: "drep" | "spo";
}

export const VotingBreakdownTooltip: FC<VotingBreakdownTooltipProps> = ({
  voters,
  delegators,
  autoStake,
  manualStake,
  type,
  voterType = "drep",
}) => {
  return (
    <Tooltip
      content={
        <div className='flex flex-col gap-1/2 text-sm text-text'>
          {voters !== undefined && (
            <span>
              <b>{voters}</b> {voters === 1 ? "voter" : "voters"}
            </span>
          )}
          {delegators !== undefined && (
            <span>
              Represented by <b>{delegators}</b>{" "}
              {voterType === "spo"
                ? `stake pool${delegators !== 1 ? "s" : ""}`
                : `delegator${delegators !== 1 ? "s" : ""}`}
            </span>
          )}
          {type === "Abstain" &&
            autoStake !== undefined &&
            manualStake !== undefined && (
              <>
                <span>
                  Auto stake: <b>{autoStake}</b>
                </span>
                <span>
                  Manual stake: <b>{manualStake}</b>
                </span>
              </>
            )}
        </div>
      }
    >
      <Info size={14} className='ml-1/2 cursor-pointer text-grayTextSecondary' />
    </Tooltip>
  );
};
