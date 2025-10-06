import type { FC } from "react";

interface BlockDetailSizeProps {
  maxSize: number | undefined;
  size: number | undefined;
  title: string;
  icon: JSX.Element;
}

export const SizeCard: FC<BlockDetailSizeProps> = ({
  maxSize,
  size,
  title,
  icon,
}) => {
  const sizeInKB = size ? (size / 1024).toFixed(2) : undefined;
  const percent =
    size && maxSize ? ((size / maxSize) * 100).toFixed(2) : undefined;

  return (
    <div className='max-h-[110px] min-h-[110px] rounded-l border border-border bg-cardBg shadow-md'>
      <div className='flex max-h-[110px] min-h-[110px] flex-col gap-1 rounded-l px-2 py-1.5'>
        <div className='flex w-full items-center gap-1'>
          <div className='rounded-m border border-border p-1/2'>{icon}</div>
          <span className='text-sm text-grayTextPrimary'>{title}</span>
        </div>
        {!isNaN(Number(sizeInKB)) ? (
          <span className='font-semibold text-text'>{sizeInKB}kB</span>
        ) : (
          <span className='font-semibold text-text'>Unknown</span>
        )}
        <div className='flex items-center gap-1.5'>
          <div className='relative h-2 w-2/3 overflow-hidden rounded-[4px] bg-[#FEC84B]'>
            <span
              className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
              style={{ width: `${percent ?? 0}%` }}
            ></span>
          </div>
          <span className='text-sm font-medium text-grayTextPrimary'>
            {!isNaN(Number(percent)) ? percent : "?"}%
          </span>
        </div>
      </div>
    </div>
  );
};
