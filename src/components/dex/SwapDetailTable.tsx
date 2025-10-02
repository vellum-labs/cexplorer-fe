import type { FC } from "react";
import type { DeFiOrder } from "@/types/tokenTypes";
import type { AggregatedSwapData } from "@/utils/dex/aggregateSwapData";

import { ArrowRight, ArrowLeftRight, Check, Ellipsis, X } from "lucide-react";
import { dexConfig } from "@/constants/dexConfig";

import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatString } from "@/utils/format/format";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";

interface SwapDetailTableProps {
  aggregatedData: AggregatedSwapData;
}

const getAssetImage = (tokenName: string, isNft = false) => {
  const fingerprint = getAssetFingerprint(tokenName);
  const encodedNameArr = encodeAssetName(tokenName).split("");

  return (
    <Image
      type='asset'
      height={16}
      width={16}
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

export const SwapDetailTable: FC<SwapDetailTableProps> = ({
  aggregatedData,
}) => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return <Check className='text-greenText' size={15} />;
      case "CANCELLED":
        return <X size={15} className='text-redText' />;
      default:
        return <Ellipsis size={15} className='text-yellowText' />;
    }
  };

  const formatTokenName = (tokenName: string) => {
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
  };

  const calculatePrice = (order: DeFiOrder) => {
    const isBuying =
      order.token_in.name === "lovelaces" || order.token_in.name === "lovelace";
    const adaAmount = isBuying
      ? order.amount_in
      : order.actual_out_amount || order.expected_out_amount;
    const tokenAmount = isBuying
      ? order.actual_out_amount || order.expected_out_amount
      : order.amount_in;

    if (tokenAmount > 0) {
      return (adaAmount / tokenAmount) * 1e6;
    }
    return 0;
  };

  const summaryAmountIn = aggregatedData.totalAmountIn;
  const summaryAmountOut =
    aggregatedData.totalActualOut || aggregatedData.totalExpectedOut;

  return (
    <div className='w-full overflow-x-auto rounded-xl border border-border'>
      <div className='min-w-fit'>
        {/* Summary Row */}
        <div className='bg-grayBgTertiary border-b border-border px-4 py-3'>
          <div className='flex items-center gap-1 text-sm'>
            <span className='font-medium text-grayTextSecondary'>
              Token swap order:{" "}
            </span>
            <div className='flex items-center gap-1'>
              {getAssetImage(aggregatedData.pair.tokenIn)}
              <span className='font-medium'>
                {summaryAmountIn.toFixed(0)}{" "}
                {formatTokenName(aggregatedData.pair.tokenIn)}
              </span>
            </div>
            <span className='mx-2 text-grayTextSecondary'>to</span>
            <div className='flex items-center gap-1'>
              {getAssetImage(aggregatedData.pair.tokenOut)}
              <span className='font-medium'>
                {aggregatedData.totalActualOut ? "" : "~"}
                {summaryAmountOut.toFixed(0)}{" "}
                {formatTokenName(aggregatedData.pair.tokenOut)}
              </span>
            </div>
            <span className='ml-2 text-grayTextSecondary'>via</span>
            <div className='ml-1 flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
              <ArrowLeftRight size={15} className='text-primary' />
              <span className=''>
                {aggregatedData.type === "AGGREGATOR_SWAP"
                  ? "Aggregator swap"
                  : aggregatedData.type === "DEXHUNTER_SWAP"
                    ? "Dexhunter aggregator"
                    : "Direct swap"}
              </span>
            </div>
          </div>
          <div
            className='mt-3 grid gap-4 text-sm font-medium text-grayTextSecondary'
            style={{ gridTemplateColumns: "40% 20% 20% 20%" }}
          >
            <div>Route</div>
            <div>Price</div>
            <div>Status</div>
            <div>Completion tx</div>
          </div>
        </div>

        {/* Individual Orders */}
        {aggregatedData.orders.length > 1 && (
          <div className='px-4 py-3'>
            <div className='space-y-3'>
              {aggregatedData.orders.map((order, index) => {
                const dexKey = order.dex.toUpperCase();
                const dex = dexConfig[dexKey];
                const price = calculatePrice(order);
                const actualOut =
                  order.actual_out_amount || order.expected_out_amount;

                return (
                  <div
                    key={index}
                    className='grid gap-4 text-sm'
                    style={{ gridTemplateColumns: "40% 20% 20% 20%" }}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        {getAssetImage(order.token_in.name)}
                        <span>
                          {order.amount_in.toFixed(0)}{" "}
                          {formatTokenName(order.token_in.name)}
                        </span>
                      </div>
                      <ArrowRight size={14} />
                      <div className='flex items-center gap-1'>
                        {getAssetImage(order.token_out.name)}
                        <span>
                          {!order.actual_out_amount ? "~" : ""}
                          {actualOut.toFixed(0)}{" "}
                          {formatTokenName(order.token_out.name)}
                        </span>
                      </div>
                      <span className='text-sm text-grayTextSecondary'>on</span>
                      <div
                        className='flex items-center gap-1 whitespace-nowrap rounded-xl border px-1 text-sm sm:px-1.5'
                        style={{
                          backgroundColor: dex?.bgColor ?? "transparent",
                          borderColor: dex?.borderColor ?? "var(--border)",
                        }}
                      >
                        {!!dex?.icon && (
                          <Image
                            src={dex.icon}
                            className='h-3 w-3 flex-shrink-0 rounded-full'
                            alt={dex?.label}
                          />
                        )}
                        <span
                          className='truncate text-sm sm:text-sm'
                          style={{ color: dex?.textColor ?? "var(--text)" }}
                        >
                          <span className='hidden sm:inline'>
                            {dex?.label ?? order.dex}
                          </span>
                          <span className='sm:hidden'>
                            {dex?.label?.replace("V2", "").replace("V3", "") ??
                              order.dex.replace("V2", "").replace("V3", "")}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>{formatSmallValueWithSub(price / 1e12, "₳ ")}</div>
                    <div className='flex items-center'>
                      <p className='flex w-fit items-center gap-1 rounded-md border border-border px-2 text-sm'>
                        {getStatusIcon(order.status)}
                        <span className='capitalize'>
                          {order.status === "PARTIALLY_COMPLETE"
                            ? "Partially completed"
                            : order.status
                              ? order.status[0].toUpperCase() +
                                order.status.slice(1).toLowerCase()
                              : ""}
                        </span>
                      </p>
                    </div>
                    <div>
                      {order.update_tx_hash ? (
                        <div className='flex items-center gap-1'>
                          <Link
                            to='/tx/$hash'
                            params={{ hash: order.update_tx_hash }}
                            className='text-sm text-primary'
                          >
                            {formatString(order.update_tx_hash, "short")}
                          </Link>
                          <Copy copyText={order.update_tx_hash} />
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
