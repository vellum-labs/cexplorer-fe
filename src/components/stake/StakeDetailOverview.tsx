import { type FC } from "react";

import { OverviewCard } from "../global/cards/OverviewCard";

import type { PoolInfo } from "@/types/poolTypes";
import type { StakeDetailData } from "@/types/stakeTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { formatNumber, formatString } from "@/utils/format/format";
import { AddCustomLabel } from "../address/AddCustomLabel";
import { TokenSelectCombobox } from "../asset/TokenSelect";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import AdaHandleBadge from "../global/badges/AdaHandleBadge";
import { Badge } from "../global/badges/Badge";
import Copy from "../global/Copy";
import PoolCell from "../table/PoolCell";
import { AttributeDropdown } from "../global/AttributeDropdown";
import DateCell from "../table/DateCell";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useThemeStore } from "@/stores/themeStore";
import { configJSON } from "@/constants/conf";

interface AddressDetailOverviewProps {
  data: StakeDetailData | undefined;
  stakeAddress: string;
}

export const StakeDetailOverview: FC<AddressDetailOverviewProps> = ({
  data,
  stakeAddress,
}) => {
  const address = data?.view || stakeAddress;
  const addrObj = Address.from(address);
  const rawAddress = Address.toHexString(addrObj.raw);
  const tokenMarket = configJSON.market[0].token[0].active;
  const { theme } = useThemeStore();

  const overviewList = [
    data?.adahandle
      ? {
          label: "Handle",
          value: <AdaHandleBadge hex={data?.adahandle?.hex} link />,
        }
      : undefined,
    {
      label: "Total balance",
      value: <AdaWithTooltip data={data?.stake?.live.amount ?? 0} />,
    },
    tokenMarket ? { label: "Assets balance", value: "TBD" } : undefined,
    {
      label: "ADA balance",
      value: <AdaWithTooltip data={data?.stake?.active?.amount ?? 0} />,
    },
    { label: "Private name", value: <AddCustomLabel address={address} /> },
  ];

  const stakeKey = [
    {
      label: "Status",
      value: (
        <>
          {data?.stake?.info?.active ? (
            <Badge className='' color='green'>
              Active
            </Badge>
          ) : data?.stake?.info?.active === null ? (
            <Badge className='' color='red'>
              Inactive
            </Badge>
          ) : (
            <Badge className='' color='yellow'>
              Deregistered
            </Badge>
          )}
        </>
      ),
    },
    data?.stake?.info?.active
      ? {
          label: "Stake pool",
          value: (
            <div className='w-full max-w-[220px] sm:max-w-[250px]'>
              <PoolCell
                poolInfo={
                  (data?.stake?.active?.deleg ??
                    data?.stake?.live?.deleg) as PoolInfo
                }
              />
            </div>
          ),
        }
      : undefined,
    {
      label: "Rewards available",
      value: (
        <AdaWithTooltip
          data={(data?.reward?.total ?? 0) - (data?.reward?.withdrawn ?? 0)}
        />
      ),
    },
    {
      label: "DRep delegation",
      value: (
        <div className='flex flex-col'>
          {data?.vote?.vote?.live_drep === "drep_always_abstain" ? (
            <Link
              to='/drep/$hash'
              params={{ hash: "drep_always_abstain" }}
              className={"w-fit text-primary"}
            >
              {data?.vote?.drep?.data?.given_name &&
                data?.vote?.drep?.data?.given_name}
              <span className='text-text-sm text-primary'>Always abstain</span>
            </Link>
          ) : data?.vote?.vote?.live_drep === "drep_always_no_confidence" ? (
            <Link
              to='/drep/$hash'
              params={{ hash: "drep_always_no_confidence" }}
              className={"w-fit text-primary"}
            >
              {data?.vote?.drep?.data?.given_name &&
                data?.vote?.drep?.data?.given_name}
              <span className='text-text-sm text-primary'>Always no confidence</span>
            </Link>
          ) : (
            <AttributeDropdown
              items={[
                {
                  label: "Status",
                  value: data?.vote?.drep?.is_active ? (
                    <span className='text-greenText'>Active</span>
                  ) : (
                    <span className='text-redText'>Inactive</span>
                  ),
                },
                {
                  label: "Amount",
                  value: data?.vote?.drep?.amount
                    ? formatNumber(data?.vote?.drep?.amount)
                    : "-",
                },
                {
                  label: "Since",
                  value: (
                    <DateCell
                      time={data?.vote?.drep?.since}
                      className='text-text-xs'
                    />
                  ),
                },
                {
                  label: "ID",
                  value: (
                    <div className='flex items-center gap-1'>
                      <span className={"text-text-xs"}>
                        {formatString(
                          data?.vote?.drep?.hash?.view ?? "",
                          "long",
                        )}
                      </span>
                      <Copy copyText={data?.vote?.drep?.hash?.view} size={10} />
                    </div>
                  ),
                  visible: !!data?.vote?.drep?.data?.given_name,
                },
              ]}
            >
              <div
                className={`flex w-fit cursor-pointer items-center gap-1/2 rounded-s border ${theme === "light" ? "border-[#E4E7EC]" : "border-gray-600"} p-1`}
              >
                {data?.vote?.drep?.data?.given_name ? (
                  <Link
                    to='/drep/$hash'
                    params={{ hash: data?.vote?.drep?.hash?.view }}
                    className={"w-fit text-primary"}
                  >
                    {data?.vote?.drep?.data?.given_name}
                  </Link>
                ) : (
                  <div className='flex items-center gap-1'>
                    <Link
                      to='/drep/$hash'
                      params={{ hash: data?.vote?.drep?.hash?.view ?? "" }}
                      className={"text-text-sm text-primary"}
                    >
                      {formatString(data?.vote?.drep?.hash?.view ?? "", "long")}
                    </Link>
                    <Copy copyText={data?.vote?.drep?.hash?.view} size={13} />
                  </div>
                )}
                <ChevronRight size={15} />
              </div>
            </AttributeDropdown>
          )}
        </div>
      ),
      visible: !!data?.vote,
    },
    {
      label: "Rewards withdrawn",
      value: <AdaWithTooltip data={data?.reward?.withdrawn ?? 0} />,
    },
    {
      label: "Stake key",
      value: (
        <p className='flex items-center gap-[6px]' title={address}>
          <span>{formatString(address, "longer")}</span>
          <Copy copyText={address} className='translate-y-[2px]' />
        </p>
      ),
    },
    {
      label: "Raw address",
      value: (
        <p className='flex items-center gap-[6px]' title={rawAddress}>
          <span>{formatString(rawAddress, "longer")}</span>
          <Copy copyText={rawAddress} className='translate-y-[2px]' />
        </p>
      ),
    },
  ];

  return (
    <>
      <div className='flex-grow basis-[410px] md:flex-shrink-0'>
        <OverviewCard
          title='Overview'
          overviewList={overviewList}
          className='min-h-[320px]'
          endContent={
            data?.asset &&
            data.asset.length > 0 && (
              <TokenSelectCombobox className='mb-1 mt-2' items={data.asset} />
            )
          }
        />
      </div>
      <div className='flex-grow basis-[410px] md:flex-shrink-0'>
        <OverviewCard
          title='Staking'
          overviewList={stakeKey}
          className='min-h-[320px]'
        />
      </div>
      {/* <div className='flex-grow basis-[410px] md:flex-shrink-0'>
        <OverviewCard
          title='Detail'
          overviewList={detail}
          className='min-h-[200px]'
        />
      </div> */}
    </>
  );
};
