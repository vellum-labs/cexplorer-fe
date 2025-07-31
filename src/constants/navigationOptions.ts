import type {
  NavigationOptions,
  NavigationOptionType,
} from "@/types/navigationTypes";

export const navigationOptions: {
  [T in NavigationOptionType]: NavigationOptions;
} = {
  blockchain: [
    {
      label: "Transactions",
      href: "/tx",
    },
    {
      label: "Blocks",
      href: "/block",
    },
    {
      label: "Epochs",
      href: "/epoch",
      params: { tab: "epochs" },
      divider: true,
    },
    {
      label: "Assets",
      href: "/asset",
      params: { tab: "all" },
      divider: true,
    },
    {
      label: "Contract transactions",
      href: "/contract/interactions",
    },
    {
      label: "Transactions metadata",
      href: "/metadata",
    },
    {
      label: "Treasury donations",
      href: "/treasury/donation",
      params: { tab: "donations" },
    },
  ],
  staking: [
    {
      label: "Stake pools",
      href: "/pool",
      params: { tab: "list" },
    },
    {
      label: "New pools",
      href: "/new-pools",
      divider: true,
    },
    {
      label: "Live delegations",
      href: "/live-delegations",
    },
    {
      label: "Rewards withdrawals",
      href: "/withdrawals",
      divider: true,
    },
    {
      label: "Pool birthdays",
      href: "/pool-birthdays",
    },
    {
      label: "Pool updates",
      href: "/pool-updates",
    },
    {
      label: "Retired pools",
      href: "/retired-delegations",
      params: { tab: "live" },
    },
    {
      label: "Multi-pool delegators",
      href: "/multi-pool-delegations",
      divider: true,
    },
    {
      label: "Certificates",
      onClick: () => {},
      nestedOptions: [
        {
          label: "Pool registrations",
          href: "/pool/registrations",
        },
        {
          label: "Pool deregistrations",
          href: "/pool/deregistrations",
          divider: true,
        },
        {
          label: "Stake registrations",
          href: "/stake/registrations",
        },
        {
          label: "Stake deregistrations",
          href: "/stake/deregistrations",
        },
      ],
      divider: true,
    },
    {
      label: "Rewards checker",
      href: "/rewards-checker",
    },
    {
      label: "Groups",
      href: "/groups",
    },
  ],
  governance: [
    { label: "DReps", href: "/drep" },
    { label: "CC", href: "/gov/cc" },
    { label: "Votes", href: "/gov/vote" },
    { label: "Power Thresholds", href: "/gov/power-thresholds" },
    { label: "Governance Actions", href: "/gov/action" },
    { label: "Withdrawal leaderboard", href: "/gov/drep-vote", divider: true },
    {
      label: "Certificates",
      nestedOptions: [
        {
          label: "DRep registrations",
          href: "/drep/registrations",
        },
        {
          label: "DRep deregistrations",
          href: "/drep/deregistrations",
        },
        {
          label: "DRep updates",
          href: "/drep/updates",
        },
      ],
    },
  ],
  tokens: [
    {
      label: "List",
      href: "/asset",
      params: { tab: "token" },
    },
    {
      label: "Recent",
      href: "/asset/recent-tokens",
    },
    {
      label: "Dashboard",
      href: "/token/dashboard",
      params: { tab: "tokens" },
    },
  ],
  nfts: [
    {
      label: "List",
      href: "/asset",
      params: { tab: "nft" },
    },
    {
      label: "Recent",
      href: "/asset/recent-nfts",
    },
  ],
  analyticsOptions: [
    {
      label: "Hardfork",
      href: "/hardfork",
    },
    {
      label: "Network",
      href: "/analytics/network",
    },
  ],
  education: [
    {
      label: "Articles",
      href: "/article",
    },
    {
      label: "Wallet comparison",
      href: "/wallet",
    },
  ],
  settingsOptions: [
    {
      label: "Settings",
      href: "/",
    },
  ],
} as const;
