import type { DeFiOrder } from "@/types/tokenTypes";

export interface AggregatedSwapData {
  address: string;
  timestamp: string;
  txHash: string;
  confirmations: [string, number];

  pair: {
    tokenIn: string;
    tokenOut: string;
    isMultiplePairs: boolean;
  };

  totalAmountIn: number;
  totalExpectedOut: number;
  totalActualOut: number;

  adaPrice: number;

  status: "COMPLETE" | "PENDING" | "PARTIALLY_COMPLETE" | "CANCELLED";

  lastUpdate: string;

  type: "AGGREGATOR_SWAP" | "DEXHUNTER_SWAP" | "DIRECT_SWAP";

  dexes: string[];

  totalBatcherFees: number;
  totalDeposits: number;

  orders: DeFiOrder[];
}

export function aggregateSwapData(
  orders: DeFiOrder[],
): AggregatedSwapData | null {
  if (!orders || orders.length === 0) {
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

  // ADA Price calculation: (sum of ADA from all trades / sum of tokens from all trades)
  let adaPrice = 0;
  let totalAdaAmount = 0;
  let totalTokenAmount = 0;

  orders.forEach(order => {
    const isConfirmed = order.status === "COMPLETE";

    // Check if this is ADA → TOKEN or TOKEN → ADA
    const isAdaInput =
      order.token_in.name === "lovelaces" ||
      order.token_in.name === "lovelace" ||
      order.token_in.name === "000000000000000000000000000000000000000000000000000000006c6f76656c616365";

    if (isAdaInput) {
      // ADA → TOKEN: amount_in is ADA, output is tokens
      const tokenOutAmount = isConfirmed
        ? (order.actual_out_amount || order.expected_out_amount)
        : order.expected_out_amount;

      totalAdaAmount += order.amount_in;
      totalTokenAmount += tokenOutAmount;
    } else {
      // TOKEN → ADA: amount_in is tokens, output is ADA
      const adaOutAmount = isConfirmed
        ? (order.actual_out_amount || order.expected_out_amount)
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

  let status: AggregatedSwapData["status"];
  if (completedCount === orders.length) {
    status = "COMPLETE";
  } else if (cancelledCount === orders.length) {
    status = "CANCELLED";
  } else if (completedCount > 0) {
    status = "PARTIALLY_COMPLETE";
  } else {
    status = "PENDING";
  }

  const lastUpdate = orders.reduce((latest, order) => {
    return new Date(order.last_update) > new Date(latest)
      ? order.last_update
      : latest;
  }, firstOrder.last_update);

  const uniqueDexes = new Set(orders.map(order => order.dex));
  const hasDexhunter = orders.some(order => order.is_dexhunter);

  let type: AggregatedSwapData["type"];
  if (hasDexhunter) {
    type = "DEXHUNTER_SWAP";
  } else if (uniqueDexes.size > 1) {
    type = "AGGREGATOR_SWAP";
  } else {
    type = "DIRECT_SWAP";
  }

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
