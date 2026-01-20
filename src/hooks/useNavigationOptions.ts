import { useMemo } from "react";
import { useAppTranslation } from "./useAppTranslation";

export const useNavigationOptions = () => {
  const { t } = useAppTranslation("navigation");

  const navigationOptions = useMemo(
    () => ({
      blockchain: [
        {
          label: t("blockchain.transactions"),
          href: "/tx",
        },
        {
          label: t("blockchain.blocks"),
          href: "/block",
        },
        {
          label: t("blockchain.epochs"),
          href: "/epoch",
          params: { tab: "epochs" },
          divider: true,
        },
        {
          label: t("blockchain.assets"),
          href: "/asset",
          params: { tab: "all" },
          divider: true,
        },
        {
          label: t("blockchain.contractTransactions"),
          href: "/contract/interactions",
        },
        {
          label: t("blockchain.transactionsMetadata"),
          href: "/metadata",
        },
        {
          label: t("blockchain.treasuryDonations"),
          href: "/treasury/donation",
          params: { tab: "donations" },
        },
      ],
      staking: [
        {
          label: t("staking.stakePools"),
          href: "/pool",
          params: { tab: "list" },
        },
        {
          label: t("staking.newPools"),
          href: "/new-pools",
          divider: true,
        },
        {
          label: t("staking.liveDelegations"),
          href: "/live-delegations",
        },
        {
          label: t("staking.rewardsWithdrawals"),
          href: "/withdrawals",
          divider: true,
        },
        {
          label: t("staking.poolBirthdays"),
          href: "/pool-birthdays",
        },
        {
          label: t("staking.poolUpdates"),
          href: "/pool-updates",
        },
        {
          label: t("staking.retiredPools"),
          href: "/retired-delegations",
          params: { tab: "live" },
        },
        {
          label: t("staking.multiPoolDelegators"),
          href: "/multi-pool-delegations",
          divider: true,
        },
        {
          label: t("staking.certificates"),
          onClick: () => {},
          nestedOptions: [
            {
              label: t("staking.poolRegistrations"),
              href: "/pool/registrations",
            },
            {
              label: t("staking.poolDeregistrations"),
              href: "/pool/deregistrations",
              divider: true,
            },
            {
              label: t("staking.stakeRegistrations"),
              href: "/stake/registrations",
            },
            {
              label: t("staking.stakeDeregistrations"),
              href: "/stake/deregistrations",
            },
          ],
          divider: true,
        },
        {
          label: t("staking.rewardsChecker"),
          href: "/rewards-checker",
        },
        {
          label: t("staking.groups"),
          href: "/groups",
        },
      ],
      governance: [
        {
          label: t("governance.dreps"),
          href: "/drep",
          params: { tab: "list" },
        },
        {
          label: t("governance.cc"),
          href: "/gov/cc",
          params: { tab: "members" },
        },
        { label: t("governance.votes"), href: "/gov/vote" },
        {
          label: t("governance.powerThresholds"),
          href: "/gov/power-thresholds",
        },
        { label: t("governance.governanceActions"), href: "/gov/action" },
        {
          label: t("governance.drepDelegations"),
          href: "/drep",
          params: { tab: "delegations" },
        },
        {
          label: t("governance.constitution"),
          href: "/gov/constitution",
          divider: true,
        },
        {
          label: t("governance.certificates"),
          nestedOptions: [
            {
              label: t("governance.drepRegistrations"),
              href: "/drep/registrations",
            },
            {
              label: t("governance.drepDeregistrations"),
              href: "/drep/deregistrations",
            },
            {
              label: t("governance.drepUpdates"),
              href: "/drep/updates",
            },
          ],
        },
      ],
      tokens: [
        {
          label: t("tokens.list"),
          href: "/asset",
          params: { tab: "token" },
        },
        {
          label: t("tokens.recent"),
          href: "/asset/recent-tokens",
        },
        {
          label: t("tokens.dashboard"),
          href: "/token/dashboard",
          params: { tab: "tokens" },
        },
        {
          label: t("tokens.swap"),
          href: "/swap",
        },
      ],
      nfts: [
        {
          label: t("nfts.list"),
          href: "/asset",
          params: { tab: "nft" },
        },
        {
          label: t("nfts.recent"),
          href: "/asset/recent-nfts",
        },
      ],
      analyticsOptions: [
        {
          label: t("analytics.hardfork"),
          href: "/hardfork",
        },
        {
          label: t("analytics.network"),
          href: "/analytics/network",
        },
        {
          label: t("analytics.genesisAddresses"),
          href: "/analytics/genesis",
        },
      ],
      education: [
        {
          label: t("education.wiki"),
          href: "/wiki",
        },
        {
          label: t("education.articles"),
          href: "/article",
        },
        {
          label: t("education.walletComparison"),
          href: "/wallet",
        },
      ],
      settingsOptions: [
        {
          label: t("settings"),
          href: "/",
        },
      ],
    }),
    [t],
  );

  const labels = useMemo(
    () => ({
      blockchain: t("main.blockchain"),
      staking: t("main.staking"),
      governance: t("main.governance"),
      tokens: t("main.tokens"),
      nfts: t("main.nfts"),
      analytics: t("main.analytics"),
      education: t("main.education"),
      more: t("main.more"),
    }),
    [t],
  );

  return { navigationOptions, labels };
};

export default useNavigationOptions;
