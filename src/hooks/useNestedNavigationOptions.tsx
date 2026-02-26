import { useMemo } from "react";
import { useAppTranslation } from "./useAppTranslation";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";

export const useNestedNavigationOptions = () => {
  const { t } = useAppTranslation("navigation");

  const nestedNavigationOptions = useMemo(
    () => ({
      moreOptions: {
        tools: {
          label: t("tools.label"),
          options: [
            {
              label: t("tools.addressInspector"),
              href: "/address/inspector",
            },
            {
              label: t("tools.datumInspector"),
              href: "/datum",
            },
            {
              label: t("tools.epochCalendar"),
              href: "/epoch/calendar",
            },
            {
              label: t("tools.rewardsChecker"),
              href: "/rewards-checker",
            },
            {
              label: t("tools.taxTool"),
              href: "/tax-tool/",
            },
            {
              label: t("tools.rewardsCalculator"),
              href: "/rewards-calculator",
            },
            {
              label: t("tools.poolDebug"),
              href: "/pool-debug",
            },
          ],
        },
        others: {
          label: "",
          options: [
            {
              label: t("tools.uplcViewer"),
              href: "/uplc",
            },
            {
              label: (
                <span className='flex items-center'>
                  <img src={DollarIcon} alt='$' className='-ml-[3px] h-4 w-4' />
                  {t("tools.handleDns")}
                </span>
              ),
              href: "/handle-dns",
            },
            {
              label: t("tools.ecoImpact"),
              href: "/eco-impact",
            },
          ],
        },
        services: {
          label: t("services.label"),
          options: [
            {
              label: t("services.advertising"),
              href: "/ads",
            },
            {
              label: t("services.promotion"),
              href: "/ads/promotion",
            },
            {
              label: t("services.apiPlans"),
              href: "/api",
            },
            {
              label: t("services.bots"),
              href: "/bots",
            },
            {
              label: t("services.cexplorerPro"),
              href: "/pro",
            },
          ],
        },
        cexplorer: {
          label: t("cexplorer.label"),
          options: [
            {
              label: t("cexplorer.apiDocumentation"),
              href: "/api",
            },
            {
              label: t("cexplorer.environments"),
              href: "/envs",
            },
            {
              label: t("cexplorer.developers"),
              href: "/dev",
            },
            {
              label: t("cexplorer.devlog"),
              href: "/devlog",
            },
            {
              label: t("cexplorer.donation"),
              href: "/donate",
            },
            {
              label: t("cexplorer.faq"),
              href: "/faq",
            },
          ],
        },
      },
      analyticsOptions: {
        network: {
          label: t("analytics.network"),
          options: [
            {
              label: t("analytics.blocks"),
              href: "/analytics/network",
              params: { tab: "blocks" },
            },
            {
              label: t("analytics.blockVersions"),
              href: "/analytics/network",
              params: { tab: "block_versions" },
            },
            {
              label: t("analytics.energyConsumption"),
              href: "/analytics/network",
              params: { tab: "energy_consumption" },
            },
            {
              label: t("analytics.health"),
              href: "/analytics/network",
              params: { tab: "health" },
            },
            {
              label: t("analytics.storage"),
              href: "/analytics/network",
              params: { tab: "storage" },
            },
            {
              label: t("analytics.transactions"),
              href: "/analytics/network",
              params: { tab: "transactions" },
            },
            {
              label: t("analytics.hardfork"),
              href: "/hardfork",
            },
          ],
        },
        others: {
          label: "",
          options: [
            {
              label: t("analytics.pots"),
              href: "/pot",
            },
            {
              label: t("analytics.treasuryProjection"),
              href: "/treasury/projection",
            },
          ],
        },
        accounts: {
          label: t("analytics.accounts"),
          options: [
            {
              label: t("analytics.walletActivity"),
              href: "/analytics/account",
              params: { tab: "wallet_activity" },
            },
            {
              label: t("analytics.topAddresses"),
              href: "/analytics/account",
              params: { tab: "top_addresses" },
            },
            {
              label: t("analytics.topStakingAccounts"),
              href: "/analytics/account",
              params: { tab: "top_staking_accounts" },
            },
            {
              label: t("analytics.wealthComposition"),
              href: "/analytics/account",
              params: { tab: "wealth_composition" },
            },
            {
              label: t("analytics.genesisAddresses"),
              href: "/analytics/genesis",
            },
          ],
        },
        pools: {
          label: t("main.staking"),
          options: [
            {
              label: t("analytics.poolIssues"),
              href: "/analytics/pool",
              params: { tab: "pool_issues" },
            },
            {
              label: t("analytics.averagePools"),
              href: "/analytics/pool",
              params: { tab: "average_pools" },
            },
          ],
        },
        dapps: {
          label: t("analytics.dapps"),
          options: [
            {
              label: t("analytics.ranklist"),
              href: "/script",
              params: { tab: "ranklist" },
            },
            {
              label: t("analytics.interactions"),
              href: "/script",
              params: { tab: "interactions" },
            },
            {
              label: t("analytics.tvl"),
              href: "/script",
              params: { tab: "tvl" },
            },
          ],
        },
      },
    }),
    [t],
  );

  return { nestedNavigationOptions };
};

export default useNestedNavigationOptions;
