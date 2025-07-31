interface Props {
  maxSize: number;
  size: number;
}

export const SizeCell = ({ maxSize, size }: Props) => {
  const sizeInKb = (size / 1024).toFixed(1);
  const percent = ((size / maxSize) * 100).toFixed(1);

  if (!size || !maxSize) return <p className='text-left'>Unknown</p>;

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between gap-1'>
        <span className='text-grayTextPrimary text-[12px] font-semibold'>
          {sizeInKb}kB{" "}
        </span>
        <span className='text-grayTextPrimary text-[11px] font-medium'>
          ({percent}%)
        </span>
      </div>
      <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
        <span
          className='absolute bottom-0 left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
          style={{ width: `${percent}%` }}
        ></span>
      </div>
    </div>
  );
};
