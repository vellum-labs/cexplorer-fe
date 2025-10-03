import type { FC } from "react";
import { useState } from "react";
import type { useFetchMiscBasic } from "@/services/misc";
import type { AggregatedSwapData } from "@/utils/dex/aggregateSwapData";

import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Ellipsis,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DexhunterIcon from "@/resources/images/icons/dexhunter.svg";
import { dexConfig } from "@/constants/dexConfig";

import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { TimeDateIndicator } from "../global/TimeDateIndicator";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";
import { SwapDetailTable } from "./SwapDetailTable";

import { useDeFiOrderListTableStore } from "@/stores/tables/deFiOrderListTableStore";
import { useGetMarketCurrency } from "@/hooks/useGetMarketCurrency";

import { addressIcons } from "@/constants/address";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { lovelaceToAdaWithRates } from "@/utils/lovelaceToAdaWithRates";
import { getConfirmations } from "@/utils/getConfirmations";
import { renderWithException } from "@/utils/renderWithException";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { ADATokenName } from "@/constants/currencies";
import { formatNumberWithSuffix } from "@/utils/format/format";
import AdaIcon from "@/resources/images/icons/ada.webp";

interface ConsolidatedDexSwapDetailCardProps {
  miscBasic: ReturnType<typeof useFetchMiscBasic>["data"];
  aggregatedData: AggregatedSwapData | undefined;
  isLoading: boolean;
}

const getAssetImage = (tokenName: string, isNft = false) => {
  const isAdaToken =
    tokenName === "lovelaces" ||
    tokenName === "lovelace" ||
    tokenName === ADATokenName ||
    tokenName?.toLowerCase().includes("lovelace");

  if (isAdaToken) {
    return (
      <img
        src={AdaIcon}
        alt='ADA'
        className='aspect-square shrink-0 rounded-full'
        height={20}
        width={20}
      />
    );
  }

  const fingerprint = getAssetFingerprint(tokenName);
  const encodedNameArr = encodeAssetName(tokenName).split("");

  return (
    <Image
      type='asset'
      height={20}
      width={20}
      className='aspect-square shrink-0 rounded-full'
      src={generateImageUrl(
        isNft ? fingerprint : tokenName,
        "ico",
        isNft ? "nft" : "token",
      )}
      fallbackletters={[...encodedNameArr]
        .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
        .join("")}
    />
  );
};

export const ConsolidatedDexSwapDetailCard: FC<
  ConsolidatedDexSwapDetailCardProps
