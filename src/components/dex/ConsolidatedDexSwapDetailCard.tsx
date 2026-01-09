import type { FC } from "react";
import type { useFetchMiscBasic } from "@/services/misc";
import type { AggregatedSwapData } from "@/types/tokenTypes";

import {
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Ellipsis,
  X,
} from "lucide-react";
import { dexConfig } from "@/constants/dexConfig";

import { Image } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { SwapDetailTable } from "./SwapDetailTable";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { AssetTicker } from "./AssetTicker";
import { SwapTypeBadge } from "./SwapTypeBadge";
import { FeeDropdown } from "./FeeDropdown";
import { TokenPair } from "./TokenPair";

import { useDeFiOrderListTableStore } from "@/stores/tables/deFiOrderListTableStore";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { addressIcons } from "@/constants/address";
import { AnimalName } from "@/constants/animals";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { getConfirmations } from "@/utils/getConfirmations";
import { renderWithException } from "@/utils/renderWithException";
import { formatSmallValueWithSub } from "@vellumlabs/cexplorer-sdk";
import { ADATokenName } from "@vellumlabs/cexplorer-sdk";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";

interface ConsolidatedDexSwapDetailCardProps {
  miscBasic: ReturnType<typeof useFetchMiscBasic>["data"];
  aggregatedData: AggregatedSwapData | undefined;
  isLoading: boolean;
}

const getStatusIcon = (status: string | undefined) => {
  switch (status) {
    case "COMPLETE":
      return <Check className='text-greenText' size={15} />;
    case "CANCELLED":
      return <X size={15} className='text-redText' />;
    case "PARTIALLY_COMPLETE":
      return <CircleAlert size={15} className='text-yellowText' />;
    default:
      return <Ellipsis size={15} className='text-yellowText' />;
  }
};

const getStatusText = (status: string | undefined) => {
  if (!status) return "";
  if (status === "PARTIALLY_COMPLETE") return "Partially completed";
  return status[0].toUpperCase() + status.slice(1).toLowerCase();
};

export const ConsolidatedDexSwapDetailCard: FC<
  ConsolidatedDexSwapDetailCardProps
