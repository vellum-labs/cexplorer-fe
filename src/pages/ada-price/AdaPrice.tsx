import type { FC } from "react";

import { AdaPriceTable } from "@/components/ada-price/AdaPriceTable";
import { AdaPriceGraph } from "@/components/ada-price/graphs/AdaPriceGraph";
import { AdaPriceWithTxCountGraph } from "@/components/ada-price/graphs/AdaPriceWithTxCountGraph";
import { AdaPriceWithTVLGraph } from "@/components/ada-price/graphs/AdaPriceWithTVLGraph";
import { AdaPriceWithTxVolumeGraph } from "@/components/ada-price/graphs/AdaPriceWithTxVolumeGraph";
import { AdaPriceWithActiveAddressesGraph } from "@/components/ada-price/graphs/AdaPriceWithActiveAddressesGraph";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";

import { useMiscRate } from "@/hooks/useMiscRate";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchAnalyticsRate } from "@/services/analytics";
import { useFetchTVL } from "@/services/global";

export const AdaPrice: FC = () => {
  const { data: miscBasic } = useFetchMiscBasic();
  const rates = useMiscRate(miscBasic?.data.version.rate);
  const { data: analyticsRateData } = useFetchAnalyticsRate();
  const { data: tvlData } = useFetchTVL();

  const graphRates = rates.filter(item => item.adausd && item.btcusd);
  const analyticsData = analyticsRateData?.data ?? [];

  return (
    <PageBase
      metadataTitle='adaPrice'
      breadcrumbItems={[{ label: "Ada price" }]}
      title={<div className='flex items-center gap-1/2'>ADA Price</div>}
    >
      <div className='flex w-full flex-col pt-4'>
        {graphRates.length ? (
          <>
            <section className='flex w-full flex-col items-center pb-3'>
              <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
                <div className='flex w-full flex-col justify-between gap-3 rounded-m lg:flex-row'>
                  <AdaPriceTable />
                  <AdaPriceGraph graphRates={graphRates} />
                </div>
              </div>
            </section>
            <section className='flex w-full flex-col items-center gap-3 pb-3'>
              <div className='flex w-full max-w-desktop flex-col gap-3 px-mobile md:px-desktop'>
                <AdaPriceWithTxCountGraph
                  graphRates={graphRates}
                  analyticsData={analyticsData}
                />
                {tvlData && (
                  <AdaPriceWithTVLGraph
                    graphRates={graphRates}
                    tvlData={tvlData}
                  />
                )}
                <AdaPriceWithTxVolumeGraph
                  graphRates={graphRates}
                  analyticsData={analyticsData}
                />
                <AdaPriceWithActiveAddressesGraph
                  graphRates={graphRates}
                  analyticsData={analyticsData}
                />
              </div>
            </section>
          </>
        ) : (
          <section className='flex w-full flex-col items-center pb-5'>
            <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
              <div className='rounded-lg flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:items-start'>
                <LoadingSkeleton
                  width='1400px'
                  height='400px'
                  rounded='lg'
                  className='mb-4'
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </PageBase>
  );
};
