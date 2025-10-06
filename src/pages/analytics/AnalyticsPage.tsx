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
      <section className='mt-2 grid w-full max-w-desktop grid-cols-1 gap-3 px-mobile pb-3 md:grid-cols-2 md:px-desktop'>
        {Object.keys(options)
          .filter(key => options[key].options.length)
          .map(key => (
            <div
              key={key}
              className='flex flex-col gap-1 rounded-xl border border-border p-1.5 font-medium'
            >
              {<img src={images[key]} alt='Pools' />}
              {options[key].labelHref ? (
                <Link
                  to={options[key].labelHref}
                  className='border-b border-border pb-1 text-lg text-primary underline'
                >
                  {options[key].label}
                </Link>
              ) : (
                <p className='border-b border-border pb-1 text-lg text-text'>
                  {options[key].label}
                </p>
              )}
              <div className='mt-1 grid grid-flow-col grid-cols-2 grid-rows-4 gap-1'>
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
