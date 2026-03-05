import type { FC } from "react";

import { StablecoinAnalyticsGraph } from "@/components/stablecoin-dashboard/StablecoinAnalyticsGraph";
import { StablecoinMintTable } from "@/components/stablecoin-dashboard/StablecoinMintTable";
import { StablecoinOverview } from "@/components/stablecoin-dashboard/StablecoinOverview";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchStablecoins } from "@/services/stablecoins";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const StablecoinDashboardPage: FC = () => {
  const { t } = useAppTranslation();
  const query = useFetchStablecoins();
  const data = query.data?.data ?? [];

  return (
    <PageBase
      metadataTitle='stablecoinDashboard'
      breadcrumbItems={[{ label: t("stablecoinDashboard.breadcrumb") }]}
      title={t("stablecoinDashboard.title")}
    >
      <div className='flex w-full flex-col items-center pt-4'>
        {query.isLoading ? (
          <section className='flex w-full max-w-desktop flex-col gap-3 px-mobile md:px-desktop'>
            <div className='flex h-full w-full flex-wrap items-stretch gap-2 lg:flex-nowrap'>
              {[1, 2, 3].map(i => (
                <LoadingSkeleton
                  key={i}
                  width='100%'
                  height='136px'
                  rounded='xl'
                  className='min-w-[280px] flex-1'
                />
              ))}
            </div>
            <LoadingSkeleton
              width='100%'
              height='460px'
              rounded='xl'
            />
            <LoadingSkeleton
              width='100%'
              height='300px'
              rounded='xl'
            />
          </section>
        ) : (
          <>
            <StablecoinOverview data={data} />
            <StablecoinAnalyticsGraph data={data} />
            <StablecoinMintTable stablecoins={data} />
          </>
        )}
      </div>
    </PageBase>
  );
};
