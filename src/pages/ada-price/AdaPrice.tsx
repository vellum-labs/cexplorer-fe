import type { FC } from "react";

import { AdaPriceTable } from "@/components/ada-price/AdaPriceTable";
import { AdaPriceGraph } from "@/components/ada-price/graphs/AdaPriceGraph";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { PageBase } from "@/components/global/pages/PageBase";

import { useMiscRate } from "@/hooks/useMiscRate";
import { useFetchMiscBasic } from "@/services/misc";

export const AdaPrice: FC = () => {
  const { data: miscBasic } = useFetchMiscBasic();
  const rates = useMiscRate(miscBasic?.data.version.rate);

  const graphRates = rates.filter(item => item.adausd && item.btcusd);

  return (
    <PageBase
      metadataTitle='adaPrice'
      breadcrumbItems={[{ label: "Ada price" }]}
      title={<div className='flex items-center gap-1'>ADA Price</div>}
    >
      <div className='flex w-full flex-col pt-4'>
        {graphRates.length ? (
          <section className='flex w-full flex-col items-center pb-3'>
            <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
              <div className='flex w-full flex-col gap-6 rounded-lg lg:flex-row'>
                <AdaPriceTable />
                <AdaPriceGraph graphRates={graphRates} />
              </div>
            </div>
          </section>
        ) : (
          <LoadingSkeleton
            width='1310px'
            height='400px'
            rounded='lg'
            className='mb-4'
          />
        )}
      </div>
    </PageBase>
  );
};
