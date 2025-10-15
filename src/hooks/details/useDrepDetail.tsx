import type { OverviewList } from "@/components/global/cards/OverviewCard";
import type { useFetchDrepDetail } from "@/services/drep";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import Copy from "@/components/global/Copy";
import PulseDot from "@/components/global/PulseDot";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { Address, isValidAddressFormat } from "@/utils/address/getStakeAddress";
import { Link } from "@tanstack/react-router";

import AddressCell from "@/components/address/AddressCell";
import { TotalSumWithRates } from "@/components/global/TotalSumWithRates";
import { formatNumber, formatString } from "@/utils/format/format";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { useGetMarketCurrency } from "../useGetMarketCurrency";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { slotToDate } from "@/utils/slotToDate";
import { format } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { DelegatorsLabel } from "@/components/global/DelegatorsLabel";

interface UseDrepDetailArgs {
  query: ReturnType<typeof useFetchDrepDetail>;
}

interface UseDrepDetail {
  about: OverviewList;
  voting: OverviewList;
  governance: OverviewList;
}

const isSystemDrep = (id?: string) =>
  id === "drep_always_abstain" || id === "drep_always_no_confidence";

export const useDrepDetail = ({ query }: UseDrepDetailArgs): UseDrepDetail => {
  const data = query.data;
  const drepId = data?.hash?.view;
  const isSystem = isSystemDrep(drepId);
  const curr = useGetMarketCurrency();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const latestEpochNo = miscConst?.no;

  let outsum: [string, number, number, number] = ["", 0, 0, 0];
  if (data?.owner?.balance && Object.values(curr).length) {
    outsum = lovelaceToAdaWithRates(data.owner.balance, curr);
  }

  const currentEpochStats = Array.isArray(data?.distr)
    ? data.distr.find(item => item.epoch_no === latestEpochNo)
    : undefined;

  const currentPower = currentEpochStats?.power;
  const currentDelegators = currentEpochStats?.represented_by;

  const minDelegationAda = miscConst?.intra?.min_value
    ? (miscConst.intra.min_value / 1_000_000).toFixed(0)
    : "5";

  const about: OverviewList = isSystem
    ? [
        {
          label: "Name",
          value:
            drepId === "drep_always_abstain"
              ? "Always Abstain"
              : "Always No Confidence",
        },
        {
          label: "DRep ID",
          value: drepId ? (
            <div className='gap-1/2 flex items-center'>
              <span>{drepId}</span>
              <Copy copyText={drepId} className='translate-y-[2px]' />
            </div>
          ) : (
            "-"
          ),
        },
        { label: "Stake key", value: "N/A (system DRep)" },
        { label: "Registered", value: "System Default" },
        { label: "Last updated", value: "-" },
      ]
    : [
        {
          label: "Name",
          value: data?.data?.given_name ?? "-",
        },
        {
          label: "DRep ID",
          value: data?.hash?.view ? (
            <div className='gap-1/2 flex items-center'>
              <span>{formatString(data.hash.view, "long")}</span>
              <Copy copyText={data.hash.view} className='translate-y-[2px]' />
            </div>
          ) : (
            "-"
          ),
        },
        {
          label: "DRep ID (Legacy)",
          value: data?.hash?.legacy ? (
            <div className='gap-1/2 flex items-center'>
              <span>{formatString(data.hash.legacy, "long")}</span>
              <Copy copyText={data.hash.legacy} className='translate-y-[2px]' />
            </div>
          ) : (
            "-"
          ),
        },
        {
          label: "Stake key",
          value: data?.owner?.stake ? (
            <AddressCell address={data.owner.stake} />
          ) : (
            "Unknown"
          ),
        },
        {
          label: "Registered",
          value: data?.since ? <TimeDateIndicator time={data.since} /> : "-",
        },
        {
          label: "Last updated",
          value:
            Array.isArray(data?.action) &&
            data.action[data.action.length - 1]?.tx?.time ? (
              <TimeDateIndicator
                time={data.action[data.action.length - 1].tx.time}
              />
            ) : data?.cert?.update?.tx?.slot ? (
              <TimeDateIndicator
                time={format(
                  slotToDate(
                    data?.cert?.update?.tx?.slot,
                    miscConst?.epoch_stat.pots.slot_no ?? 0,
                    miscConst?.epoch_stat.epoch.start_time ?? "",
                  ),
                  "yyy-MM-dd HH:mm:ss",
                )}
              />
            ) : (
              "-"
            ),
        },
      ];

  const voting: OverviewList = isSystem
    ? [
        {
          label: "Status",
          value: (
            <div className='rounded-m relative flex h-[24px] w-fit items-center justify-end gap-1 border border-border px-[10px]'>
              <PulseDot color={"#00A9E3"} />
              <span className='text-text-xs font-medium'>System Default</span>
            </div>
          ),
        },
        {
          label: "DRep metadata",
          value: <span className='font-medium'>-</span>,
        },
        {
          label: "Voting power",
          value: currentPower ? (
            <AdaWithTooltip data={currentPower} />
          ) : (
            "Unknown"
          ),
        },
        {
          label: <DelegatorsLabel minDelegationAda={minDelegationAda} />,
          value: currentDelegators
            ? formatNumber(currentDelegators)
            : "Unknown",
        },
        { label: "Rewards address", value: "-" },
      ]
    : [
        {
          label: "Status",
          value:
            typeof data?.is_active === "undefined" ? (
              "-"
            ) : (
              <div className='rounded-m relative flex h-[24px] w-fit items-center justify-end gap-1 border border-border px-[10px]'>
                <PulseDot color={!data.is_active ? "bg-redText" : undefined} />
                <span className='text-text-xs font-medium'>
                  {data.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ),
        },
        {
          label: "DRep metadata",
          value:
            data?.data === null ? (
              <span className='font-medium text-redText'>Not provided</span>
            ) : (
              <Link
                to='/drep/$hash'
                params={{ hash: data?.hash.view || "" }}
                search={{ tab: "about" }}
                className='font-medium text-greenText'
              >
                Provided
              </Link>
            ),
        },
        {
          label: "Voting power",
          value: data?.amount ? <AdaWithTooltip data={data.amount} /> : "-",
        },
        {
          label: "Own voting power",
          value: data?.owner?.balance ? (
            <TotalSumWithRates sum={outsum} ada={data.owner.balance} />
          ) : (
            "Unknown"
          ),
        },
        {
          label: <DelegatorsLabel minDelegationAda={minDelegationAda} />,
          value: currentDelegators
            ? formatNumber(currentDelegators)
            : Array.isArray(data?.distr) &&
                data?.distr.length > 0 &&
                data?.distr[0]?.represented_by
              ? formatNumber(data?.distr[0]?.represented_by)
              : "-",
        },
        {
          label: "Rewards address",
          value: (() => {
            const address = data?.data?.payment_address;

            if (!address) {
              return "-";
            }

            if (!isValidAddressFormat(address)) {
              return "-";
            }

            try {
              const rewardsAddress = Address.from(address).rewardAddress;

              return rewardsAddress ? (
                <AddressCell address={rewardsAddress} />
              ) : (
                "-"
              );
            } catch {
              return "-";
            }
          })(),
        },
      ];

  const governance: OverviewList = isSystem
    ? [
        {
          label: "Behavior",
          value:
            drepId === "drep_always_abstain"
              ? "Automatically abstains from all governance votes."
              : "Automatically votes 'No Confidence' depending on the action type.",
        },
        {
          label: "Delegated Stake",
          value: currentPower ? (
            <AdaWithTooltip data={currentPower} />
          ) : (
            "Unknown"
          ),
        },
        {
          label: <DelegatorsLabel minDelegationAda={minDelegationAda} />,
          value: currentDelegators
            ? formatNumber(currentDelegators)
            : "Unknown",
        },
      ]
    : [
        {
          label: undefined,
          value: (() => {
            const votes = Array.isArray(data?.stat?.total?.votes)
              ? data.stat.total.votes
              : [];

            const opportunity = data?.stat?.total?.opportunity ?? 0;
            const votedTotal = votes.reduce((a, b) => a + b.count, 0);

            const percent =
              opportunity > 0 ? (votedTotal / opportunity) * 100 : 0;

            const calc = (type: "Yes" | "Abstain" | "No") =>
              votedTotal > 0
                ? ((votes.find(v => v.vote === type)?.count ?? 0) /
                    votedTotal) *
                  100
                : 0;

            const recentPercent = data?.votestat?.rate?.recent
              ? data.votestat.rate.recent * 100
              : 0;

            const lifetimePercent = data?.votestat?.rate?.total
              ? data.votestat.rate.total * 100
              : percent;

            return (
              <div className='flex h-full w-full flex-col gap-3'>
                {data?.votestat?.recent_vote && (
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-text-sm text-grayTextSecondary'>
                      Last vote
                    </span>
                    <TimeDateIndicator time={data.votestat.recent_vote} />
                  </div>
                )}
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='gap-1/2 flex items-center'>
                        <span className='text-text-sm text-grayTextSecondary'>
                          Recent Activity
                        </span>
                        <Tooltip content="DRep's voting activity over the past 6 months">
                          <CircleHelp
                            size={12}
                            className='text-grayTextPrimary'
                          />
                        </Tooltip>
                      </div>
                      <span className='text-text-sm text-grayTextPrimary'>
                        Voted: {recentPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#E4E7EC]'>
                      <span
                        className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                        style={{ width: `${recentPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col items-center gap-1'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='gap-1/2 flex items-center'>
                        <span className='text-text-sm text-grayTextSecondary'>
                          Lifetime Activity
                        </span>
                        <Tooltip content="Voting activity over DRep's lifetime">
                          <CircleHelp
                            size={12}
                            className='text-grayTextPrimary'
                          />
                        </Tooltip>
                      </div>
                      <span className='text-text-sm text-grayTextPrimary'>
                        Voted: {lifetimePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#E4E7EC]'>
                      <span
                        className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                        style={{ width: `${lifetimePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  {["Yes", "Abstain", "No"].map(vote => {
                    const votePercent = calc(vote as any).toFixed(2);
                    const color =
                      vote === "Yes"
                        ? "#47CD89"
                        : vote === "Abstain"
                          ? "#FEC84B"
                          : "#f04438";

                    const voteCount =
                      votes.find(v => v.vote === vote)?.count ?? 0;

                    return (
                      <div
                        className='flex items-center justify-between gap-1'
                        key={vote}
                      >
                        <span className='text-text-sm min-w-24 text-grayTextPrimary'>
                          {vote} ({voteCount})
                        </span>
                        <div className='relative h-2 w-2/3 overflow-hidden rounded-[4px] bg-[#E4E7EC]'>
                          <span
                            className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px]'
                            style={{
                              width: `${votePercent}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span className='text-text-sm flex min-w-[55px] items-end text-grayTextPrimary'>
                          {votePercent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })(),
        },
      ];

  return {
    about,
    voting,
    governance,
  };
};
