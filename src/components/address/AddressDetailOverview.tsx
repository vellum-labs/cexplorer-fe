import type { AddressDetailData } from "@/types/addressTypes";
import type { FC } from "react";

import { OverviewCard } from "../global/cards/OverviewCard";
import { TimeDateIndicator } from "../global/TimeDateIndicator";

import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import type { PoolInfo } from "@/types/poolTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { parseShelleyAddress } from "@/utils/address/parseShelleyAddress";
import { formatNumber, formatString } from "@/utils/format/format";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { Link } from "@tanstack/react-router";
import { TokenSelectCombobox } from "../asset/TokenSelect";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import AdaHandleBadge from "../global/badges/AdaHandleBadge";
import { AddressTypeInitialsBadge } from "../global/badges/AddressTypeInitialsBadge";
import Copy from "../global/Copy";
import { TotalSumWithRates } from "../global/TotalSumWithRates";
import DateCell from "../table/DateCell";
import PoolCell from "../table/PoolCell";
import { AddCustomLabel } from "./AddCustomLabel";
import AddressCell from "./AddressCell";
import { AttributeDropdown } from "../global/AttributeDropdown";
import { ChevronRight } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { configJSON } from "@/constants/conf";

interface AddressDetailOverviewProps {
  data: AddressDetailData[];
  address: string;
}

