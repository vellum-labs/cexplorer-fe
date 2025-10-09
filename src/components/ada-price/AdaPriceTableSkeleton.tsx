import type { FC } from "react";

import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";

export const AdaPriceTableSkeleton: FC = () => {
  return (
    <div className='flex w-full flex-col rounded-lg border border-border bg-cardBg pb-4 pt-4 lg:min-w-[390px] lg:max-w-[400px] lg:pb-0'>
      <div className='flex h-[110px] w-full flex-col gap-1 border-b border-border px-6 pb-4'>
        <div className='flex items-center gap-2'>
          <LoadingSkeleton width='36px' height='36px' rounded='md' />
          <LoadingSkeleton width='80px' height='24px' />
          <LoadingSkeleton width='70px' height='20px' />
        </div>
        <div className='flex items-center gap-2'>
          <LoadingSkeleton width='120px' height='32px' />
          <LoadingSkeleton width='60px' height='24px' rounded='full' />
        </div>
        <div className='flex items-center gap-1'>
          <LoadingSkeleton width='40px' height='16px' />
          <LoadingSkeleton width='14px' height='14px' />
          <LoadingSkeleton width='30px' height='16px' />
        </div>
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <LoadingSkeleton width='80px' height='16px' />
        </div>
        <LoadingSkeleton width='100px' height='16px' />
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <LoadingSkeleton width='40px' height='16px' />
        </div>
        <LoadingSkeleton width='120px' height='16px' />
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <LoadingSkeleton width='130px' height='16px' />
        </div>
        <LoadingSkeleton width='140px' height='16px' />
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b border-border bg-darker px-6'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <LoadingSkeleton width='90px' height='16px' />
        </div>
        <LoadingSkeleton width='100px' height='16px' />
      </div>

      <div className='flex h-[50px] flex-grow items-center border-b px-6 lg:border-none'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <LoadingSkeleton width='80px' height='16px' />
        </div>
        <LoadingSkeleton width='140px' height='16px' />
      </div>
    </div>
  );
};
