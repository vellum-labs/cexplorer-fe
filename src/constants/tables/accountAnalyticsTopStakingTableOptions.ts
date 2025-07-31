import type { AccountAnalyticsTopStakingTableOptions } from "@/types/tableTypes";

interface TopStakingTableOptions {
  key: keyof AccountAnalyticsTopStakingTableOptions["columnsVisibility"];
  name: string;
}

export const accountAnalyticsTopStakingTableOptions: TopStakingTableOptions[] =
  [
    {
      key: "order",
      name: "#",
    },
    {
      key: "account",
      name: "Account",
    },
    {
      key: "live_stake",
      name: "Live Stake",
    },
    {
      key: "loyalty",
      name: "Loyalty",
    },
    {
      key: "pool_delegation",
      name: "Pool delegation",
    },
    {
      key: "drep_delegation",
      name: "Drep delegation",
    },
  ];