export const AddressDetailOverview: FC<AddressDetailOverviewProps> = ({
  data,
  address,
}) => {
  const { theme } = useThemeStore();
  const stakeKey = Address.from(address).stake;
  const stakeAddr = Address.from(address).rewardAddress;
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;
  const curr = useGetMarketCurrency();
  const isStaking = data[0]?.stake?.active_pool || data[0]?.stake?.live_pool;
  const isRecync = data[0]?.address === null;
  const rawAddress = Address.toHexString(Address.from(address).raw);

  const overviewList = [
    data[0]?.adahandle
      ? {
          label: "Handle",
          value: <AdaHandleBadge hex={data[0].adahandle.hex} link />,
        }
      : undefined,
    {
      label: "Address",
      value: (
        <p
          className='flex items-center gap-[6px]'
          title={isRecync ? address : (data[0]?.address ?? "")}
        >
          <span>
            {formatString(
              isRecync ? address : (data[0]?.address ?? ""),
              "long",
            )}
          </span>
          <Copy
            copyText={isRecync ? address : (data[0]?.address ?? "")}
            className='translate-y-[2px]'
          />
        </p>
      ),
    },
    nftMarket && tokenMarket
      ? { label: "Assets Balance", value: "TBD" }
      : undefined,
    {
      label: "ADA Balance",
      value: isRecync ? (
        <p>Calculating</p>
      ) : (
        <TotalSumWithRates
          sum={lovelaceToAdaWithRates(data[0].balance, curr)}
          ada={data[0].balance}
        />
      ),
    },
    data[0].stake?.balance?.live
      ? {
          label: "Live Stake",
          value: <AdaWithTooltip data={data[0].stake.balance.live} />,
        }
      : undefined,
    data[0].stake?.balance?.active
      ? {
          label: "Active Stake",
          value: <AdaWithTooltip data={data[0].stake.balance.active} />,
        }
      : undefined,
    {
      label: "Last Activity",
      value: isRecync ? (
        <p>Currently unavailable</p>
      ) : (
        <DateCell time={data[0].activity.recent} />
      ),
    },
    { label: "Private name", value: <AddCustomLabel address={address} /> },
  ];

  const delegationArr = [
    {
      label: "Status",
      value: (
        <span
          className={` ${isStaking ? "text-greenText" : "text-redText"} font-bold`}
        >
          {isStaking ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      label: "Stake pool",
      value: (
        <div className='w-full max-w-[220px] sm:max-w-[250px]'>
          {isStaking ? (
            <PoolCell
              poolInfo={
                (data[0]?.stake?.active_pool ??
                  data[0]?.stake?.live_pool) as PoolInfo
              }
            />
          ) : (
            "Not delegated"
          )}
        </div>
      ),
    },
    {
      label: "DRep delegation",
      value: (
        <div className='flex flex-col'>
          {data[0]?.vote?.vote?.live_drep === "drep_always_abstain" ? (
            data[0]?.vote?.drep?.data?.given_name ? (
              <Link
                to='/drep/$hash'
                params={{ hash: data[0]?.vote?.drep?.hash?.view }}
                className={"w-fit text-primary"}
              >
                {data[0]?.vote?.drep?.data?.given_name}
                <span className='text-sm text-primary'>Always abstain</span>
              </Link>
            ) : (
              <span className='text-sm'>Always abstain</span>
            )
          ) : (
            <AttributeDropdown
              items={[
                {
                  label: "Status",
                  value: data[0]?.vote?.drep?.is_active ? (
                    <span className='text-greenText'>Active</span>
                  ) : (
                    <span className='text-redText'>Inactive</span>
                  ),
                },
                {
                  label: "Amount",
                  value: data[0]?.vote?.drep?.amount
                    ? formatNumber(data[0]?.vote?.drep?.amount)
                    : "-",
                },
                {
                  label: "Since",
                  value: (
                    <DateCell
                      time={data[0]?.vote?.drep?.since}
                      className='text-xs'
                    />
                  ),
                },
                {
                  label: "ID",
                  value: (
                    <div className='flex items-center gap-2'>
                      <span className={"text-xs"}>
                        {formatString(data[0]?.vote?.drep?.hash?.view, "long")}
                      </span>
                      <Copy
                        copyText={data[0]?.vote?.drep?.hash?.view}
                        size={10}
                      />
                    </div>
                  ),
                  visible: !!data[0]?.vote?.drep?.data?.given_name,
                },
              ]}
            >
              <div
                className={`flex w-fit cursor-pointer items-center gap-1 rounded-md border ${theme === "light" ? "border-[#E4E7EC]" : "border-gray-600"} p-1`}
              >
                {data[0]?.vote?.drep?.data?.given_name ? (
                  <Link
                    to='/drep/$hash'
                    params={{ hash: data[0]?.vote?.drep?.hash?.view }}
                    className={"w-fit text-primary"}
                  >
                    {data[0]?.vote?.drep?.data?.given_name}
                  </Link>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Link
                      to='/drep/$hash'
                      params={{ hash: data[0]?.vote?.drep?.hash?.view }}
                      className={"text-sm text-primary"}
                    >
                      {formatString(data[0]?.vote?.drep?.hash?.view, "long")}
                    </Link>
                    <Copy
                      copyText={data[0]?.vote?.drep?.hash?.view}
                      size={13}
                    />
                  </div>
                )}
                <ChevronRight size={15} />
              </div>
            </AttributeDropdown>
          )}
        </div>
      ),
      visible: !!data[0]?.vote,
    },
    stakeKey && {
      label: "Controlled Stake",
      value: <AdaWithTooltip data={data[0]?.stake?.balance.live ?? 0} />,
    },
    stakeKey && {
      label: "Rewards Available",
      value: (
        <AdaWithTooltip
          data={
            (data[0]?.stake?.reward.total ?? 0) -
            (data[0]?.stake?.reward.withdrawn ?? 0)
          }
        />
      ),
    },
    stakeKey && {
      label: "Rewards Withdrawn",
      value: <AdaWithTooltip data={data[0]?.stake?.reward.withdrawn ?? 0} />,
    },
    {
      label: "Stake Key",
      value: <AddressCell address={stakeAddr} className='text-[16px]' />,
    },
    {
      label: "Raw address",
      value: (
        <p className='flex items-center gap-[6px]' title={rawAddress}>
          <span>{formatString(rawAddress, "long")}</span>
          <Copy copyText={rawAddress} className='translate-y-[2px]' />
        </p>
      ),
    },
  ];

  const detail = [
    { label: "Type", value: <AddressTypeInitialsBadge address={address} /> },
    {
      label: "Address",
      value: (
        <p
          className='flex items-center gap-[6px]'
          title={data[0]?.extract?.address ?? ""}
        >
          <span>{formatString(data[0]?.extract?.address ?? "", "long")}</span>
          <Copy
            copyText={data[0]?.extract?.address ?? ""}
            className='translate-y-[2px]'
          />
        </p>
      ),
    },
    {
      label: "Payment Credential",
      value: (
        <p
          className='flex items-center gap-[6px]'
          title={data[0]?.extract?.payment ?? ""}
        >
          {parseShelleyAddress(address)?.paymentPart === "ScriptHash" ? (
            <Link
              to='/script/$hash'
              params={{ hash: data[0].extract?.payment }}
              className='text-primary'
            >
              {formatString(data[0]?.extract?.payment ?? "", "long")}
            </Link>
          ) : (
            <span>{formatString(data[0]?.extract?.payment ?? "", "long")}</span>
          )}
          <Copy
            copyText={data[0]?.extract?.payment ?? ""}
            className='translate-y-[2px]'
          />
        </p>
      ),
    },
    {
      label: "Staking Credential",
      value: (
        <p
          className='flex items-center gap-[6px]'
          title={data[0]?.extract?.stake ?? ""}
        >
          <span>
            {data[0]?.extract?.stake
              ? formatString(data[0]?.extract?.stake, "long")
              : "-"}
          </span>
          <Copy
            copyText={data[0]?.extract?.stake ?? ""}
            className='translate-y-[2px]'
          />
        </p>
      ),
    },
    {
      label: "Last Activity",
      value: <TimeDateIndicator time={data[0]?.activity?.recent ?? ""} />,
    },
    {
      label: "First Discovery",
      value: <TimeDateIndicator time={data[0]?.activity?.first ?? ""} />,
    },
  ];

  return (
    <>
      <OverviewCard
        title='Overview'
        overviewList={overviewList}
        endContent={
          data[0].asset &&
          data[0].asset.length > 0 && (
            <TokenSelectCombobox className='mb-2' items={data[0].asset} />
          )
        }
        className=''
      />
      {stakeKey && (
        <OverviewCard
          title='Delegation'
          overviewList={delegationArr as any}
          className=''
        />
      )}
      <OverviewCard title='Detail' overviewList={detail} className='' />
    </>
  );
};
