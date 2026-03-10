import type { ResponseCore } from "./commonTypes";

export interface StablecoinStatEpochData {
  count: number;
  stake: number;
  address: number;
  holders: number;
  with_data: string;
  ada_volume: number;
  asset_volume: number;
  payment_cred: number;
}

export interface StablecoinStat {
  epoch: number;
  data: StablecoinStatEpochData[];
}

export interface StablecoinRegistry {
  ticker: string;
  name: string;
  decimals: number;
  has_logo: boolean;
  description: string;
  url: string;
}

export interface StablecoinMintFlow {
  inflow: number | null;
  outflow: number | null;
}

export interface StablecoinData {
  fingerprint: string;
  quantity: number;
  last_mint: string;
  registry: StablecoinRegistry;
  stat: StablecoinStat[];
  mint: StablecoinMintFlow;
}

export type StablecoinResponse = ResponseCore<StablecoinData[]>;
