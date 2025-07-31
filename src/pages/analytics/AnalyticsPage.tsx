import { nestedNavigationOptions } from "@/constants/nestedNavigationOptions";
import { generateUrlWithParams } from "@/utils/generateUrlWithParams";
import { Link } from "@tanstack/react-router";
import pools from "@/resources/images/analytics/pools.svg";
import dapps from "@/resources/images/analytics/dapps.svg";
import accounts from "@/resources/images/analytics/accounts.svg";
import network from "@/resources/images/analytics/network.svg";

import { PageBase } from "@/components/global/pages/PageBase";

const images = {
  pools,
  dapps,
  accounts,
  network,
};

export const AnalyticsPage = () => {
  const options = {
    ...nestedNavigationOptions.analyticsOptions,
    network: {
      label: "Network",
      options: [
        ...nestedNavigationOptions.analyticsOptions.network.options,
        ...nestedNavigationOptions.analyticsOptions.others.options,
      ],
    },
    others: {
      label: "",
      options: [],
    },
  };

  return (
    <PageBase
      metadataTitle='analytics'
      title='Analytics'
      breadcrumbItems={[{ label: "Analytics" }]}
    >
      <section className='mt-4 flex w-full max-w-desktop flex-wrap gap-5 px-mobile pb-5 md:px-desktop'>
        {Object.keys(options)
          .filter(key => options[key].options.length)
          .map(key => (
            <div
              key={key}
              className='flex grow basis-[450px] flex-col gap-2 rounded-xl border border-border p-3 font-medium'
            >
              {<img src={images[key]} alt='Pools' />}
              {options[key].labelHref ? (
                <Link
                  to={options[key].labelHref}
                  className='border-b border-border pb-2 text-lg text-primary underline'
                >
                  {options[key].label}
                </Link>
              ) : (
                <p className='border-b border-border pb-2 text-lg text-text'>
                  {options[key].label}
                </p>
              )}
              <div className='mt-2 grid grid-flow-col grid-cols-2 grid-rows-4 gap-2'>
                {options[key].options.map(option => (
                  <Link
                    to={generateUrlWithParams(option.href, option.params)}
                    className='text-sm text-primary underline'
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
