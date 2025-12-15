import type { useFetchGovernanceActionDetail } from "@/services/governance";
import type { FC } from "react";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";

import { Image } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { Link } from "@tanstack/react-router";
import { GovernanceStatusBadge } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { determineApproval } from "@/utils/determineApproval";
import {
  shouldDRepVote,
  shouldSPOVote,
  shouldCCVote,
} from "@/utils/governanceVoting";
import { GovernanceCard } from "./GovernanceCard";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { transformAnchorUrl } from "@/utils/format/transformAnchorUrl";

import { useState } from "react";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { VoteBadge } from "@vellumlabs/cexplorer-sdk";
import type { Vote } from "@/constants/votes";

interface GovernanceDetailOverviewProps {
  query: ReturnType<typeof useFetchGovernanceActionDetail>;
}

export const GovernanceDetailOverview: FC<GovernanceDetailOverviewProps> = ({
  query,
}) => {
  const committeeMembers = query?.data?.data?.committee?.member;
  const votingProcedure = query?.data?.data?.voting_procedure;

  const [clickedUrl, setClickedUrl] = useState<string | undefined>(undefined);

  const votingDreps = (votingProcedure ?? []).filter(
    item => item?.voter_role === "DRep",
  );

  const votingSPOs = (votingProcedure ?? []).filter(
    item => item?.voter_role === "SPO",
  );

  const spoTotalStake = query.data?.data?.total?.spo?.stake ?? 0;

  const spoAlwaysAbstain =
    query.data?.data?.total?.spo?.drep_always_abstain?.stake ?? 0;
  const spoAlwaysNoConfidence =
    query.data?.data?.total?.spo?.drep_always_no_confidence?.stake ?? 0;

  const spoAbstainManual = votingSPOs
    .filter(item => item?.vote === "Abstain")
    .reduce((a, b) => a + b?.stat?.stake, 0);

  const spoAbstainStake = spoAbstainManual + spoAlwaysAbstain;
  const spoVotingStake = spoTotalStake - spoAbstainStake;

  const calculateStake = (votingGroup, voteType: any = null) => {
    return votingGroup
      .filter(item => (voteType ? item?.vote === voteType : true))
      .reduce((a, b) => a + (b?.stat?.stake || 0), 0);
  };

  const drepsYes = calculateStake(votingDreps, "Yes");
  const drepsNo = calculateStake(votingDreps, "No");
  const drepsNoConfidence =
    query.data?.data?.total?.drep?.drep_always_no_confidence?.stake ?? 0;

  const drepsYesCount = (votingProcedure ?? []).find(
    v => v.vote === "Yes" && v.voter_role === "DRep",
  )?.count;
  const drepsNoCount = (votingProcedure ?? []).find(
    v => v.vote === "No" && v.voter_role === "DRep",
  )?.count;
  const drepsAbstainManual =
    (votingProcedure ?? []).find(
      v => v.vote === "Abstain" && v.voter_role === "DRep",
    )?.stat.stake ?? 0;
  const drepsAbstainCount =
    (votingProcedure ?? []).find(
      v => v.vote === "Abstain" && v.voter_role === "DRep",
    )?.count ?? 0;
  const drepsAbstainAuto =
    query.data?.data?.total?.drep?.drep_always_abstain?.stake ?? 0;
  const drepsNoConfidenceDelegators =
    query.data?.data?.total?.drep?.drep_always_no_confidence?.represented_by ??
    0;

  const drepTotalStake =
    (query.data?.data?.total?.drep?.stake ?? 0) +
    (query.data?.data?.total?.drep?.drep_always_abstain?.stake ?? 0) +
    (query.data?.data?.total?.drep?.drep_always_no_confidence?.stake ?? 0);
  const drepAbstainStake = drepsAbstainManual + drepsAbstainAuto;
  const drepVotingStake = drepTotalStake - drepAbstainStake;

  const drepsNotVotedStake =
    drepTotalStake -
    (drepsYes + drepsNo + drepsNoConfidence + drepAbstainStake);

  const drepsWhoVotedCount = votingDreps.length;

  const totalDrepCount = query.data?.data?.total?.drep?.count ?? 0;

  const drepsNotVotedCount = totalDrepCount - drepsWhoVotedCount;

  const sposYes = calculateStake(votingSPOs, "Yes");
  const sposNoManual = calculateStake(votingSPOs, "No");
  const sposNo = sposNoManual + spoAlwaysNoConfidence;
  const sposNotVoted = spoTotalStake - (sposYes + sposNo + spoAbstainStake);

  const sposYesCount =
    (votingProcedure ?? []).find(
      v => v.vote === "Yes" && v.voter_role === "SPO",
    )?.count ?? 0;

  const sposNoCount =
    (votingProcedure ?? []).find(v => v.vote === "No" && v.voter_role === "SPO")
      ?.count ?? 0;

  const sposAbstainCount =
    (votingProcedure ?? []).find(
      v => v.vote === "Abstain" && v.voter_role === "SPO",
    )?.count ?? 0;

  const sposAbstainManualFromVoting =
    (votingProcedure ?? []).find(
      v => v.vote === "Abstain" && v.voter_role === "SPO",
    )?.stat.stake ?? 0;

  const sposNotVotedCount =
    (query.data?.data?.total?.spo?.count ?? 0) - votingSPOs.length;

  const generatePieChartData = (yes, no, noConfidence, notVoted) => [
    {
      value: yes,
      name: "Yes",
      itemStyle: { color: "#1296DB" },
    },
    {
      value: no,
      name: "No",
      itemStyle: { color: "#D66A10" },
    },
    {
      value: noConfidence,
      name: "No confidence",
      itemStyle: { color: "#E89128" },
    },
    {
      value: notVoted,
      name: "Not voted",
      itemStyle: { color: "#F7B96E" },
    },
  ];

  const drepsPieChartData = [
    { value: drepsYes, name: "Yes", itemStyle: { color: "#1296DB" } },
    { value: drepsNo, name: "No", itemStyle: { color: "#D66A10" } },
    {
      value: drepsNoConfidence,
      name: "No confidence",
      itemStyle: { color: "#E89128" },
    },
    {
      value: drepsNotVotedStake,
      name: "Not voted",
      itemStyle: { color: "#F7B96E" },
    },
  ];

  const sposPieChartData = generatePieChartData(
    sposYes,
    sposNoManual,
    spoAlwaysNoConfidence,
    sposNotVoted,
  );

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const { startTime } = calculateEpochTimeByNumber(
    query?.data?.data?.expiration ?? 0,
    miscConst?.epoch.no ?? 0,
    miscConst?.epoch.start_time ?? "",
  );

  const {
    sPOsApproved,
    dRepsApproved,
    constitutionalCommitteeApproved,
    drepThreshold,
    spoThreshold,
  } = determineApproval(
    query?.data?.data?.epoch_param?.[0] ?? {},
    query?.data?.data?.committee?.member ?? [],
    query?.data?.data?.committee ?? {},
    query?.data?.data?.type ?? "",
    drepsYes / (drepsYes + drepsNo + drepsNoConfidence + drepsNotVotedStake),
    sposYes / (sposYes + sposNo + sposNotVoted),
  );

  const ccQuorum = query?.data?.data?.committee?.quorum;
  const ccThreshold =
    ccQuorum && ccQuorum.denuminator > 0
      ? Math.ceil((ccQuorum.numerator / ccQuorum.denuminator) * 100).toFixed(2)
      : "67.00";

  const action = [
    {
      label: "Title",
      value: query?.data?.data?.anchor?.offchain?.name ?? "⚠️ Invalid metadata",
    },
    {
      label: "Action type",
      value: query?.data?.data?.type ? (
        <ActionTypes title={query?.data?.data?.type as ActionTypes} />
      ) : (
        "-"
      ),
    },
    {
      label: "Action ID",
      value: (
        <div className='flex items-center gap-1/2'>
          <span>
            {formatString(query?.data?.data?.ident?.bech ?? "", "longer")}
          </span>
          <Copy copyText={query?.data?.data?.ident?.bech} />
        </div>
      ),
    },
    {
      label: "Action start date",
      value: query?.data?.data?.tx?.time ? (
        <TimeDateIndicator time={query?.data?.data?.tx?.time} />
      ) : (
        "-"
      ),
    },
    {
      label: "Voting deadline",
      value:
        query?.data?.data?.expiration &&
        startTime &&
        !isNaN(startTime.getTime()) ? (
          <TimeDateIndicator time={startTime.toISOString()} />
        ) : (
          "-"
        ),
    },
  ];

  const blockchain_records = [
    {
      label: "Submit transaction",
      value: (
        <Link
          to='/tx/$hash'
          params={{
            hash: query?.data?.data?.tx?.hash ?? "",
          }}
        >
          <span className='text-primary'>
            {formatString(query?.data?.data?.tx?.hash ?? "", "longer")}
          </span>
        </Link>
      ),
    },
    {
      label: "Stake address",
      value: (
        <Link
          to='/stake/$stakeAddr'
          params={{
            stakeAddr: query?.data?.data?.return_address?.view ?? "",
          }}
        >
          <span className='text-primary'>
            {formatString(
              query?.data?.data?.return_address?.view ?? "",
              "longer",
            )}
          </span>
        </Link>
      ),
    },
    {
      label: "Deposit",
      value: <AdaWithTooltip data={query?.data?.data?.deposit ?? 0} />,
    },
    {
      label: "Anchor",
      value: (
        <div className='flex flex-col gap-1/2'>
          <span>
            {formatString(query?.data?.data?.anchor?.data_hash ?? "", "longer")}
          </span>
          <a
            target='_blank'
            href={transformAnchorUrl(query?.data?.data?.anchor?.url) ?? ""}
            className='text-primary'
            onClick={e => {
              e.preventDefault();
              const transformedUrl = transformAnchorUrl(
                query?.data?.data?.anchor?.url,
              );
              setClickedUrl(transformedUrl);
            }}
          >
            {formatString(
              transformAnchorUrl(query?.data?.data?.anchor?.url),
              "longer",
            )}
          </a>
        </div>
      ),
    },
  ];

  const yesCount = (committeeMembers ?? [])?.filter(
    item => item?.vote === "Yes",
  ).length;
  const noCount = (committeeMembers ?? [])?.filter(
    item => item?.vote === "No",
  ).length;
  const notVotedCount = (committeeMembers ?? [])?.filter(
    item => item?.vote === null,
  ).length;

  const votingMembers = yesCount + noCount + notVotedCount;

  const howMuchVoted =
    votingMembers > 0 ? ((yesCount * 100) / votingMembers).toFixed(2) : "0.00";

  const yesPercent =
    votingMembers > 0 ? Math.round((yesCount * 100) / votingMembers) : 0;
  const noPercent =
    votingMembers > 0 ? Math.round((noCount * 100) / votingMembers) : 0;

  const votedPercent = {
    yes: yesPercent,
    no: noPercent,
    notVoted: 100 - yesPercent - noPercent,
  };

  const const_committee = [
    ...(committeeMembers ?? []).map(item => {
      const name = item?.registry?.name ?? "Unknown";
      const ccId = item?.ident?.raw ?? "";

      const fallbackletters = [...name]
        .filter(char => /[a-zA-Z0-9]/.test(char))
        .join("");

      return {
        label: (
          <div className='flex items-center gap-1.5 py-0.5 text-text-sm'>
            <Image
              src={generateImageUrl(ccId, "ico", "cc")}
              className='h-[18px] w-[18px] rounded-m object-cover'
              alt={name}
              height={18}
              width={18}
              fallbackletters={fallbackletters}
            />
            <span>
              {name !== "Unknown" ? name : formatString(ccId, "long")}
            </span>
          </div>
        ),
        value: (() => {
          return (
            <div className='flex w-full items-center justify-end'>
              <VoteBadge vote={item?.vote as Vote} />
            </div>
          );
        })(),
      };
    }),
  ];

  const dreps = [
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Total stake</span>
          <Tooltip content='All ADA delegated to DReps'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <AdaWithTooltip data={drepTotalStake} />
          <span className='text-text-xs text-grayTextSecondary'>(100%)</span>
        </div>
      ),
    },
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Abstain stake</span>
          <Tooltip content='ADA that abstains from voting'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <Tooltip
            content={
              <div className='flex flex-col'>
                <span>
                  DRep votes:{" "}
                  <AdaWithTooltip data={drepsAbstainManual} tooltip={false} />
                </span>
                <span>
                  Always abstain:{" "}
                  <AdaWithTooltip data={drepsAbstainAuto} tooltip={false} />
                </span>
              </div>
            }
          >
            <AdaWithTooltip data={drepAbstainStake} tooltip={false} />
          </Tooltip>
          <span className='text-text-xs text-grayTextSecondary'>
            ({((drepAbstainStake * 100) / drepTotalStake).toFixed(2)}%)
          </span>
        </div>
      ),
    },
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Voting stake</span>
          <Tooltip content='ADA participating in voting'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <AdaWithTooltip data={drepVotingStake} />
          <span className='text-text-xs text-grayTextSecondary'>
            ({((drepVotingStake * 100) / drepTotalStake).toFixed(2)}%)
          </span>
        </div>
      ),
    },
  ];

  const spos = [
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Total stake</span>
          <Tooltip content='All ADA delegated to SPOs'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <AdaWithTooltip data={spoTotalStake} />
          <span className='text-text-xs text-grayTextSecondary'>(100%)</span>
        </div>
      ),
    },
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Abstain stake</span>
          <Tooltip content='ADA that abstains from voting'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <Tooltip
            content={
              <div className='flex flex-col'>
                <span>
                  SPO votes:{" "}
                  <AdaWithTooltip data={spoAbstainManual} tooltip={false} />
                </span>
                <span>
                  Always abstain:{" "}
                  <AdaWithTooltip data={spoAlwaysAbstain} tooltip={false} />
                </span>
              </div>
            }
          >
            <AdaWithTooltip data={spoAbstainStake} tooltip={false} />
          </Tooltip>
          <span className='text-text-xs text-grayTextSecondary'>
            (
            {(spoAbstainStake * 100) / spoTotalStake < 100
              ? ((spoAbstainStake * 100) / spoTotalStake).toFixed(2)
              : "100"}
            %)
          </span>
        </div>
      ),
    },
    {
      label: (
        <div className='flex items-center gap-1/2'>
          <span>Voting stake</span>
          <Tooltip content='ADA participating in voting'>
            <CircleHelp size={11} className='text-grayTextPrimary' />
          </Tooltip>
        </div>
      ),
      value: (
        <div className='flex items-center justify-end gap-1'>
          <AdaWithTooltip data={spoVotingStake} />
          <span className='text-text-xs text-grayTextSecondary'>
            (
            {(spoVotingStake * 100) / spoTotalStake < 100
              ? ((spoVotingStake * 100) / spoTotalStake).toFixed(2)
              : "100"}
            %)
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className='flex w-full flex-col items-center gap-1'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
            {query.isLoading ? (
              <>
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
              </>
            ) : (
              !query.isError && (
                <>
                  <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                    <OverviewCard
                      title='Governance action'
                      subTitle={
                        <GovernanceStatusBadge
                          item={
                            query?.data?.data ?? {
                              dropped_epoch: null,
                              enacted_epoch: null,
                              expired_epoch: null,
                              ratified_epoch: null,
                            }
                          }
                          currentEpoch={miscConst?.no ?? 0}
                        />
                      }
                      overviewList={action}
                      className='h-full'
                    />
                  </div>

                  <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                    <OverviewCard
                      title='Blockchain records'
                      overviewList={blockchain_records}
                      className='h-full'
                    />
                  </div>
                </>
              )
            )}
          </div>
        </div>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
          <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
            {query.isLoading ? (
              <>
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
                <LoadingSkeleton
                  height='227px'
                  rounded='xl'
                  className='grow basis-[300px] px-4 py-2'
                />
              </>
            ) : (
              !query.isError && (
                <>
                  {shouldCCVote(query.data?.data?.type ?? "") ? (
                    <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                      <OverviewCard
                        title='Constitutional committee'
                        subTitle={
                          constitutionalCommitteeApproved ? (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] px-[10px]'>
                              <PulseDot color='#17B26A' animate />
                              <span className='text-text-xs font-medium text-[#17B26A]'>
                                Approved
                              </span>
                            </div>
                          ) : (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#FEDF89] bg-[#FFFAEB] px-[10px]'>
                              <PulseDot color='#F79009' animate />
                              <span className='text-text-xs font-medium text-[#B54708]'>
                                Not approved
                              </span>
                            </div>
                          )
                        }
                        showTitleDivider
                        labelClassname='w-full'
                        tBodyClassname={`${(committeeMembers ?? []).length > 7 ? "max-h-[300px] thin-scrollbar px-1/2 overflow-auto" : ""}`}
                        leading
                        hFit
                        endContent={
                          <div
                            className={`flex w-full flex-col justify-end py-1 ${(committeeMembers ?? []).length < 7 ? "h-full" : ""} ${(committeeMembers ?? []).length === 7 ? "pb-0" : "pb-2"}`}
                          >
                            <div className='mt-1 flex w-full items-center justify-between border-t border-border pt-1'>
                              <div className='flex items-center gap-[2px]'>
                                <Tooltip forceDirection='right' content={<span className='inline-block max-w-[200px]'>Minimum percentage of Constitutional Committee members required to approve this governance action</span>}>
                                  <CircleHelp
                                    size={11}
                                    className='cursor-help text-grayTextPrimary'
                                  />
                                </Tooltip>
                                <span className='text-text-xs font-medium text-grayTextPrimary'>
                                  Threshold:
                                </span>
                              </div>
                              <span className='text-text-xs font-medium text-grayTextPrimary'>
                                {ccThreshold}%
                              </span>
                            </div>
                            <div className='flex w-full items-center gap-1.5 pt-1'>
                              <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                                <span
                                  className='absolute top-0 block h-2 bg-[#00A9E3]'
                                  style={{
                                    width: `${votedPercent?.yes}%`,
                                  }}
                                ></span>
                                <span
                                  className='absolute top-0 block h-2 bg-grayTextSecondary'
                                  style={{
                                    width: `${votedPercent?.notVoted}%`,
                                    left: `calc(${votedPercent?.yes}% + 0px)`,
                                  }}
                                ></span>
                                <span
                                  className='absolute top-0 block h-2 bg-[#DC6803]'
                                  style={{
                                    width: `${votedPercent?.no}%`,
                                    left: `calc(${votedPercent?.yes}% + ${votedPercent?.notVoted}% + 0px)`,
                                  }}
                                ></span>
                              </div>
                              <div className='flex gap-1 text-text-xs font-medium text-grayTextPrimary'>
                                <span className=''>{howMuchVoted}%</span>
                              </div>
                            </div>
                          </div>
                        }
                        overviewList={const_committee}
                        className='h-full'
                      />
                    </div>
                  ) : null}

                  {shouldDRepVote(query.data?.data?.type ?? "") ? (
                    <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                      <OverviewCard
                        title={
                          <div className='flex items-center gap-1'>
                            <span>DReps</span>
                            <span className='text-text-sm font-regular text-grayTextPrimary'>
                              {query.data?.data?.total.drep.count}
                            </span>
                          </div>
                        }
                        subTitle={
                          dRepsApproved ? (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] px-[10px]'>
                              <PulseDot color='#17B26A' animate />
                              <span className='text-text-xs font-medium text-[#17B26A]'>
                                Approved
                              </span>
                            </div>
                          ) : (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#FEDF89] bg-[#FFFAEB] px-[10px]'>
                              <PulseDot color='#F79009' animate />
                              <span className='text-text-xs font-medium text-[#B54708]'>
                                Not approved
                              </span>
                            </div>
                          )
                        }
                        showTitleDivider
                        showContentDivider
                        threshold={
                          shouldDRepVote(query.data?.data?.type ?? "")
                            ? drepThreshold
                            : undefined
                        }
                        voterType='drep'
                        endContent={
                          <GovernanceCard
                            yes={drepsYes}
                            no={drepsNo}
                            noConfidence={drepsNoConfidence}
                            notVoted={drepsNotVotedStake}
                            pieChartData={drepsPieChartData}
                            voterType='drep'
                            breakdown={{
                              yes: { voters: drepsYesCount ?? 0 },
                              no: { voters: drepsNoCount ?? 0 },
                              notVoted: { voters: drepsNotVotedCount },
                              abstain: {
                                voters: drepsAbstainCount,
                                autoStake: drepsAbstainAuto,
                                manualStake: drepsAbstainManual,
                              },
                              noConfidence: {
                                delegators: drepsNoConfidenceDelegators,
                              },
                            }}
                          />
                        }
                        hFit
                        overviewList={dreps}
                        className='h-full'
                      />
                    </div>
                  ) : (
                    <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                      <OverviewCard
                        title={
                          <div className='flex items-center gap-1'>
                            <span>DReps</span>
                            <span className='text-text-sm font-regular text-grayTextPrimary'>
                              {query.data?.data?.total.drep.count}
                            </span>
                          </div>
                        }
                        showTitleDivider
                        className='h-full'
                        endContent={
                          <div className='flex h-full items-center justify-center text-text-sm text-grayTextSecondary'>
                            DReps are not voting on this governance action
                          </div>
                        }
                      />
                    </div>
                  )}

                  {shouldSPOVote(
                    query.data?.data?.type ?? "",
                    votingProcedure,
                  ) ? (
                    <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                      <OverviewCard
                        title={
                          <div className='flex items-center gap-1'>
                            <span>SPOs</span>
                            <span className='text-text-sm font-regular text-grayTextPrimary'>
                              {query.data?.data?.total.spo.count}
                            </span>
                          </div>
                        }
                        subTitle={
                          sPOsApproved ? (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] px-[10px]'>
                              <PulseDot color='#17B26A' animate />
                              <span className='text-text-xs font-medium text-[#17B26A]'>
                                Approved
                              </span>
                            </div>
                          ) : (
                            <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-xl border border-[#FEDF89] bg-[#FFFAEB] px-[10px]'>
                              <PulseDot color='#F79009' animate />
                              <span className='text-text-xs font-medium text-[#B54708]'>
                                Not approved
                              </span>
                            </div>
                          )
                        }
                        showTitleDivider
                        showContentDivider
                        threshold={
                          shouldSPOVote(
                            query.data?.data?.type ?? "",
                            votingProcedure,
                          )
                            ? spoThreshold
                            : undefined
                        }
                        voterType='spo'
                        overviewList={spos}
                        className='h-full'
                        endContent={
                          <GovernanceCard
                            yes={sposYes}
                            no={sposNo}
                            noConfidence={spoAlwaysNoConfidence}
                            notVoted={sposNotVoted}
                            pieChartData={sposPieChartData}
                            voterType='spo'
                            breakdown={{
                              yes: { voters: sposYesCount },
                              no: { voters: sposNoCount },
                              notVoted: { voters: sposNotVotedCount },
                              abstain: {
                                voters: sposAbstainCount,
                                autoStake: spoAlwaysAbstain,
                                manualStake: sposAbstainManualFromVoting,
                              },
                              noConfidence: {
                                delegators:
                                  query.data?.data?.total?.spo
                                    ?.drep_always_no_confidence
                                    ?.represented_by ?? 0,
                              },
                            }}
                          />
                        }
                        hFit
                      />
                    </div>
                  ) : (
                    <div className='flex-grow basis-[410px] md:flex-shrink-0'>
                      <OverviewCard
                        title={
                          <div className='flex items-center gap-1'>
                            <span>SPOs</span>
                            <span className='text-text-sm font-regular text-grayTextPrimary'>
                              {query.data?.data?.total.spo.count}
                            </span>
                          </div>
                        }
                        showTitleDivider
                        className='h-full'
                        endContent={
                          <div className='flex h-full items-center justify-center text-text-sm text-grayTextSecondary'>
                            SPOs are not voting on this governance action
                          </div>
                        }
                      />
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </section>
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(undefined)}
        />
      )}
    </>
  );
};
