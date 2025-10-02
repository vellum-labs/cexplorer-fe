import type { FC } from "react";
import type { DeFiOrder } from "@/types/tokenTypes";
import type { AggregatedSwapData } from "@/utils/dex/aggregateSwapData";

import {
  ArrowRight,
  Check,
  CircleAlert,
  Ellipsis,
  X,
} from "lucide-react";
import SundaeSwapIcon from "@/resources/images/icons/sundaeswap.png";
import MinSwapIcon from "@/resources/images/icons/minswap.png";

import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatNumberWithSuffix, formatString } from "@/utils/format/format";

interface SwapDetailTableProps {
  aggregatedData: AggregatedSwapData;
}

export const SwapDetailTable: FC<SwapDetailTableProps> = ({ aggregatedData }) => {
  const dexConfig: Record<
    string,
    {
      label: string;
      icon: string;
      textColor: string;
      bgColor: string;
      borderColor: string;
    }
  > = {
    SUNDAESWAP: {
      label: "SundaeSwap",
      icon: SundaeSwapIcon,
      textColor: "#E04F16",
      bgColor: "#FFF4ED",
      borderColor: "#FFD6AE",
    },
    SUNDAESWAPV3: {
      label: "SundaeSwapV3",
      icon: SundaeSwapIcon,
      textColor: "#E04F16",
      bgColor: "#FFF4ED",
      borderColor: "#FFD6AE",
    },
    MINSWAP: {
      label: "Minswap",
      icon: MinSwapIcon,
      textColor: "#001947",
      bgColor: "#DFE8FF",
      borderColor: "#83A2DC",
    },
    MINSWAPV2: {
      label: "MinswapV2",
      icon: MinSwapIcon,
      textColor: "#001947",
      bgColor: "#DFE8FF",
      borderColor: "#83A2DC",
    },
    WINGRIDERS: {
      label: "WingRiders",
      icon: "/icons/wingriders.png",
      textColor: "#7C3AED",
      bgColor: "#F3E8FF",
      borderColor: "#C4B5FD",
    },
  };

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

    // Check if it's ADA/lovelace in any form
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
    const isBuying = order.token_in.name === "lovelaces" || order.token_in.name === "lovelace";
    const adaAmount = isBuying ? order.amount_in : (order.actual_out_amount || order.expected_out_amount);
    const tokenAmount = isBuying ? (order.actual_out_amount || order.expected_out_amount) : order.amount_in;

    if (tokenAmount > 0) {
      return (adaAmount / tokenAmount) * 1e6;
    }
    return 0;
  };

  // Calculate summary row values
  const summaryAmountIn = aggregatedData.totalAmountIn;
  const summaryAmountOut = aggregatedData.totalActualOut || aggregatedData.totalExpectedOut;
  const summaryPrice = aggregatedData.adaPrice;

  return (
    <div className='w-full overflow-x-auto rounded-xl border border-border'>
      <div className='min-w-[1000px]'>
        <h3 className='border-b border-border bg-grayBgSecondary px-4 py-3 text-base font-medium'>
          Swap detail
        </h3>

        {/* Summary Row */}
        <div className='border-b border-border bg-grayBgTertiary px-4 py-3'>
          <div className='text-sm'>
            <span className='font-medium text-grayTextSecondary'>Token swap order: </span>
            <span className='font-medium'>
              {summaryAmountIn.toFixed(0)} {formatTokenName(aggregatedData.pair.tokenIn)}
            </span>
            <span className='mx-2 text-grayTextSecondary'>to</span>
            <span className='font-medium'>
              {aggregatedData.totalActualOut ? "" : "~"}
              {summaryAmountOut.toFixed(0)} {formatTokenName(aggregatedData.pair.tokenOut)}
            </span>
            <span className='ml-2 text-grayTextSecondary'>via</span>
            <span className='ml-1 font-medium capitalize'>
              {aggregatedData.type === "AGGREGATOR_SWAP"
                ? "Aggregator"
                : aggregatedData.type === "DEXHUNTER_SWAP"
                ? "Dexhunter aggregator"
                : "Direct swap"}
            </span>
          </div>
          <div className='mt-3 grid grid-cols-4 gap-4 text-sm font-medium text-grayTextSecondary'>
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
                const actualOut = order.actual_out_amount || order.expected_out_amount;

                return (
                  <div key={index} className='grid grid-cols-4 gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <span>
                        {order.amount_in.toFixed(0)} {formatTokenName(order.token_in.name)}
                      </span>
                      <ArrowRight size={14} />
                      <span>
                        {!order.actual_out_amount ? "~" : ""}
                        {actualOut.toFixed(0)} {formatTokenName(order.token_out.name)}
                      </span>
                      <span className='text-xs text-grayTextSecondary'>on</span>
                      <div
                        className='flex items-center gap-1 rounded-xl border px-1 sm:px-1.5 text-xs whitespace-nowrap'
                        style={{
                          backgroundColor: dex?.bgColor ?? "transparent",
                          borderColor: dex?.borderColor ?? "var(--border)",
                        }}
                      >
                        {!!dex?.icon && (
                          <Image src={dex.icon} className='h-3 w-3 rounded-full flex-shrink-0' alt={dex?.label} />
                        )}
                        <span
                          className='truncate text-xs sm:text-xs'
                          style={{ color: dex?.textColor ?? "var(--text)" }}
                        >
                          {/* Use shorter names on mobile */}
                          <span className='hidden sm:inline'>
                            {dex?.label ?? order.dex}
                          </span>
                          <span className='sm:hidden'>
                            {dex?.label?.replace('V2', '').replace('V3', '') ?? order.dex.replace('V2', '').replace('V3', '')}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <AdaWithTooltip data={price} />
                    </div>
                    <div className='flex items-center gap-1'>
                      {getStatusIcon(order.status)}
                      <span className='capitalize'>{order.status.toLowerCase()}</span>
                    </div>
                    <div>
                      {order.update_tx_hash ? (
                        <div className='flex items-center gap-1'>
                          <Link
                            to='/tx/$hash'
                            params={{ hash: order.update_tx_hash }}
                            className='text-primary text-xs'
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