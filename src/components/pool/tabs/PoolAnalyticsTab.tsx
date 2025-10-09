import { StakeIsSpoDrepGraph } from "@/components/drep/StakeIsSpoDrepGraph";
import { StakeFirstRegisteredGraph } from "@/components/pool/graphs/StakeFirstRegisteredGraph";
import { StakeToSposNotDrepsGraph } from "@/components/pool/graphs/StakeToSposNotDrepsGraph";
import type { FC } from "react";

const PoolAnalyticsTab: FC = () => {
  return (
    <section className='flex flex-col gap-1'>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>New Stakers</h1>
        <div className='flex flex-col gap-2'>
          <StakeFirstRegisteredGraph />
        </div>
      </div>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>Stake Composition</h1>
        <div className='flex flex-col gap-2'>
          <StakeToSposNotDrepsGraph />
          <StakeIsSpoDrepGraph />
        </div>
      </div>
    </section>
  );
};

export default PoolAnalyticsTab;
