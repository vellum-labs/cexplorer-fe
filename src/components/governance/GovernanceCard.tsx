import type { FC } from "react";

import { CheckSquare, XSquare } from "lucide-react";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { GovernanceDetailOverviewInfoGraph } from "./graphs/GovernanceDetailOverviewInfoGraph";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { VotingBreakdownTooltip } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceCardProps {
  query?: any;
  yes: number;
  no: number;
  noConfidence: number;
  notVoted: number;
  pieChartData: any;
  voterType?: "drep" | "spo";
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
  breakdown,
  voterType = "drep",
}) => {
  const { t } = useAppTranslation();
  const { theme } = useThemeStore();

  const totalVotes = yes + no + noConfidence + notVoted;
  const voted = totalVotes > 0 ? (yes / totalVotes) * 100 : 0;
  const notVotedPercent =
    totalVotes > 0 ? ((no + noConfidence + notVoted) / totalVotes) * 100 : 0;

  return (
    <div className='flex h-full w-full items-center'>
      <div className='flex w-full flex-col gap-1.5'>
        <div className='flex flex-col gap-1/2 py-1'>
          <div className='flex items-center gap-[6px]'>
            <CheckSquare size={18} className='font-bold text-[#0094D4]' />
            <span className='text-text-sm font-bold text-[#0094D4]'>
              {Number.isNaN(voted) ? "0.00" : voted.toFixed(2)}%
            </span>
          </div>
          <div
            className={`flex items-center justify-between rounded-[4px] border border-[#0094D4] p-1 ${theme === "dark" ? "bg-[#1C384B]" : "bg-[#EFFAFF]"}`}
          >
            <span className='text-text-sm font-medium text-grayTextPrimary'>
              {t("governance.common.yes")}
            </span>
            <div className='flex items-center justify-end'>
              <AdaWithTooltip
                data={yes}
                triggerClassName='text-text-sm font-medium text-grayTextPrimary'
              />
              <VotingBreakdownTooltip
                type='Yes'
                voters={breakdown.yes.voters}
                voterType={voterType}
                labels={{
                  voteLabel: t("common:sdk.votingBreakdownTooltip.voteLabel"),
                  votersLabel: t("common:sdk.votingBreakdownTooltip.votersLabel"),
                  voterLabel: t("common:sdk.votingBreakdownTooltip.voterLabel"),
                  delegatorsLabel: t("common:sdk.votingBreakdownTooltip.delegatorsLabel"),
                  noConfidenceLabel: t("common:sdk.votingBreakdownTooltip.noConfidenceLabel"),
                  autoAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.autoAbstainStakeLabel"),
                  manualAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.manualAbstainStakeLabel"),
                }}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1/2 py-1'>
          <div className='flex items-center gap-[6px]'>
            <XSquare size={18} className='font-bold text-[#DC6803]' />
            <span className='text-text-sm font-bold text-[#DC6803]'>
              {Number.isNaN(notVotedPercent)
                ? "0.00"
                : notVotedPercent.toFixed(2)}
              %
            </span>
          </div>
          <div
            className={`rounded-[4px] border border-[#DC6803] p-1 ${theme === "dark" ? "bg-[#392E33]" : "bg-[#FFFAEB]"}`}
          >
            <div className='flex items-center justify-between'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                {t("governance.common.no")}
              </span>
              <div className='flex items-center justify-end'>
                <AdaWithTooltip
                  data={no}
                  triggerClassName='text-text-sm font-medium text-grayTextPrimary'
                />
                <VotingBreakdownTooltip
                  type='No'
                  voters={breakdown.no.voters}
                  voterType={voterType}
                  labels={{
                    voteLabel: t("common:sdk.votingBreakdownTooltip.voteLabel"),
                    votersLabel: t("common:sdk.votingBreakdownTooltip.votersLabel"),
                    voterLabel: t("common:sdk.votingBreakdownTooltip.voterLabel"),
                    delegatorsLabel: t("common:sdk.votingBreakdownTooltip.delegatorsLabel"),
                    noConfidenceLabel: t("common:sdk.votingBreakdownTooltip.noConfidenceLabel"),
                    autoAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.autoAbstainStakeLabel"),
                    manualAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.manualAbstainStakeLabel"),
                  }}
                />
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                {t("governance.common.noConfidence")}
              </span>
              <div className='flex items-center justify-end text-nowrap'>
                <AdaWithTooltip
                  data={noConfidence}
                  triggerClassName='text-text-sm font-medium text-grayTextPrimary'
                />
                <VotingBreakdownTooltip
                  type='No confidence'
                  delegators={breakdown.noConfidence.delegators}
                  voterType={voterType}
                  labels={{
                    voteLabel: t("common:sdk.votingBreakdownTooltip.voteLabel"),
                    votersLabel: t("common:sdk.votingBreakdownTooltip.votersLabel"),
                    voterLabel: t("common:sdk.votingBreakdownTooltip.voterLabel"),
                    delegatorsLabel: t("common:sdk.votingBreakdownTooltip.delegatorsLabel"),
                    noConfidenceLabel: t("common:sdk.votingBreakdownTooltip.noConfidenceLabel"),
                    autoAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.autoAbstainStakeLabel"),
                    manualAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.manualAbstainStakeLabel"),
                  }}
                />
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-text-sm font-medium text-grayTextPrimary'>
                {t("governance.common.notVoted")}
              </span>
              <div className='flex items-center justify-end'>
                <AdaWithTooltip
                  data={notVoted}
                  triggerClassName='text-text-sm font-medium text-grayTextPrimary'
                />
                <VotingBreakdownTooltip
                  type='Not voted'
                  voters={breakdown.notVoted.voters}
                  voterType={voterType}
                  labels={{
                    voteLabel: t("common:sdk.votingBreakdownTooltip.voteLabel"),
                    votersLabel: t("common:sdk.votingBreakdownTooltip.votersLabel"),
                    voterLabel: t("common:sdk.votingBreakdownTooltip.voterLabel"),
                    delegatorsLabel: t("common:sdk.votingBreakdownTooltip.delegatorsLabel"),
                    noConfidenceLabel: t("common:sdk.votingBreakdownTooltip.noConfidenceLabel"),
                    autoAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.autoAbstainStakeLabel"),
                    manualAbstainStakeLabel: t("common:sdk.votingBreakdownTooltip.manualAbstainStakeLabel"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full justify-center pt-6'>
        <GovernanceDetailOverviewInfoGraph data={pieChartData} />
      </div>
    </div>
  );
};
