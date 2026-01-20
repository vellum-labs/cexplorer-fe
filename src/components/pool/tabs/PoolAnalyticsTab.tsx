import { StakeIsSpoDrepGraph } from "@/components/drep/StakeIsSpoDrepGraph";
import { StakeFirstRegisteredGraph } from "@/components/pool/graphs/StakeFirstRegisteredGraph";
import { StakeToSposNotDrepsGraph } from "@/components/pool/graphs/StakeToSposNotDrepsGraph";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { FC } from "react";

const PoolAnalyticsTab: FC = () => {
  const { t } = useAppTranslation("pages");

  return (
    <section className='flex flex-col gap-1'>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>{t("pools.analytics.newStakers")}</h1>
        <div className='flex flex-col gap-2'>
          <StakeFirstRegisteredGraph />
        </div>
      </div>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>{t("pools.analytics.stakeComposition")}</h1>
        <div className='flex flex-col gap-2'>
          <StakeToSposNotDrepsGraph />
          <StakeIsSpoDrepGraph />
        </div>
      </div>
    </section>
  );
};

export default PoolAnalyticsTab;
