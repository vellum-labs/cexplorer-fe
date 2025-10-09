import type { FC, ReactNode } from "react";

interface EpochStatsProps {
  epochStats: { title: string; value: ReactNode }[];
}

export const EpochStats: FC<EpochStatsProps> = ({ epochStats }) => {
  return (
    <div className='min-h-1/2 flex w-full flex-col gap-2 rounded-m border border-border px-3 py-1.5'>
      <span className='text-text-md font-semibold'>Epoch Stats</span>
      <ul className='flex flex-col gap-1'>
        {epochStats.map(({ title, value }) => (
          <li key={title} className='flex w-full items-center justify-between'>
            <span className='text-grayTextPrimary min-w-[100px] flex-1 pr-1 text-text-sm'>
              {title}
            </span>
            <div className='overflow-wrap break-word flex-[2] text-start text-text-sm font-medium'>
              {value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
