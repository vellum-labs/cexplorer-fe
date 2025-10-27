import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, TriangleAlert } from "lucide-react";
import { VoteBadge } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

interface VoteCellProps {
  vote?: Vote | string;
  txHash?: string;
  proposalId?: string;
  isLate?: boolean;
}

export const VoteCell: FC<VoteCellProps> = ({
  vote,
  txHash,
  proposalId,
  isLate = false,
}) => {
  if (!vote) {
    return "-";
  }

  return (
    <div className='flex items-center gap-1'>
      {txHash && (
        <Link
          to='/gov/vote/$hash'
          params={{ hash: txHash }}
          search={{ tab: proposalId }}
          className='text-muted-foreground text-primary'
          title='Open vote detail'
        >
          <FileText size={16} />
        </Link>
      )}
      <VoteBadge vote={vote as Vote} />
      {isLate && (
        <Tooltip content='This vote was submitted after voting closed'>
          <TriangleAlert size={16} className='text-yellow-500' />
        </Tooltip>
      )}
    </div>
  );
};
