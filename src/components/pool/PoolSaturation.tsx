import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { activeStakePercentage } from "@/utils/activeStakePercentage";
import { getGradientColor } from "@/utils/getGradientColor";

interface Props {
  live_stake: number | undefined;
  className?: string;
}

const PoolSaturation = ({ live_stake, className }: Props) => {
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const { theme } = useThemeStore();

  const [optimalPoolSize, poolCapUsed] = activeStakePercentage(
    live_stake ?? 0,
    miscConst?.circulating_supply ?? 1,
    miscConst?.epoch_param?.optimal_pool_count ?? 1,
  );

  const fixedPoolCapUsed = poolCapUsed ? poolCapUsed.toFixed(2) : 0;

  return (
    <div className={`flex w-full items-center gap-1/2 ${className}`}>
      <div
        className={`relative h-3 max-w-20 overflow-hidden rounded-[4px] ${
          theme === "dark" ? "bg-[#505359]" : "bg-[#E4E7EC]"
        }`}
        style={{
          width: `${optimalPoolSize}%`,
        }}
      >
        <span
          className='absolute left-0 block h-3 rounded-bl-max rounded-tl-max'
          style={{
            width: `${poolCapUsed ?? 0}%`,
            backgroundColor: getGradientColor(poolCapUsed ?? 0),
          }}
        ></span>
      </div>
      <span className='w-11 text-right text-text-xs font-medium'>
        {String(fixedPoolCapUsed).length < 10 && fixedPoolCapUsed}%
      </span>
    </div>
  );
};

export default PoolSaturation;
