import { type FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";

import type { PoolInfo } from "@/types/poolTypes";
import type { StakeDetailData } from "@/types/stakeTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { AddCustomLabel } from "../address/AddCustomLabel";
import { TokenSelectCombobox } from "../asset/TokenSelect";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { TotalSumWithRates } from "@vellumlabs/cexplorer-sdk";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { AttributeDropdown } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { useCurrencyStore } from "@/stores/currencyStore";

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
  const policyId = configJSON.integration[0].adahandle[0].policy;
  const { theme } = useThemeStore();
  const { currency } = useCurrencyStore();

  const curr = useGetMarketCurrency();

  let totalBalanceSum: [string, number, number, number] = ["", 0, 0, 0];
  let adaBalanceSum: [string, number, number, number] = ["", 0, 0, 0];

  if (data?.stake?.live.amount && Object.values(curr).length) {
    totalBalanceSum = lovelaceToAdaWithRates(data.stake.live.amount, curr);
  }

  if (data?.stake?.active?.amount && Object.values(curr).length) {
    adaBalanceSum = lovelaceToAdaWithRates(data.stake.active.amount, curr);
  }

  const overviewList = [
    data?.adahandle
      ? {
          label: "Handle",
          value: (
            <AdaHandleBadge
              hex={data?.adahandle?.hex}
              link
              policyId={policyId}
            />
          ),
        }
      : undefined,
    {
      label: "Total balance",
      value: (
        <TotalSumWithRates
          sum={totalBalanceSum}
          ada={data?.stake?.live.amount ?? 0}
          currency={currency}
        />
      ),
    },
    tokenMarket ? { label: "Assets balance", value: "TBD" } : undefined,
    {
      label: "ADA balance",
      value: (
        <TotalSumWithRates
          sum={adaBalanceSum}
          ada={data?.stake?.active?.amount ?? 0}
          currency={currency}
        />
      ),
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
                poolImageUrl={generateImageUrl(
                  data?.stake?.active?.deleg?.id ??
                    data?.stake?.live?.deleg?.id ??
                    "",
                  "ico",
                  "pool",
                )}
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
              <span className='text-text-sm text-primary'>
                Always no confidence
              </span>
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
                className={`flex w-fit cursor-pointer items-center gap-1/2 rounded-s border ${theme === "light" ? "border-[#E4E7EC]" : "border-gray-600"} p-1/2`}
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
      <OverviewCard
        title='Staking'
        overviewList={stakeKey}
        className='min-h-[320px]'
      />
    </>
  );
};
