import type {
  NestedNavigation,
  NestedNavigationOptionType,
} from "@/types/navigationTypes";

export const nestedNavigationOptions: {
  [T in NestedNavigationOptionType]: NestedNavigation;
} = {
  moreOptions: {
    tools: {
      label: "Tools",
      //   labelHref: "/tools",
      options: [
        {
          label: "Address inspector",
          href: "/address/inspector",
        },
        {
          label: "Datum inspector",
          href: "/datum",
        },
        {
          label: "Epoch calendar",
          href: "/epoch/calendar",
        },
        {
          label: "Rewards checker",
          href: "/rewards-checker",
        },
        {
          label: "Tax tool",
          href: "/tax-tool/",
        },
        {
          label: "Rewards calculator",
          href: "/rewards-calculator",
        },
      ],
    },
    services: {
      label: "Services",
      options: [
        {
          label: "Advertising",
          href: "/ads",
        },
        {
          label: "API plans",
          href: "/api",
        },
        {
          label: "Bots",
          href: "/bots",
        },
        {
          label: "Cexplorer PRO",
          href: "/pro",
        },
      ],
    },
    cexplorer: {
      label: "Cexplorer",
      options: [
        {
          label: "API documentation",
          href: "/api",
        },
        {
          label: "Developers",
          href: "/developers",
        },
        {
          label: "Devlog",
          href: "/devlog",
        },
        {
          label: "Donation",
          href: "/donate",
        },
        {
          label: "FAQ",
          href: "/faq",
        },
      ],
    },
  },
  analyticsOptions: {
    network: {
      label: "Network",
      options: [
        {
          label: "Blocks",
          href: "/analytics/network",
          params: { tab: "blocks" },
        },
        {
          label: "Block versions",
          href: "/analytics/network",
          params: { tab: "block_versions" },
        },
        {
          label: "Energy constumption",
          href: "/analytics/network",
          params: { tab: "energy_consumption" },
        },
        {
          label: "Health",
          href: "/analytics/network",
          params: { tab: "health" },
        },
        {
          label: "Storage",
          href: "/analytics/network",
          params: { tab: "storage" },
        },
        {
          label: "Transactions",
          href: "/analytics/network",
          params: { tab: "transactions" },
        },
        {
          label: "Hardfork",
          href: "/hardfork",
        },
        {
          label: "Treasury projection",
          href: "/treasury/projection",
        },
      ],
    },
    others: {
      label: "",
      options: [
        {
          label: "Pots",
          href: "/pot",
        },
      ],
    },
    accounts: {
      label: "Accounts",
      options: [
        {
          label: "Wallet activity",
          href: "/analytics/account",
          params: { tab: "wallet_activity" },
        },
        {
          label: "Top addresses",
          href: "/analytics/account",
          params: { tab: "top_addresses" },
        },
        {
          label: "Top staking accounts",
          href: "/analytics/account",
          params: { tab: "top_staking_accounts" },
        },
        {
          label: "Wealth composition",
          href: "/analytics/account",
          params: { tab: "wealth_composition" },
        },
      ],
    },
    pools: {
      label: "Staking",
      options: [
        {
          label: "Pool issues",
          href: "/analytics/pool",
          params: { tab: "pool_issues" },
        },
        {
          label: "Average pools",
          href: "/analytics/pool",
          params: { tab: "average_pools" },
        },
      ],
    },
    dapps: {
      label: "dApps",
      options: [
        {
          label: "Ranklist",
          href: "/script",
          params: { tab: "ranklist" },
        },
        {
          label: "Interactions",
          href: "/script",
          params: { tab: "interactions" },
        },
        {
          label: "TVL",
          href: "/script",
          params: { tab: "tvl" },
        },
      ],
    },
  },
} as const;
