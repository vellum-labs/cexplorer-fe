import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { VoteBadge } from "@/components/global/badges/VoteBadge";
import type { Vote } from "@/constants/votes";

interface VoteCellProps {
  vote?: Vote | string;
  txHash?: string;
  proposalId?: string;
}

export const VoteCell: FC<VoteCellProps> = ({
  vote,
  txHash,
  proposalId,
}) => {
  if (!vote) {
    return "-";
  }

  return (
    <div className='flex items-center gap-2'>
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
    </div>
  );
};