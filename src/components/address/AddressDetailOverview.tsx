import type { AddressDetailData } from "@/types/addressTypes";
import type { FC } from "react";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";

import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import type { PoolInfo } from "@/types/poolTypes";
import { Address } from "@/utils/address/getStakeAddress";
import { parseShelleyAddress } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { Link } from "@tanstack/react-router";
import { TokenSelectCombobox } from "../asset/TokenSelect";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { AddressTypeInitialsBadge } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TotalSumWithRates } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { AddCustomLabel } from "./AddCustomLabel";
import AddressCell from "./AddressCell";
import { AttributeDropdown } from "@vellumlabs/cexplorer-sdk";
import { ChevronRight } from "lucide-react";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { useCurrencyStore } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AddressDetailOverviewProps {
  data: AddressDetailData[];
  address: string;
}

export const AddressDetailOverview: FC<AddressDetailOverviewProps> = ({
  data,
  address,
}) => {
  const { t } = useAppTranslation("common");
  const { theme } = useThemeStore();
  const addressData = Address.from(address);
  const paymentCredential = addressData.payment;
  const stakeKey = addressData.stake;
  const stakeAddr = addressData.rewardAddress;
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;
  const policyId = configJSON.integration[0].adahandle[0].policy;
  const curr = useGetMarketCurrency();
  const isStaking = data[0]?.stake?.active_pool || data[0]?.stake?.live_pool;
  const isRecync = data[0]?.address === null;
  const rawAddress = Address.toHexString(addressData.raw);
  const { currency } = useCurrencyStore();

  const overviewList = [
    data[0]?.adahandle
      ? {
          label: t("address.handle"),
          value: (
            <AdaHandleBadge
              hex={data[0].adahandle.hex}
              link
              policyId={policyId}
            />
          ),
        }
      : undefined,
    {
      label: t("labels.address"),
      value: (
        <p className='flex items-center gap-[6px]' title={address}>
          <span>{formatString(address, "long")}</span>
          <Copy copyText={address} className='translate-y-[2px]' />
        </p>
      ),
    },
    nftMarket && tokenMarket
      ? { label: t("address.assetsBalance"), value: "TBD" }
      : undefined,
    {
      label: t("address.adaBalance"),
      value: isRecync ? (
        <p>{t("address.calculating")}</p>
      ) : (
        <TotalSumWithRates
          sum={lovelaceToAdaWithRates(data?.[0]?.balance, curr)}
          ada={data?.[0]?.balance}
          currency={currency}
        />
      ),
    },
    data?.[0]?.stake?.balance?.live
      ? {
          label: t("labels.liveStake"),
          value: <AdaWithTooltip data={data?.[0]?.stake.balance.live} />,
        }
      : undefined,
    data?.[0]?.stake?.balance?.active
      ? {
          label: t("labels.activeStake"),
          value: <AdaWithTooltip data={data?.[0]?.stake.balance.active} />,
        }
      : undefined,
    {
      label: t("address.lastActivity"),
      value: isRecync ? (
        <p>{t("address.currentlyUnavailable")}</p>
      ) : (
        <DateCell time={data?.[0]?.activity?.recent} />
      ),
    },
    {
      label: t("address.privateName"),
      value: <AddCustomLabel address={address} />,
    },
  ];

  const delegationArr = [
    {
      label: t("labels.status"),
      value: (
        <span
          className={` ${isStaking ? "text-greenText" : "text-redText"} font-bold`}
        >
          {isStaking ? t("labels.active") : t("labels.inactive")}
        </span>
      ),
    },
    {
      label: t("labels.stakePool"),
      value: (
        <div className='w-full max-w-[220px] sm:max-w-[250px]'>
          {isStaking ? (
            <PoolCell
              poolInfo={
                (data[0]?.stake?.active_pool ??
                  data[0]?.stake?.live_pool) as PoolInfo
              }
              poolImageUrl={generateImageUrl(
                (data[0]?.stake?.active_pool?.id ??
                  data[0]?.stake?.live_pool?.id) as string,
                "ico",
                "pool",
              )}
            />
          ) : (
            t("address.notDelegated")
          )}
        </div>
      ),
    },
    {
      label: t("address.drepDelegation"),
      value: (
        <div className='flex flex-col'>
          {data[0]?.vote?.vote?.live_drep === "drep_always_abstain" ? (
            <Link
              to='/drep/$hash'
              params={{ hash: "drep_always_abstain" }}
              className={"w-fit text-primary"}
            >
              {data[0]?.vote?.drep?.data?.given_name &&
                data[0]?.vote?.drep?.data?.given_name}
              <span className='text-text-sm text-primary'>
                {t("address.alwaysAbstain")}
              </span>
            </Link>
          ) : data[0]?.vote?.vote?.live_drep === "drep_always_no_confidence" ? (
            <Link
              to='/drep/$hash'
              params={{ hash: "drep_always_no_confidence" }}
              className={"w-fit text-primary"}
            >
              {data[0]?.vote?.drep?.data?.given_name &&
                data[0]?.vote?.drep?.data?.given_name}
              <span className='text-text-sm text-primary'>
                {t("address.alwaysNoConfidence")}
              </span>
            </Link>
          ) : (
            <AttributeDropdown
              items={[
                {
                  label: t("labels.status"),
                  value: data[0]?.vote?.drep?.is_active ? (
                    <span className='text-greenText'>{t("labels.active")}</span>
                  ) : (
                    <span className='text-redText'>{t("labels.inactive")}</span>
                  ),
                },
                {
                  label: t("labels.amount"),
                  value: data[0]?.vote?.drep?.amount
                    ? formatNumber(data[0]?.vote?.drep?.amount)
                    : "-",
                },
                {
                  label: t("address.since"),
                  value: (
                    <DateCell
                      time={data[0]?.vote?.drep?.since}
                      className='text-text-xs'
                    />
                  ),
                },
                {
                  label: t("address.id"),
                  value: (
                    <div className='flex items-center gap-1'>
                      <span className={"text-text-xs"}>
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
                className={`flex w-fit cursor-pointer items-center gap-1/2 rounded-s border ${theme === "light" ? "border-[#E4E7EC]" : "border-gray-600"} p-1`}
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
                  <div className='flex items-center gap-1'>
                    <Link
                      to='/drep/$hash'
                      params={{ hash: data[0]?.vote?.drep?.hash?.view }}
                      className={"text-text-sm text-primary"}
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
      label: t("address.controlledStake"),
      value: <AdaWithTooltip data={data[0]?.stake?.balance.live ?? 0} />,
    },
    stakeKey && {
      label: t("address.rewardsAvailable"),
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
      label: t("address.rewardsWithdrawn"),
      value: <AdaWithTooltip data={data[0]?.stake?.reward.withdrawn ?? 0} />,
    },
    {
      label: t("labels.stakeKey"),
      value: <AddressCell address={stakeAddr} className='text-[16px]' />,
    },
    {
      label: t("address.rawAddress"),
      value: (
        <p className='flex items-center gap-[6px]' title={rawAddress}>
          <span>{formatString(rawAddress, "long")}</span>
          <Copy copyText={rawAddress} className='translate-y-[2px]' />
        </p>
      ),
    },
  ];

  const detail = [
    {
      label: t("labels.type"),
      value: <AddressTypeInitialsBadge address={address} />,
    },
    {
      label: t("labels.address"),
      value: (
        <p className='flex items-center gap-[6px]' title={address}>
          <span>{formatString(address, "long")}</span>
          <Copy copyText={address} className='translate-y-[2px]' />
        </p>
      ),
    },
    {
      label: t("address.paymentCredential"),
      value: (
        <p className='flex items-center gap-[6px]' title={paymentCredential}>
          {parseShelleyAddress(address)?.paymentPart === "ScriptHash" ? (
            <Link
              to='/script/$hash'
              params={{ hash: paymentCredential }}
              className='text-primary'
            >
              {formatString(paymentCredential, "long")}
            </Link>
          ) : (
            <span>{formatString(paymentCredential, "long")}</span>
          )}
          <Copy copyText={paymentCredential} className='translate-y-[2px]' />
        </p>
      ),
    },
    {
      label: t("address.stakingCredential"),
      value: (
        <p className='flex items-center gap-[6px]' title={stakeKey}>
          <span>{stakeKey ? formatString(stakeKey, "long") : "-"}</span>
          <Copy copyText={stakeKey} className='translate-y-[2px]' />
        </p>
      ),
    },
    {
      label: t("address.lastActivity"),
      value: <TimeDateIndicator time={data[0]?.activity?.recent ?? ""} />,
    },
    {
      label: t("address.firstDiscovery"),
      value: <TimeDateIndicator time={data[0]?.activity?.first ?? ""} />,
    },
  ];

  return (
    <>
      <OverviewCard
        title={t("address.overview")}
        overviewList={overviewList}
        endContent={
          data?.[0]?.asset &&
          data[0].asset.length > 0 && (
            <TokenSelectCombobox className='mb-1' items={data?.[0]?.asset} />
          )
        }
        className=''
      />
      {stakeKey && (
        <OverviewCard
          title={t("address.delegation")}
          overviewList={delegationArr as any}
          className=''
        />
      )}
      <OverviewCard
        title={t("address.detail")}
        overviewList={detail}
        className=''
      />
    </>
  );
};
