import type { FC, ReactNode } from "react";

interface EpochStatsProps {
  epochStats: { title: string; value: ReactNode }[];
}

export const EpochStats: FC<EpochStatsProps> = ({ epochStats }) => {
  return (
    <div className='min-h-1/2 flex w-full flex-col gap-4 rounded-lg border border-border px-6 py-3'>
      <span className='text-base font-semibold'>Epoch Stats</span>
      <ul className='flex flex-col gap-2'>
        {epochStats.map(({ title, value }) => (
          <li key={title} className='flex w-full items-center justify-between'>
            <span className='text-grayTextPrimary min-w-[100px] flex-1 pr-2 text-sm'>
              {title}
            </span>
            <div className='overflow-wrap break-word flex-[2] text-start text-sm font-medium'>
              {value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
