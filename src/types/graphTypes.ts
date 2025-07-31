import type { UseQueryResult } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

export enum GraphTimePeriod {
  AllTime = "all_time",
  FiveDays = "5_days",
  TenDays = "10_days",
  ThirtyDays = "30_days",
  HundredDays = "100_days",
  FiveHundredDays = "500_days",
}

export type GraphSortData = {
  query: UseQueryResult<any, unknown>;
  setData: Dispatch<SetStateAction<any[] | undefined>>;
  setSelectedItem: Dispatch<SetStateAction<GraphTimePeriod>>;
  selectedItem: string;
  ignoreFiveDays?: boolean;
};
