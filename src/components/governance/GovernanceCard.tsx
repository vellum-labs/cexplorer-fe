import type { FC } from "react";

import { CheckSquare, XSquare } from "lucide-react";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { GovernanceDetailOverviewInfoGraph } from "./graphs/GovernanceDetailOverviewInfoGraph";
import { useThemeStore } from "@/stores/themeStore";
import { VotingBreakdownTooltip } from "../global/VotingBreakdownTooltip";

interface GovernanceCardProps {
  query?: any;
  yes: number;
  no: number;
  noConfidence: number;
  notVoted: number;
  pieChartData: any;
  isDrep?: boolean;
  breakdown: {
    yes: { voters: number };
    no: { voters: number };
    notVoted: { voters: number };
    abstain: {
      voters: number;
      autoStake: number;
      manualStake: number;
    };
    noConfidence: {
      delegators: number;
    };
  };
}

export const GovernanceCard: FC<GovernanceCardProps> = ({
  yes,
  no,
  noConfidence,
  notVoted,
  pieChartData,
  isDrep = false,
  breakdown,
}) => {
  const { theme } = useThemeStore();

  const voted = (yes / (yes + no + noConfidence + notVoted)) * 100;
  const notVotedPercent =
    ((no + noConfidence + notVoted) / (yes + no + noConfidence + notVoted)) *
    100;

  return (
    <div className='flex h-full w-full items-center'>
      <div className='flex w-full flex-col gap-3'>
        <div className='flex flex-col gap-1 py-2'>
          <div className='flex items-center gap-[6px]'>
            <CheckSquare size={18} className='font-bold text-[#0094D4]' />
            <span className='text-sm font-bold text-[#0094D4]'>
              {Number.isNaN(voted) ? "0.00" : voted.toFixed(2)}%
            </span>
          </div>
          <div
            className={`flex items-center justify-between rounded-[4px] border border-[#0094D4] p-2 ${theme === "dark" ? "bg-[#1C384B]" : "bg-[#EFFAFF]"}`}
          >
            <span className='text-sm font-medium text-grayTextPrimary'>
              Yes
            </span>
            <div className='flex items-center justify-end'>
              <AdaWithTooltip
                data={yes}
                triggerClassName='text-sm font-medium text-grayTextPrimary'
              />
              <VotingBreakdownTooltip
                type='Yes'
                voters={breakdown.yes.voters}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1 py-2'>
          <div className='flex items-center gap-[6px]'>
            <XSquare size={18} className='font-bold text-[#DC6803]' />
            <span className='text-sm font-bold text-[#DC6803]'>
              {Number.isNaN(notVotedPercent)
                ? "0.00"
                : notVotedPercent.toFixed(2)}
              %
            </span>
          </div>
          <div
            className={`rounded-[4px] border border-[#DC6803] p-2 ${theme === "dark" ? "bg-[#392E33]" : "bg-[#FFFAEB]"}`}
          >
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-grayTextPrimary'>
                No
              </span>
              <div className='flex items-center justify-end'>
                <AdaWithTooltip
                  data={no}
                  triggerClassName='text-sm font-medium text-grayTextPrimary'
                />
                <VotingBreakdownTooltip
                  type='No'
                  voters={breakdown.no.voters}
                />
              </div>
            </div>
            {isDrep && (
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-grayTextPrimary'>
                  No confidence
                </span>
                <div className='flex items-center justify-end text-nowrap'>
                  <AdaWithTooltip
                    data={noConfidence}
                    triggerClassName='text-sm font-medium text-grayTextPrimary'
                  />
                  <VotingBreakdownTooltip
                    type='No confidence'
                    delegators={breakdown.noConfidence.delegators}
                  />
                </div>
              </div>
            )}
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-grayTextPrimary'>
                Not voted
              </span>
              <div className='flex items-center justify-end'>
                <AdaWithTooltip
                  data={notVoted}
                  triggerClassName='text-sm font-medium text-grayTextPrimary'
                />
                <VotingBreakdownTooltip
                  type='Not voted'
                  voters={breakdown.notVoted.voters}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full justify-center pt-12'>
        <GovernanceDetailOverviewInfoGraph data={pieChartData} />
      </div>
    </div>
  );
};
