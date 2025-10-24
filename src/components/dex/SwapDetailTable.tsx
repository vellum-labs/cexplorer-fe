import type { FC } from "react";
import type { AggregatedSwapData, DeFiOrder } from "@/types/tokenTypes";

import { ArrowRight, Check, Ellipsis, X, Route } from "lucide-react";
import { dexConfig } from "@/constants/dexConfig";

import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";
import { ADATokenName } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { AssetTicker } from "./AssetTicker";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";
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

  const safeToLocaleString = (value: number | undefined): string => {
    if (typeof value !== "number" || !isFinite(value)) return "0";
    return value.toLocaleString();
  };

  const safeToFixed = (value: number, decimals: number): string => {
    if (typeof value !== "number" || !isFinite(value)) return "0";
    return value.toFixed(decimals).replace(/\.?0+$/, "");
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
    const isBuying = isAda(order?.token_in?.name);

    if (isBuying) {
      const adaAmount = order.amount_in;
      const tokenAmount = order.actual_out_amount || order.expected_out_amount;
      return tokenAmount > 0 ? adaAmount / tokenAmount : 0;
    }

    const adaAmount = order.actual_out_amount || order.expected_out_amount;
    const tokenAmount = order.amount_in;
    return tokenAmount > 0 ? adaAmount / tokenAmount : 0;
  };

  const summaryAmountIn = aggregatedData.totalAmountIn;
  const summaryAmountOut =
    aggregatedData.totalActualOut || aggregatedData.totalExpectedOut;

  return (
    <div className='w-full overflow-x-auto rounded-xl border border-border xl:overflow-x-visible'>
      <div className='min-w-fit xl:min-w-full'>
        <div className='bg-grayBgTertiary border-b border-border px-2 py-1.5'>
          <div className='flex items-center gap-1 text-text-sm'>
            <span className='font-medium text-grayTextSecondary'>
              Token swap order:{" "}
            </span>
            <div className='flex items-center gap-1'>
              {getAssetImage(aggregatedData?.pair?.tokenIn, false, 16)}
              <Tooltip content={safeToLocaleString(summaryAmountIn)}>
                <span className='font-medium'>
                  {formatNumberWithSuffix(summaryAmountIn)}{" "}
                  {formatTokenName(aggregatedData?.pair?.tokenIn) === "ADA" ? (
                    "ADA"
                  ) : (
                    <AssetTicker
                      tokenName={aggregatedData?.pair?.tokenIn ?? ""}
                      registry={aggregatedData?.pair?.tokenInRegistry}
                    />
                  )}
                </span>
              </Tooltip>
            </div>
            <span className='mx-1 text-grayTextSecondary'>to</span>
            <div className='flex items-center gap-1'>
              {getAssetImage(aggregatedData?.pair?.tokenOut, false, 16)}
              <Tooltip content={safeToLocaleString(summaryAmountOut)}>
                <span className='font-medium'>
                  {aggregatedData?.totalActualOut ? "" : "~"}
                  {formatNumberWithSuffix(summaryAmountOut)}{" "}
                  {formatTokenName(aggregatedData?.pair?.tokenOut) === "ADA" ? (
                    "ADA"
                  ) : (
                    <AssetTicker
                      tokenName={aggregatedData?.pair?.tokenOut ?? ""}
                      registry={aggregatedData?.pair?.tokenOutRegistry}
                    />
                  )}
                </span>
              </Tooltip>
            </div>
            <span className='ml-1 text-grayTextSecondary'>via</span>
            <div className='ml-1/2'>
              <SwapTypeBadge
                uniqueDexesCount={aggregatedData?.dexes?.length ?? 0}
                hasDexhunter={
                  Array.isArray(aggregatedData?.orders) &&
                  aggregatedData.orders.some(order => order.is_dexhunter)
                }
              />
            </div>
          </div>
          <div
            className='text-sm mt-1.5 grid gap-2 font-medium text-grayTextSecondary'
            style={{ gridTemplateColumns: "55% 15% 15% 15%" }}
          >
            <div className='flex items-center gap-1'>Route</div>
            <div>Price</div>
            <div>Status</div>
            <div>Completion tx</div>
          </div>
        </div>

        <div className='px-2 py-1.5'>
          <div className='space-y-1.5'>
            {Array.isArray(aggregatedData.orders) &&
              aggregatedData.orders
                .filter(order => order != null)
                .map((order, index) => {
                  const dexKey = order.dex.toUpperCase();
                  const dex = dexConfig[dexKey];
                  const price = calculatePrice(order);
                  const actualOut =
                    order.actual_out_amount || order.expected_out_amount;

                  return (
                    <div
                      key={index}
                      className='grid gap-2 text-text-sm'
                      style={{ gridTemplateColumns: "55% 15% 15% 15%" }}
                    >
                      <div className='flex items-center gap-1'>
                        <Route size={16} className='text-grayTextSecondary' />
                        <div className='flex items-center gap-1/2'>
                          {getAssetImage(order.token_in.name, false, 16)}
                          <Tooltip
                            content={safeToLocaleString(order.amount_in)}
                          >
                            <span>
                              {formatNumberWithSuffix(order.amount_in)}{" "}
                              {formatTokenName(order.token_in.name) ===
                              "ADA" ? (
                                "ADA"
                              ) : (
                                <AssetTicker
                                  tokenName={order.token_in.name}
                                  registry={order.token_in.registry}
                                />
                              )}
                            </span>
                          </Tooltip>
                        </div>
                        <ArrowRight size={14} />
                        <div className='flex items-center gap-1/2'>
                          {getAssetImage(order.token_out.name, false, 16)}
                          <Tooltip content={safeToLocaleString(actualOut)}>
                            <span>
                              {!order.actual_out_amount ? "~" : ""}
                              {formatNumberWithSuffix(actualOut)}{" "}
                              {formatTokenName(order.token_out.name) ===
                              "ADA" ? (
                                "ADA"
                              ) : (
                                <AssetTicker
                                  tokenName={order.token_out.name}
                                  registry={order.token_out.registry}
                                />
                              )}
                            </span>
                          </Tooltip>
                        </div>
                        <span className='text-text-sm text-grayTextSecondary'>
                          on
                        </span>
                        <div
                          className='flex items-center gap-1/2 whitespace-nowrap rounded-xl border border-border bg-transparent px-1/2 text-text-sm text-text sm:px-1'
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
                              className='h-3 w-3 flex-shrink-0 rounded-max'
                              alt={dex?.label}
                            />
                          )}
                          <span className='text-sm truncate'>
                            <span className='hidden sm:inline'>
                              {dex?.label ?? order.dex}
                            </span>
                            <span className='sm:hidden'>
                              {dex?.label
                                ?.replace("V2", "")
                                .replace("V3", "") ??
                                order.dex.replace("V2", "").replace("V3", "")}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Tooltip
                        content={
                          <div className='flex items-center gap-1/2'>
                            <span>₳ {safeToFixed(price, 20)}</span>
                            <Copy copyText={safeToFixed(price, 20)} />
                          </div>
                        }
                      >
                        <div>
                          {formatSmallValueWithSub(price, "₳ ", 0.01, 6, 4)}
                        </div>
                      </Tooltip>
                      <div className='flex items-center'>
                        <p className='flex w-fit items-center gap-1/2 rounded-m border border-border px-1 text-text-sm'>
                          {getStatusIcon(order.status)}
                          <span className='capitalize'>
                            {order.status === "PARTIALLY_COMPLETE"
                              ? "Partially completed"
                              : order.status[0].toUpperCase() +
                                order.status.slice(1).toLowerCase()}
                          </span>
                        </p>
                      </div>
                      <div>
                        {order?.update_tx_hash ? (
                          <div className='flex items-center gap-1/2'>
                            <Link
                              to='/tx/$hash'
                              params={{ hash: order.update_tx_hash }}
                              className='text-text-sm text-primary'
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
