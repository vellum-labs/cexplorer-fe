import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { generateUrlWithParams } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import pools from "@/resources/images/analytics/pools.svg";
import dapps from "@/resources/images/analytics/dapps.svg";
import accounts from "@/resources/images/analytics/accounts.svg";
import network from "@/resources/images/analytics/network.svg";

import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const images = {
  pools,
  dapps,
  accounts,
  network,
};

export const AnalyticsPage = () => {
  const { t } = useAppTranslation();

  const optionLabelMap: Record<string, string> = {
    "Blocks": t("analyticsPage.options.blocks"),
    "Block versions": t("analyticsPage.options.blockVersions"),
    "Energy constumption": t("analyticsPage.options.energyConsumption"),
    "Health": t("analyticsPage.options.health"),
    "Storage": t("analyticsPage.options.storage"),
    "Transactions": t("analyticsPage.options.transactions"),
    "Hardfork": t("analyticsPage.options.hardfork"),
    "Pots": t("analyticsPage.options.pots"),
    "Treasury projection": t("analyticsPage.options.treasuryProjection"),
    "Wallet activity": t("analyticsPage.options.walletActivity"),
    "Top addresses": t("analyticsPage.options.topAddresses"),
    "Top staking accounts": t("analyticsPage.options.topStakingAccounts"),
    "Wealth composition": t("analyticsPage.options.wealthComposition"),
    "Genesis addresses": t("analyticsPage.options.genesisAddresses"),
    "Pool issues": t("analyticsPage.options.poolIssues"),
    "Average pools": t("analyticsPage.options.averagePools"),
    "Ranklist": t("analyticsPage.options.ranklist"),
    "Interactions": t("analyticsPage.options.interactions"),
    "TVL": t("analyticsPage.options.tvl"),
  };

  const translateOptions = (opts: typeof nestedNavigationOptions.analyticsOptions.network.options) =>
    opts.map(opt => ({ ...opt, label: optionLabelMap[opt.label] || opt.label }));

  const options = {
    pools: {
      label: t("analyticsPage.categories.pools"),
      options: translateOptions(nestedNavigationOptions.analyticsOptions.pools.options),
    },
    dapps: {
      label: t("analyticsPage.categories.dapps"),
      options: translateOptions(nestedNavigationOptions.analyticsOptions.dapps.options),
    },
    accounts: {
      label: t("analyticsPage.categories.accounts"),
      options: translateOptions(nestedNavigationOptions.analyticsOptions.accounts.options),
    },
    network: {
      label: t("analyticsPage.categories.network"),
      options: translateOptions([
        ...nestedNavigationOptions.analyticsOptions.network.options,
        ...nestedNavigationOptions.analyticsOptions.others.options,
      ]),
    },
  };

  return (
    <PageBase
      metadataTitle='analytics'
      title={t("analyticsPage.title")}
      breadcrumbItems={[{ label: t("analyticsPage.breadcrumb") }]}
    >
      <section className='mt-2 grid w-full max-w-desktop grid-cols-1 gap-3 px-mobile pb-3 md:grid-cols-2 md:px-desktop'>
        {Object.keys(options)
          .filter(key => options[key].options.length)
          .map(key => (
            <div
              key={key}
              className='flex flex-col gap-1 rounded-l border border-border p-1.5 font-medium'
            >
              {<img src={images[key]} alt='Pools' />}
              {options[key].labelHref ? (
                <Link
                  to={options[key].labelHref}
                  className='border-b border-border pb-1 text-text-lg text-primary underline'
                >
                  {options[key].label}
                </Link>
              ) : (
                <p className='border-b border-border pb-1 text-text-lg text-text'>
                  {options[key].label}
                </p>
              )}
              <div className='mt-1 grid grid-flow-col grid-cols-2 grid-rows-4 gap-1'>
                {options[key].options.map(option => (
                  <Link
                    to={generateUrlWithParams(option.href, option.params)}
                    className='text-text-sm text-primary underline'
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>
    </PageBase>
  );
};
