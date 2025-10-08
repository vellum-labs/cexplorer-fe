import type { AggregatedSwapData, DeFiOrder } from "@/types/tokenTypes";
import { ADATokenName } from "@/constants/currencies";

export function aggregateSwapData(
  orders: DeFiOrder[],
): AggregatedSwapData | null {
  if (!Array.isArray(orders) || orders.length === 0) {
    return null;
  }

  const firstOrder = orders[0];

  const uniquePairs = new Set(
    orders.map(order => `${order.token_in.name}-${order.token_out.name}`),
  );
  const isMultiplePairs = uniquePairs.size > 1;

  const totalAmountIn = orders.reduce(
    (sum, order) => sum + (order.amount_in || 0),
    0,
  );
  const totalExpectedOut = orders.reduce(
    (sum, order) => sum + (order.expected_out_amount || 0),
    0,
  );
  const totalActualOut = orders.reduce(
    (sum, order) => sum + (order.actual_out_amount || 0),
    0,
  );

  let adaPrice = 0;
  let totalAdaAmount = 0;
  let totalTokenAmount = 0;

  orders.forEach(order => {
    const isConfirmed = order.status === "COMPLETE";

    const isAdaInput =
      order.token_in.name === "lovelaces" ||
      order.token_in.name === "lovelace" ||
      order.token_in.name === ADATokenName;

    if (isAdaInput) {
      const tokenOutAmount = isConfirmed
        ? order.actual_out_amount || order.expected_out_amount
        : order.expected_out_amount;

      totalAdaAmount += order.amount_in;
      totalTokenAmount += tokenOutAmount;
    } else {
      const adaOutAmount = isConfirmed
        ? order.actual_out_amount || order.expected_out_amount
        : order.expected_out_amount;

      totalAdaAmount += adaOutAmount;
      totalTokenAmount += order.amount_in;
    }
  });

  if (totalTokenAmount > 0) {
    adaPrice = (totalAdaAmount / totalTokenAmount) * 1e6;
  }

  const statuses = orders.map(order => order.status);
  const completedCount = statuses.filter(s => s === "COMPLETE").length;
  const cancelledCount = statuses.filter(s => s === "CANCELLED").length;

  const getStatus = (): AggregatedSwapData["status"] => {
    switch (true) {
      case completedCount === orders.length:
        return "COMPLETE";
      case cancelledCount === orders.length:
        return "CANCELLED";
      case completedCount > 0:
        return "PARTIALLY_COMPLETE";
      default:
        return "PENDING";
    }
  };

  const status = getStatus();

  const lastUpdate = orders.reduce((latest, order) => {
    return new Date(order.last_update) > new Date(latest)
      ? order.last_update
      : latest;
  }, firstOrder.last_update);

  const uniqueDexes = new Set(orders.map(order => order.dex));
  const hasDexhunter = orders.some(order => order.is_dexhunter);

  const getType = (): AggregatedSwapData["type"] => {
    switch (true) {
      case hasDexhunter:
        return "DEXHUNTER_SWAP";
      case uniqueDexes.size > 1:
        return "AGGREGATOR_SWAP";
      default:
        return "DIRECT_SWAP";
    }
  };

  const type = getType();

  const dexes = Array.from(uniqueDexes);

  const totalBatcherFees = orders.reduce(
    (sum, order) => sum + (order.batcher_fee || 0),
    0,
  );
  const totalDeposits = orders.reduce(
    (sum, order) => sum + (order.deposit || 0),
    0,
  );

  return {
    address: firstOrder.user.address,
    timestamp: firstOrder.submission_time,
    txHash: firstOrder.tx_hash,
    confirmations: ["-", 0],
    pair: {
      tokenIn: firstOrder.token_in.name,
      tokenOut: firstOrder.token_out.name,
      isMultiplePairs,
    },
    totalAmountIn,
    totalExpectedOut,
    totalActualOut,
    adaPrice,
    status,
    lastUpdate,
    type,
    dexes,
    totalBatcherFees,
    totalDeposits,
    orders,
  };
}
