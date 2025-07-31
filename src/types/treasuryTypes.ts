import type { ResponseCore, SupportedCurrencies } from "./commonTypes";

export interface TreasuryDonationStatsEpoch {
  epoch_no: number;
  treasury_donation: number;
  rate: {
    ada: {
      low: number;
      high: number;
      open: number;
      close: number;
      volume: number;
      time_open: string;
      market_cap: number;
      time_close: string;
    }[];
    fiat: Record<SupportedCurrencies, [number, number]>;
  };
}

export type TreasuryDonationStatsResponse = ResponseCore<{
  epoch: TreasuryDonationStatsEpoch[];
  stat: { total: number };
}>;
