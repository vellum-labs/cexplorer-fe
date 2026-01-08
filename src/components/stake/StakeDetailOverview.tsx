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
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AddressDetailOverviewProps {
  data: StakeDetailData | undefined;
  stakeAddress: string;
}

export const StakeDetailOverview: FC<AddressDetailOverviewProps> = ({
  data,
  stakeAddress,
}) => {
  const { t } = useAppTranslation("pages");
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
          label: t("stake.detailPage.overview.handle"),
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
      label: t("stake.detailPage.overview.totalBalance"),
      value: (
        <TotalSumWithRates
          sum={totalBalanceSum}
          ada={data?.stake?.live.amount ?? 0}
          currency={currency}
        />
      ),
    },
    tokenMarket ? { label: t("stake.detailPage.overview.assetsBalance"), value: "TBD" } : undefined,
    {
      label: t("stake.detailPage.overview.adaBalance"),
      value: (
        <TotalSumWithRates
          sum={adaBalanceSum}
          ada={data?.stake?.active?.amount ?? 0}
          currency={currency}
        />
      ),
    },
    { label: t("stake.detailPage.overview.privateName"), value: <AddCustomLabel address={address} /> },
  ];

  const stakeKey = [
    {
      label: t("stake.detailPage.staking.status"),
      value: (
        <>
          {data?.stake?.info?.active ? (
            <Badge className='' color='green'>
              {t("stake.detailPage.staking.active")}
            </Badge>
          ) : data?.stake?.info?.active === null ? (
            <Badge className='' color='red'>
              {t("stake.detailPage.staking.inactive")}
            </Badge>
          ) : (
            <Badge className='' color='yellow'>
              {t("stake.detailPage.staking.deregistered")}
            </Badge>
          )}
        </>
      ),
    },
    data?.stake?.info?.active
      ? {
          label: t("stake.detailPage.staking.stakePool"),
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
      label: t("stake.detailPage.staking.rewardsAvailable"),
      value: (
        <AdaWithTooltip
          data={(data?.reward?.total ?? 0) - (data?.reward?.withdrawn ?? 0)}
        />
      ),
    },
    {
      label: t("stake.detailPage.staking.drepDelegation"),
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
              <span className='text-text-sm text-primary'>{t("stake.detailPage.staking.alwaysAbstain")}</span>
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
                {t("stake.detailPage.staking.alwaysNoConfidence")}
              </span>
            </Link>
          ) : (
            <AttributeDropdown
              items={[
                {
                  label: t("stake.detailPage.staking.status"),
                  value: data?.vote?.drep?.is_active ? (
                    <span className='text-greenText'>{t("stake.detailPage.staking.active")}</span>
                  ) : (
                    <span className='text-redText'>{t("stake.detailPage.staking.inactive")}</span>
                  ),
                },
                {
                  label: t("stake.detailPage.staking.amount"),
                  value: data?.vote?.drep?.amount
                    ? formatNumber(data?.vote?.drep?.amount)
                    : "-",
                },
                {
                  label: t("stake.detailPage.staking.since"),
                  value: (
                    <DateCell
                      time={data?.vote?.drep?.since}
                      className='text-text-xs'
                    />
                  ),
                },
                {
                  label: t("stake.detailPage.staking.id"),
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
      label: t("stake.detailPage.staking.rewardsWithdrawn"),
      value: <AdaWithTooltip data={data?.reward?.withdrawn ?? 0} />,
    },
    {
      label: t("stake.detailPage.staking.stakeKey"),
      value: (
        <p className='flex items-center gap-[6px]' title={address}>
          <span>{formatString(address, "longer")}</span>
          <Copy copyText={address} className='translate-y-[2px]' />
        </p>
      ),
    },
    {
      label: t("stake.detailPage.staking.rawAddress"),
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
        title={t("stake.detailPage.overview.title")}
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
        title={t("stake.detailPage.staking.title")}
        overviewList={stakeKey}
        className='min-h-[320px]'
      />
    </>
  );
};
