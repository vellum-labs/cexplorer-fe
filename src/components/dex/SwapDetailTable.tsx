import type { FC } from "react";
import type { DeFiOrder } from "@/types/tokenTypes";
import type { AggregatedSwapData } from "@/utils/dex/aggregateSwapData";

import { ArrowRight, Check, Ellipsis, X, Route } from "lucide-react";
import { dexConfig } from "@/constants/dexConfig";

import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { Image } from "../global/Image";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatString } from "@/utils/format/format";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";
import { ADATokenName } from "@/constants/currencies";
import { Tooltip } from "../ui/tooltip";
import { AssetTicker } from "./AssetTicker";
import { formatNumberWithSuffix } from "@/utils/format/format";
import { SwapTypeBadge } from "./SwapTypeBadge";
import { getAssetImage } from "@/utils/asset/getAssetImage";

interface SwapDetailTableProps {
  aggregatedData: AggregatedSwapData;
}

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

  const isAda = (tokenName: string) => {
    return (
      tokenName === "lovelaces" ||
      tokenName === "lovelace" ||
      tokenName === ADATokenName ||
      tokenName?.toLowerCase().includes("lovelace")
    );
  };

  const formatTokenName = (tokenName: string) => {
    const renderedName = renderAssetName({ name: tokenName });

    if (isAda(tokenName) || renderedName?.toLowerCase().includes("lovelace")) {
      return "ADA";
    }

    return renderedName;
  };

  const calculatePrice = (order: DeFiOrder) => {
    const isBuying = isAda(order.token_in.name);

    if (isBuying) {
      const adaAmount = order.amount_in;
      const tokenAmount = order.actual_out_amount || order.expected_out_amount;
      return tokenAmount > 0 ? adaAmount / tokenAmount : 0;
    } else {
      const adaAmount = order.actual_out_amount || order.expected_out_amount;
      const tokenAmount = order.amount_in;
      return tokenAmount > 0 ? adaAmount / tokenAmount : 0;
    }
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
              {getAssetImage(aggregatedData.pair.tokenIn, false, 16)}
              <Tooltip content={summaryAmountIn.toLocaleString()}>
                <span className='font-medium'>
                  {formatNumberWithSuffix(summaryAmountIn)}{" "}
                  {formatTokenName(aggregatedData.pair.tokenIn) === "ADA" ? (
                    "ADA"
                  ) : (
                    <AssetTicker tokenName={aggregatedData.pair.tokenIn} />
                  )}
                </span>
              </Tooltip>
            </div>
            <span className='mx-2 text-grayTextSecondary'>to</span>
            <div className='flex items-center gap-1'>
              {getAssetImage(aggregatedData.pair.tokenOut, false, 16)}
              <Tooltip content={summaryAmountOut.toLocaleString()}>
                <span className='font-medium'>
                  {aggregatedData.totalActualOut ? "" : "~"}
                  {formatNumberWithSuffix(summaryAmountOut)}{" "}
                  {formatTokenName(aggregatedData.pair.tokenOut) === "ADA" ? (
                    "ADA"
                  ) : (
                    <AssetTicker tokenName={aggregatedData.pair.tokenOut} />
                  )}
                </span>
              </Tooltip>
            </div>
            <span className='ml-2 text-grayTextSecondary'>via</span>
            <div className='ml-1'>
              <SwapTypeBadge
                uniqueDexesCount={aggregatedData.dexes.length}
                hasDexhunter={aggregatedData.orders.some(
                  order => order.is_dexhunter,
                )}
              />
            </div>
          </div>
          <div
            className='mt-3 grid gap-4 text-sm font-medium text-grayTextSecondary'
            style={{ gridTemplateColumns: "40% 20% 20% 20%" }}
          >
            <div className='flex items-center gap-1'>Route</div>
            <div>Price</div>
            <div>Status</div>
            <div>Completion tx</div>
          </div>
        </div>

        {/* Individual Orders */}
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
                    <Route size={16} className='text-grayTextSecondary' />
                    <div className='flex items-center gap-1'>
                      {getAssetImage(order.token_in.name, false, 16)}
                      <Tooltip content={order.amount_in.toLocaleString()}>
                        <span>
                          {formatNumberWithSuffix(order.amount_in)}{" "}
                          {formatTokenName(order.token_in.name) === "ADA" ? (
                            "ADA"
                          ) : (
                            <AssetTicker tokenName={order.token_in.name} />
                          )}
                        </span>
                      </Tooltip>
                    </div>
                    <ArrowRight size={14} />
                    <div className='flex items-center gap-1'>
                      {getAssetImage(order.token_out.name, false, 16)}
                      <Tooltip content={actualOut.toLocaleString()}>
                        <span>
                          {!order.actual_out_amount ? "~" : ""}
                          {formatNumberWithSuffix(actualOut)}{" "}
                          {formatTokenName(order.token_out.name) === "ADA" ? (
                            "ADA"
                          ) : (
                            <AssetTicker tokenName={order.token_out.name} />
                          )}
                        </span>
                      </Tooltip>
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
                  <Tooltip
                    content={
                      <div className='flex items-center gap-1'>
                        <span>₳ {price.toFixed(20).replace(/\.?0+$/, "")}</span>
                        <Copy
                          copyText={price.toFixed(20).replace(/\.?0+$/, "")}
                        />
                      </div>
                    }
                  >
                    <div>{formatSmallValueWithSub(price, "₳ ", 0.01, 6, 4)}</div>
                  </Tooltip>
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
      </div>
    </div>
  );
};
