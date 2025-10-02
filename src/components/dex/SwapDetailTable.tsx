import type { FC } from "react";
import type { DeFiOrder } from "@/types/tokenTypes";
import type { AggregatedSwapData } from "@/utils/dex/aggregateSwapData";

import { ArrowRight, Check, Ellipsis, X } from "lucide-react";
import SundaeSwapIcon from "@/resources/images/icons/sundaeswap.png";
import MinSwapIcon from "@/resources/images/icons/minswap.png";

import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { formatString } from "@/utils/format/format";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";

interface SwapDetailTableProps {
  aggregatedData: AggregatedSwapData;
}

export const SwapDetailTable: FC<SwapDetailTableProps> = ({
  aggregatedData,
}) => {
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
          <div className='text-sm'>
            <span className='font-medium text-grayTextSecondary'>
              Token swap order:{" "}
            </span>
            <span className='font-medium'>
              {summaryAmountIn.toFixed(0)}{" "}
              {formatTokenName(aggregatedData.pair.tokenIn)}
            </span>
            <span className='mx-2 text-grayTextSecondary'>to</span>
            <span className='font-medium'>
              {aggregatedData.totalActualOut ? "" : "~"}
              {summaryAmountOut.toFixed(0)}{" "}
              {formatTokenName(aggregatedData.pair.tokenOut)}
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
                      <span>
                        {order.amount_in.toFixed(0)}{" "}
                        {formatTokenName(order.token_in.name)}
                      </span>
                      <ArrowRight size={14} />
                      <span>
                        {!order.actual_out_amount ? "~" : ""}
                        {actualOut.toFixed(0)}{" "}
                        {formatTokenName(order.token_out.name)}
                      </span>
                      <span className='text-xs text-grayTextSecondary'>on</span>
                      <div
                        className='flex items-center gap-1 whitespace-nowrap rounded-xl border px-1 text-xs sm:px-1.5'
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
                          className='truncate text-xs sm:text-xs'
                          style={{ color: dex?.textColor ?? "var(--text)" }}
                        >
                          {/* Use shorter names on mobile */}
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
                    <div>{formatSmallValueWithSub(price / 1e12, "₳")}</div>
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
                            className='text-xs text-primary'
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
