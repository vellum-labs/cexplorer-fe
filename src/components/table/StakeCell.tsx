import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

interface StakeCellProps {
  stake: number;
  maxStake: number;
}

export const StakeCell = ({ stake, maxStake }: StakeCellProps) => {
  if (!stake || !maxStake) return <p className='text-left'>Unknown</p>;

  const ada = lovelaceToAda(stake);
  const percent = ((stake / maxStake) * 100).toFixed(1);

  return (
    <div className='flex flex-col gap-1/2'>
      <span className='text-[12px] font-semibold text-grayTextPrimary'>
        {formatNumber(ada)}
      </span>
      <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
        <span
          className='absolute bottom-0 left-0 h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
