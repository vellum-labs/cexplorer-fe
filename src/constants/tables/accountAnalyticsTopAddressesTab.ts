import type { AccountAnalyticsTopAddressesTableOptions } from "@/types/tableTypes";

interface TopAddressesTableOptions {
  key: keyof AccountAnalyticsTopAddressesTableOptions["columnsVisibility"];
  name: string;
}

export const accountAnalyticsTopAddressesTableOptions: TopAddressesTableOptions[] =
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
      key: "ada_balance",
      name: "Ada balance",
    },
    {
      key: "pool_delegation",
      name: "Pool delegation",
    },
    {
      key: "drep_delegation",
      name: "Drep delegation",
    },
    {
      key: "first_activity",
      name: "First activity",
    },
    {
      key: "last_activity",
      name: "Last activity",
    },
  ];