> = ({ miscBasic, aggregatedData, isLoading }) => {
  const { currency, setCurrency } = useDeFiOrderListTableStore()();
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showDepositDetails, setShowDepositDetails] = useState(false);

  const curr = useGetMarketCurrency(undefined, currency as any);

  const balanceAda =
    (aggregatedData?.orders[0]?.user?.balance ?? 0) / 1_000_000;

  const getLevel = (balance: number) => {
    if (balance >= 20_000_000) return "leviathan";
    if (balance >= 5_000_000) return "humpback";
    if (balance >= 1_000_000) return "whale";
    if (balance >= 250_000) return "shark";
    if (balance >= 100_000) return "dolphin";
    if (balance >= 25_000) return "tuna";
    if (balance >= 5_000) return "fish";
    if (balance >= 1_000) return "crab";
    if (balance >= 10) return "shrimp";
    return "plankton";
  };

  const level = getLevel(balanceAda);
  const Icon = addressIcons[level];

  const tokenInFingerPrint = getAssetFingerprint(
    aggregatedData?.pair.tokenIn ?? "",
  );
  const tokenOutFingerPrint = getAssetFingerprint(
    aggregatedData?.pair.tokenOut ?? "",
  );

  const [, usd] = lovelaceToAdaWithRates(aggregatedData?.adaPrice ?? 0, curr);

  const isSuccess = aggregatedData?.status === "COMPLETE";
  const isCanceled = aggregatedData?.status === "CANCELLED";
  const isPartial = aggregatedData?.status === "PARTIALLY_COMPLETE";

  const confirmations = getConfirmations(
    miscBasic?.data.block.block_no,
    aggregatedData?.orders[0]?.block?.no,
  );

  const detailItems = [
    {
      key: "address",
      title: "Address",
      value: renderWithException(
        aggregatedData?.address,
        <div className='flex items-center gap-2'>
          {aggregatedData?.orders[0]?.user?.balance && (
            <Image src={Icon} className='h-4 w-4 rounded-full' />
          )}
          <div className='flex items-center gap-2'>
            <Link
              to={"/address/$address"}
              params={{
                address: aggregatedData?.address ?? "",
              }}
              className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm text-primary`}
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
      title: "Timestamp",
      value: renderWithException(
        aggregatedData?.timestamp,
        <TimeDateIndicator time={aggregatedData?.timestamp} />,
      ),
    },
    {
      key: "tx",
      title: "Transaction",
      value: renderWithException(
        aggregatedData?.txHash,
        <div className='flex items-center gap-2'>
          <Link
            to='/tx/$hash'
            params={{
              hash: aggregatedData?.txHash as string,
            }}
            className='text-primary'
          >
            <span
              className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm`}
            >
              {aggregatedData?.txHash}
            </span>
          </Link>
          <Copy copyText={aggregatedData?.txHash} />
        </div>,
      ),
    },
    {
      key: "confirmation",
      title: "Confirmation",
      value: renderWithException(
        aggregatedData?.orders[0]?.block?.no,
        <div className='flex items-center gap-[2.5px] text-sm'>
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
      title: "Pair",
      value: renderWithException(
        aggregatedData?.pair && !aggregatedData.pair.isMultiplePairs,
        aggregatedData?.pair.isMultiplePairs ? (
          <div className='text-sm text-yellow-600'>
            Multiple pairs detected - see individual trades below
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              {getAssetImage(aggregatedData?.pair.tokenIn ?? "")}
              <Link
                to='/asset/$fingerprint'
                params={{
                  fingerprint: tokenInFingerPrint,
                }}
              >
                <p className='min-w-[50px] text-primary'>
                  {(() => {
                    const tokenName = aggregatedData?.pair.tokenIn ?? "";
                    const renderedName = renderAssetName({ name: tokenName });

                    if (
                      tokenName === "lovelaces" ||
                      tokenName === "lovelace" ||
                      tokenName?.toLowerCase().includes("lovelace") ||
                      renderedName?.toLowerCase().includes("lovelace")
                    ) {
                      return "ADA";
                    }

                    return renderedName;
                  })()}
                </p>
              </Link>
            </div>
            <ArrowRight size={15} className='block min-w-[20px]' />
            <div className='flex items-center gap-2'>
              {getAssetImage(aggregatedData?.pair.tokenOut ?? "")}
              <Link
                to='/asset/$fingerprint'
                params={{
                  fingerprint: tokenOutFingerPrint,
                }}
              >
                <p className='w-fit text-primary'>
                  {(() => {
                    const tokenName = aggregatedData?.pair.tokenOut ?? "";
                    const renderedName = renderAssetName({ name: tokenName });

                    if (
                      tokenName === "lovelaces" ||
                      tokenName === "lovelace" ||
                      tokenName?.toLowerCase().includes("lovelace") ||
                      renderedName?.toLowerCase().includes("lovelace")
                    ) {
                      return "ADA";
                    }

                    return renderedName;
                  })()}
                </p>
              </Link>
            </div>
          </div>
        ),
      ),
    },
    {
      key: "input",
      title: "Input",
      value: renderWithException(
        aggregatedData?.totalAmountIn,
        aggregatedData?.pair.tokenIn === ADATokenName ||
          aggregatedData?.pair.tokenIn === "lovelaces" ||
          aggregatedData?.pair.tokenIn === "lovelace" ? (
          <AdaWithTooltip data={(aggregatedData?.totalAmountIn ?? 0) * 1e6} />
        ) : (
          <span className='text-sm text-grayTextPrimary'>
            {formatNumberWithSuffix(aggregatedData?.totalAmountIn ?? 0)}{" "}
            {renderAssetName({ name: aggregatedData?.pair.tokenIn ?? "" })}
          </span>
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
          <span>price</span>
        </div>
      ),
      value:
        currency === "ada" ? (
          <div className='text-sm text-grayTextPrimary'>
            {formatSmallValueWithSub(
              (aggregatedData?.adaPrice ?? 0) / 1e6,
              "₳ ",
            )}
          </div>
        ) : (
          <div className='text-sm text-grayTextPrimary'>
            {formatSmallValueWithSub(usd, "$ ")}
          </div>
        ),
    },
    {
      key: "estimatedOutput",
      title: "Estimated Output",
      value: renderWithException(
        aggregatedData?.totalExpectedOut,
        <AdaWithTooltip data={(aggregatedData?.totalExpectedOut ?? 0) * 1e6} />,
      ),
    },
    {
      key: "actualOutput",
      title: "Actual Output",
      value: renderWithException(
        typeof aggregatedData?.totalActualOut === "number",
        <AdaWithTooltip data={(aggregatedData?.totalActualOut ?? 0) * 1e6} />,
      ),
    },
    {
      key: "status",
      title: "Status",
      value: renderWithException(
        aggregatedData?.status,
        <div className='flex items-center'>
          <p className='flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
            {isSuccess ? (
              <Check className='text-greenText' size={15} />
            ) : isCanceled ? (
              <X size={15} className='text-redText' />
            ) : isPartial ? (
              <CircleAlert size={15} className='text-yellowText' />
            ) : (
              <Ellipsis size={15} className='text-yellowText' />
            )}
            {aggregatedData?.status === "PARTIALLY_COMPLETE"
              ? "Partially completed"
              : aggregatedData?.status
                ? (aggregatedData?.status[0] ?? "").toUpperCase() +
                  aggregatedData?.status.slice(1).toLowerCase()
                : ""}
          </p>
        </div>,
      ),
    },
    {
      key: "lastUpdate",
      title: "Last Update",
      value: renderWithException(
        aggregatedData?.lastUpdate,
        <TimeDateIndicator time={aggregatedData?.lastUpdate} />,
      ),
      divider: true,
    },
    {
      key: "type",
      title: "Type",
      value: renderWithException(
        aggregatedData?.type,
        <div className='flex items-center'>
          <p className='flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
            {aggregatedData?.type === "DEXHUNTER_SWAP" ? (
              <Image src={DexhunterIcon} className='h-4 w-4 rounded-full' />
            ) : (
              <ArrowLeftRight size={15} className='text-primary' />
            )}
            {aggregatedData?.type === "AGGREGATOR_SWAP"
              ? "Aggregator swap"
              : aggregatedData?.type === "DEXHUNTER_SWAP"
                ? "Dexhunter swap"
                : "Direct swap"}
          </p>
        </div>,
      ),
    },
    {
      key: "dexes",
      title: "Dexes",
      value: renderWithException(
        aggregatedData?.dexes && aggregatedData.dexes.length > 0,
        <div className='flex flex-wrap items-center gap-2'>
          {aggregatedData?.dexes.map(dexName => {
            const dexKey = dexName.toUpperCase();
            const dex = dexConfig[dexKey];

            return (
              <p
                key={dexName}
                className={`flex w-fit items-center gap-1 rounded-xl border px-1.5 text-sm`}
                style={{
                  backgroundColor: dex?.bgColor ?? "transparent",
                  borderColor: dex?.borderColor ?? "var(--border)",
                }}
              >
                {!!dex?.icon && (
                  <Image
                    src={dex.icon}
                    className='h-4 w-4 rounded-full'
                    alt={dex?.label}
                  />
                )}
                <span style={{ color: dex?.textColor ?? "var(--text)" }}>
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
      title: "Batcher Fees",
      value: renderWithException(
        typeof aggregatedData?.totalBatcherFees === "number",
        <div className='flex items-center gap-2'>
          <AdaWithTooltip
            data={(aggregatedData?.totalBatcherFees ?? 0) * 1e6}
          />
          {aggregatedData && aggregatedData.orders.length > 1 && (
            <button
              onClick={() => setShowFeeDetails(!showFeeDetails)}
              className='flex items-center gap-1 text-xs text-grayTextSecondary hover:text-primary'
            >
              Details
              {showFeeDetails ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
          )}
        </div>,
      ),
      details:
        showFeeDetails && aggregatedData && aggregatedData.orders.length > 1 ? (
          <div className='mt-2 space-y-1 text-xs text-grayTextSecondary'>
            {aggregatedData.orders.map((order, index) => (
              <div key={index} className='flex justify-between'>
                <span>
                  {dexConfig[order.dex.toUpperCase()]?.label || order.dex}:
                </span>
                <AdaWithTooltip data={(order.batcher_fee ?? 0) * 1e6} />
              </div>
            ))}
          </div>
        ) : null,
    },
    {
      key: "deposits",
      title: "Deposits",
      value: renderWithException(
        typeof aggregatedData?.totalDeposits === "number",
        <div className='flex items-center gap-2'>
          <AdaWithTooltip data={(aggregatedData?.totalDeposits ?? 0) * 1e6} />
          {aggregatedData && aggregatedData.orders.length > 1 && (
            <button
              onClick={() => setShowDepositDetails(!showDepositDetails)}
              className='flex items-center gap-1 text-xs text-grayTextSecondary hover:text-primary'
            >
              Details
              {showDepositDetails ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
          )}
        </div>,
      ),
      details:
        showDepositDetails &&
        aggregatedData &&
        aggregatedData.orders.length > 1 ? (
          <div className='mt-2 space-y-1 text-xs text-grayTextSecondary'>
            {aggregatedData.orders.map((order, index) => (
              <div key={index} className='flex justify-between'>
                <span>
                  {dexConfig[order.dex.toUpperCase()]?.label || order.dex}:
                </span>
                <AdaWithTooltip data={(order.deposit ?? 0) * 1e6} />
              </div>
            ))}
          </div>
        ) : null,
    },
    {
      key: "swapDetail",
      title: "Swap detail",
      value: aggregatedData ? (
        <SwapDetailTable aggregatedData={aggregatedData} />
      ) : null,
    },
  ];

  return (
    <div
      className='thin-scrollbar w-full overflow-x-auto rounded-xl border border-border px-5 py-4'
      style={{
        transform: "rotateX(180deg)",
      }}
    >
      <div
        className='min-w-[1100px] xl:min-w-[auto]'
        style={{
          transform: "rotateX(180deg)",
        }}
      >
        <>
          <h2 className='text-base'>Overview</h2>
          <div className='flex flex-col gap-4 pt-4'>
            {detailItems.map(({ key, title, value, divider, details }) => (
              <div key={key}>
                <div className='flex w-full items-start'>
                  <p className='min-w-[200px] text-sm text-grayTextSecondary'>
                    {title}
                  </p>
                  <div className='w-full'>
                    {isLoading ? (
                      <LoadingSkeleton width='100%' height='20px' />
                    ) : (
                      <>
                        {value}
                        {details}
                      </>
                    )}
                  </div>
                </div>
                {divider && (
                  <div className='my-2 w-full self-center border border-border' />
                )}
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};
