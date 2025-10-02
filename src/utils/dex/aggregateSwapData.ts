import type { DeFiOrder } from "@/types/tokenTypes";

export interface AggregatedSwapData {
  // Common transaction info (same for all orders in the transaction)
  address: string;
  timestamp: string;
  txHash: string;
  confirmations: [string, number];

  // Aggregated pair info
  pair: {
    tokenIn: string;
    tokenOut: string;
    isMultiplePairs: boolean;
  };

  // Aggregated amounts
  totalAmountIn: number;
  totalExpectedOut: number;
  totalActualOut: number;

  // Aggregated price (weighted average)
  adaPrice: number;

  // Aggregated status
  status: "COMPLETE" | "PENDING" | "PARTIALLY_COMPLETE" | "CANCELLED";

  // Most recent update
  lastUpdate: string;

  // Aggregated type
  type: "AGGREGATOR_SWAP" | "DEXHUNTER_SWAP" | "DIRECT_SWAP";

  // List of all DEXes used
  dexes: string[];

  // Aggregated fees and deposits
  totalBatcherFees: number;
  totalDeposits: number;

  // Individual orders for the detail table
  orders: DeFiOrder[];
}

export function aggregateSwapData(orders: DeFiOrder[]): AggregatedSwapData | null {
  if (!orders || orders.length === 0) {
    return null;
  }

  // Use first order for common transaction info
  const firstOrder = orders[0];

  // Check if all orders have the same pair
  const uniquePairs = new Set(
    orders.map(order => `${order.token_in.name}-${order.token_out.name}`)
  );
  const isMultiplePairs = uniquePairs.size > 1;

  // Aggregate amounts
  const totalAmountIn = orders.reduce((sum, order) => sum + (order.amount_in || 0), 0);
  const totalExpectedOut = orders.reduce((sum, order) => sum + (order.expected_out_amount || 0), 0);
  const totalActualOut = orders.reduce((sum, order) => sum + (order.actual_out_amount || 0), 0);

  // Calculate weighted average ADA price
  let adaPrice = 0;
  const adaOrders = orders.filter(order =>
    order.token_in.name === "lovelaces" || order.token_in.name === "lovelace" ||
    order.token_out.name === "lovelaces" || order.token_out.name === "lovelace"
  );

  if (adaOrders.length > 0) {
    let totalAdaAmount = 0;
    let totalTokenAmount = 0;

    adaOrders.forEach(order => {
      const isBuying = order.token_in.name === "lovelaces" || order.token_in.name === "lovelace";
      const adaAmount = isBuying ? order.amount_in : (order.actual_out_amount || order.expected_out_amount);
      const tokenAmount = isBuying ? (order.actual_out_amount || order.expected_out_amount) : order.amount_in;

      totalAdaAmount += adaAmount;
      totalTokenAmount += tokenAmount;
    });

    if (totalTokenAmount > 0) {
      adaPrice = (totalAdaAmount / totalTokenAmount) * 1e6;
    }
  }

  // Determine aggregated status
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

  // Find most recent update
  const lastUpdate = orders.reduce((latest, order) => {
    return new Date(order.last_update) > new Date(latest) ? order.last_update : latest;
  }, firstOrder.last_update);

  // Determine type
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

  // Get unique dexes
  const dexes = Array.from(uniqueDexes);

  // Aggregate fees and deposits
  const totalBatcherFees = orders.reduce((sum, order) => sum + (order.batcher_fee || 0), 0);
  const totalDeposits = orders.reduce((sum, order) => sum + (order.deposit || 0), 0);

  return {
    address: firstOrder.user.address,
    timestamp: firstOrder.submission_time,
    txHash: firstOrder.tx_hash,
    confirmations: ["-", 0], // Will be calculated in component
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