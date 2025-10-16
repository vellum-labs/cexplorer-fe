import type { ResponseCore } from "./commonTypes";

export interface DexConfig {
  label: string;
  icon: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

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

interface DeFiTokenList {
  assetname: string;
  registry: any | null;
  stat: {
    "1d": number | null;
    "1m": number | null;
    "1w": number | null;
    "2w": number | null;
    "3m": number | null;
    rows: {
      "1m": number | null;
      "3m": number | null;
      "7d": number | null;
    };
    today: number | null;
    hist?: Array<{
      date: string;
      close: number;
    }>;
    volume?: number;
  };
  is_verified: boolean;
  price: number;
  updated: string;
  liquidity: number;
}

interface DeFiTokenStatDaily {
  date: string;
  tokens: number;
  volume: number;
  trade: {
    user: number;
    count: number;
  };
}

export interface DeFiTokenStatData {
  update_date: string;
  details: {
    dex: string;
    total: number;
    status: string;
  }[];
}

interface DeFiTokenStat {
  daily: DeFiTokenStatDaily[];
  data: DeFiTokenStatData[];
}

export type DeFiTokenListResponse = ResponseCore<{
  count: number;
  data: DeFiTokenList[];
  summary: Record<string, any>;
  recent_24h: {
    user: number;
    count: number;
    volume: number;
  };
}>;

interface DeFiTokenInOut {
  name: string;
  registry: null;
  stat: null;
}

interface DeFiUser {
  account: string;
  address: string;
  balance: null | number;
}

export interface DeFiOrder {
  token_in: DeFiTokenInOut;
  token_out: DeFiTokenInOut;
  user: DeFiUser;
  dex: string;
  status: string;
  amount_in: number;
  expected_out_amount: number;
  actual_out_amount: number;
  submission_time: string;
  last_update: string;
  tx_hash: string;
  update_tx_hash: string;
  is_stop_loss: boolean;
  is_oor: boolean;
  is_dexhunter: boolean;
  batcher_fee: number;
  deposit: number;
  block: {
    no: number;
    hash: string;
    time: string;
    epoch_no: number;
  };
}

interface DeFiOrderList {
  data: DeFiOrder[];
  count: number;
}

export type DeFiTokenStatResponse = ResponseCore<DeFiTokenStat>;
export type DeFiOrderListResponse = ResponseCore<DeFiOrderList>;
