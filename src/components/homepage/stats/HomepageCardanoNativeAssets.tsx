import type { FC } from "react";

export const HomepageCardanoNativeAssets: FC = () => {
  return (
    <div className='mx-3 min-h-[110px] flex-grow'>
      <div className='flex items-center gap-2 pb-2'>
        <span className='text-3xl font-semibold'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayText'>
            Market cap
          </span>
        </div>
        <span className='text-sm font-semibold text-grayText'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayText'>
            Circulating supply
          </span>
        </div>
        <span className='text-sm font-semibold text-grayText'>TBD</span>
      </div>
      <div className='flex flex-grow items-center pb-[11px]'>
        <div className='flex min-w-[160px] items-center gap-1'>
          <span className='inline-block text-sm font-medium text-grayText'>
            Active stake
          </span>
        </div>
        <span className='text-sm font-semibold text-grayText'>TBD</span>
      </div>
    </div>
  );
};