> = ({ miscBasic, aggregatedData, isLoading }) => {
  const { t } = useAppTranslation("common");
  const { currency, setCurrency } = useDeFiOrderListTableStore()();

  const curr = useGetMarketCurrency(
    undefined,
    currency === "ada" ? undefined : (currency as "usd" | "eur"),
  );

  const balanceAda =
    (aggregatedData?.orders[0]?.user?.balance ?? 0) / 1_000_000;

  const getLevel = (balance: number): AnimalName => {
    if (balance >= 20_000_000) return AnimalName.Leviathan;
    if (balance >= 5_000_000) return AnimalName.Humpback;
    if (balance >= 1_000_000) return AnimalName.Whale;
    if (balance >= 250_000) return AnimalName.Shark;
    if (balance >= 100_000) return AnimalName.Dolphin;
    if (balance >= 25_000) return AnimalName.Tuna;
    if (balance >= 5_000) return AnimalName.Fish;
    if (balance >= 1_000) return AnimalName.Crab;
    if (balance >= 10) return AnimalName.Shrimp;
    return AnimalName.Plankton;
  };

  const level = getLevel(balanceAda);
  const Icon = addressIcons[level];

  const [, usd] = lovelaceToAdaWithRates(aggregatedData?.adaPrice ?? 0, curr);

  const confirmations = getConfirmations(
    miscBasic?.data.block.block_no,
    aggregatedData?.orders[0]?.block?.no,
  );

  const getStatusTextTranslated = (status: string | undefined) => {
    if (!status) return "";
    if (status === "PARTIALLY_COMPLETE") return t("dex.partiallyCompleted");
    return status[0].toUpperCase() + status.slice(1).toLowerCase();
  };

  const detailItems = [
    {
      key: "address",
      title: t("dex.address"),
      value: renderWithException(
        aggregatedData?.address,
        <div className='flex items-center gap-1'>
          {aggregatedData?.orders[0]?.user?.balance && (
            <Image src={Icon} className='h-4 w-4 rounded-max' />
          )}
          <div className='flex items-center gap-1'>
            <Link
              to={"/address/$address"}
              params={{
                address: aggregatedData?.address ?? "",
              }}
              className='block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-text-sm text-primary'
            >
              {aggregatedData?.address}
            </Link>
            <Copy copyText={aggregatedData?.address} />
          </div>
        </div>,
      ),
    },
    {
      key: "timestamp",
      title: t("dex.timestamp"),
      value: renderWithException(
        aggregatedData?.timestamp,
        <TimeDateIndicator time={aggregatedData?.timestamp} />,
      ),
    },
    {
      key: "tx",
      title: t("dex.transaction"),
      value: renderWithException(
        aggregatedData?.txHash,
        <div className='flex items-center gap-1'>
          <Link
            to='/tx/$hash'
            params={{
              hash: aggregatedData?.txHash as string,
            }}
            className='text-primary'
          >
            <span className='block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-text-sm'>
              {aggregatedData?.txHash}
            </span>
          </Link>
          <Copy copyText={aggregatedData?.txHash} />
        </div>,
      ),
    },
    {
      key: "confirmation",
      title: t("dex.confirmation"),
      value: renderWithException(
        aggregatedData?.orders[0]?.block?.no,
        <div className='flex items-center gap-[2.5px] text-text-sm'>
          {confirmations[1] < 3 && (
            <CircleX size={15} className='translate-y-[1px] text-red-500' />
          )}
          {confirmations[1] > 2 && confirmations[1] < 9 && (
            <CircleAlert
              size={15}
              className='translate-y-[1px] text-yellow-500'
            />
          )}
          {confirmations[1] > 9 && (
            <CircleCheck
              size={15}
              className='translate-y-[1px] text-green-600'
            />
          )}
          <span
            className={`font-bold ${confirmations[1] > 9 ? "text-green-500" : confirmations[1] > 2 ? "text-yellow-500" : "text-red-500"}`}
          >
            {confirmations[0]}
          </span>
        </div>,
      ),
      divider: true,
    },
    {
      key: "pair",
      title: t("dex.pair"),
      value: renderWithException(
        aggregatedData?.pair && !aggregatedData.pair.isMultiplePairs,
        aggregatedData?.pair.isMultiplePairs ? (
          <div className='text-text-sm text-yellow-600'>
            {t("dex.multiplePairsDetected")}
          </div>
        ) : (
          <TokenPair
            tokenIn={aggregatedData?.pair.tokenIn ?? ""}
            tokenOut={aggregatedData?.pair.tokenOut ?? ""}
            variant='full'
            clickable={false}
            tokenInRegistry={aggregatedData?.pair.tokenInRegistry}
            tokenOutRegistry={aggregatedData?.pair.tokenOutRegistry}
          />
        ),
      ),
    },
    {
      key: "input",
      title: t("dex.input"),
      value: renderWithException(
        aggregatedData?.totalAmountIn,
        aggregatedData?.pair.tokenIn === ADATokenName ||
          aggregatedData?.pair.tokenIn === "lovelaces" ||
          aggregatedData?.pair.tokenIn === "lovelace" ? (
          <AdaWithTooltip data={(aggregatedData?.totalAmountIn ?? 0) * 1e6} />
        ) : (
          <Tooltip
            content={
              <div className='flex items-center gap-1/2'>
                <span>
                  {(aggregatedData?.totalAmountIn ?? 0).toLocaleString()}
                </span>
                <Copy
                  copyText={(
                    aggregatedData?.totalAmountIn ?? 0
                  ).toLocaleString()}
                />
              </div>
            }
          >
            <span className='text-text-sm text-grayTextPrimary'>
              {formatNumberWithSuffix(aggregatedData?.totalAmountIn ?? 0)}{" "}
              <AssetTicker
                tokenName={aggregatedData?.pair.tokenIn ?? ""}
                registry={aggregatedData?.pair.tokenInRegistry}
              />
            </span>
          </Tooltip>
        ),
      ),
    },
    {
      key: "adaPrice",
      title: (
        <div>
          <span
            className='inline-block w-[33px] cursor-pointer select-none text-primary'
            onClick={() => setCurrency(currency === "ada" ? "usd" : "ada")}
          >
            {currency === "ada" ? "ADA" : "USD"}{" "}
          </span>
          <span>{t("dex.price").toLowerCase()}</span>
        </div>
      ),
      value:
        currency === "ada" ? (
          <Tooltip
            content={
              <div className='flex items-center gap-1/2'>
                <span>
                  ₳{" "}
                  {((aggregatedData?.adaPrice ?? 0) / 1e6)
                    .toFixed(20)
                    .replace(/\.?0+$/, "")}
                </span>
                <Copy
                  copyText={((aggregatedData?.adaPrice ?? 0) / 1e6)
                    .toFixed(20)
                    .replace(/\.?0+$/, "")}
                />
              </div>
            }
          >
            <div className='text-text-sm text-grayTextPrimary'>
              {formatSmallValueWithSub(
                (aggregatedData?.adaPrice ?? 0) / 1e6,
                "₳ ",
                0.01,
                6,
                4,
              )}
            </div>
          </Tooltip>
        ) : (
          <Tooltip
            content={
              <div className='flex items-center gap-1/2'>
                <span>$ {usd.toFixed(20).replace(/\.?0+$/, "")}</span>
                <Copy copyText={usd.toFixed(20).replace(/\.?0+$/, "")} />
              </div>
            }
          >
            <div className='text-text-sm text-grayTextPrimary'>
              {formatSmallValueWithSub(usd, "$ ", 0.01, 6, 4)}
            </div>
          </Tooltip>
        ),
    },
    {
      key: "output",
      title: t("dex.output"),
      value: renderWithException(
        aggregatedData?.totalExpectedOut || aggregatedData?.totalActualOut,
        aggregatedData?.pair.tokenOut === ADATokenName ||
          aggregatedData?.pair.tokenOut === "lovelaces" ||
          aggregatedData?.pair.tokenOut === "lovelace" ? (
          <AdaWithTooltip
            data={
              ((aggregatedData?.totalActualOut ||
                aggregatedData?.totalExpectedOut) ??
                0) * 1e6
            }
          />
        ) : (
          <Tooltip
            content={
              <div className='flex items-center gap-1/2'>
                <span>
                  {(
                    (aggregatedData?.totalActualOut ||
                      aggregatedData?.totalExpectedOut) ??
                    0
                  ).toLocaleString()}
                </span>
                <Copy
                  copyText={(
                    (aggregatedData?.totalActualOut ||
                      aggregatedData?.totalExpectedOut) ??
                    0
                  ).toLocaleString()}
                />
              </div>
            }
          >
            <span className='text-text-sm text-grayTextPrimary'>
              {formatNumberWithSuffix(
                (aggregatedData?.totalActualOut ||
                  aggregatedData?.totalExpectedOut) ??
                  0,
              )}{" "}
              <AssetTicker
                tokenName={aggregatedData?.pair.tokenOut ?? ""}
                registry={aggregatedData?.pair.tokenOutRegistry}
              />
            </span>
          </Tooltip>
        ),
      ),
    },
    {
      key: "status",
      title: t("dex.status"),
      value: renderWithException(
        aggregatedData?.status,
        <div className='flex items-center'>
          <p className='flex w-fit items-center gap-1 rounded-m border border-border px-1 text-text-sm'>
            {getStatusIcon(aggregatedData?.status)}
            {getStatusTextTranslated(aggregatedData?.status)}
          </p>
        </div>,
      ),
    },
    {
      key: "lastUpdate",
      title: t("dex.lastUpdate"),
      value: renderWithException(
        aggregatedData?.lastUpdate,
        <TimeDateIndicator time={aggregatedData?.lastUpdate} />,
      ),
      divider: true,
    },
    {
      key: "type",
      title: t("dex.type"),
      value: renderWithException(
        aggregatedData?.type,
        <SwapTypeBadge
          uniqueDexesCount={aggregatedData?.dexes.length ?? 0}
          hasDexhunter={
            aggregatedData?.orders.some(order => order.is_dexhunter) ?? false
          }
        />,
      ),
    },
    {
      key: "dexes",
      title: t("dex.dexes"),
      value: renderWithException(
        aggregatedData?.dexes && aggregatedData.dexes.length > 0,
        <div className='flex flex-wrap items-center gap-1'>
          {aggregatedData?.dexes.map(dexName => {
            const dexKey = dexName.toUpperCase();
            const dex = dexConfig[dexKey];

            return (
              <p
                key={dexName}
                className='flex w-fit items-center gap-1/2 rounded-xl border border-border bg-transparent px-1 text-text-sm text-text'
                style={
                  dex
                    ? {
                        backgroundColor: dex.bgColor,
                        borderColor: dex.borderColor,
                        color: dex.textColor,
                      }
                    : undefined
                }
              >
                {!!dex?.icon && (
                  <Image
                    src={dex.icon}
                    className='h-4 w-4 rounded-max'
                    alt={dex?.label}
                  />
                )}
                <span>
                  {dex?.label ??
                    (dexKey
                      ? dexKey[0].toUpperCase() + dexKey.slice(1).toLowerCase()
                      : "")}
                </span>
              </p>
            );
          })}
        </div>,
      ),
    },
    {
      key: "batcherFees",
      title: t("dex.batcherFees"),
      value: (
        <FeeDropdown
          total={aggregatedData?.totalBatcherFees}
          orders={aggregatedData?.orders}
          getFeeAmount={order => order.batcher_fee}
          dropdownId='batcher-fees-dropdown'
        />
      ),
    },
    {
      key: "deposits",
      title: t("dex.deposits"),
      value: (
        <FeeDropdown
          total={aggregatedData?.totalDeposits}
          orders={aggregatedData?.orders}
          getFeeAmount={order => order.deposit}
          dropdownId='deposits-dropdown'
        />
      ),
    },
    {
      key: "swapDetail",
      title: t("dex.swapDetail"),
      value: aggregatedData ? (
        <SwapDetailTable aggregatedData={aggregatedData} />
      ) : null,
    },
  ];

  return (
    <div
      className='thin-scrollbar w-full overflow-x-auto rounded-xl border border-border px-3 py-2 xl:overflow-x-visible'
      style={{
        transform: "rotateX(180deg)",
      }}
    >
      <div
        className='min-w-[1100px] xl:min-w-full'
        style={{
          transform: "rotateX(180deg)",
        }}
      >
        <>
          <h2 className='text-base'>{t("dex.overview")}</h2>
          <div className='flex flex-col gap-2 pt-2'>
            {detailItems.map(({ key, title, value, divider }) => (
              <div key={key}>
                <div className='flex w-full items-start'>
                  <p className='min-w-[200px] text-text-sm text-grayTextSecondary'>
                    {title}
                  </p>
                  <div className='w-full'>
                    {isLoading ? (
                      <LoadingSkeleton width='100%' height='20px' />
                    ) : (
                      value
                    )}
                  </div>
                </div>
                {divider && (
                  <div className='my-1 w-full self-center border border-border' />
                )}
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};
