import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import type { ThresholdPoolList } from "@/types/governanceTypes";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { useNavigate } from "@tanstack/react-router";

interface PowerThresholdsSPOAttackGraphProps {
  poolList: ThresholdPoolList;
  liveStake: number;
}

export const PowerThresholdsSPOAttackGraph: FC<
  PowerThresholdsSPOAttackGraphProps
> = ({ liveStake, poolList }) => {
  const sortedPools = [...poolList.data].sort(
    (a, b) => b.live_stake - a.live_stake,
  );

  const navigate = useNavigate();

  const targetStake = liveStake * 0.51;
  let accumulated = 0;
  let spoCount = 0;

  const segments: any[] = [];

  for (const pool of sortedPools) {
    if (accumulated >= targetStake) break;

    const remaining = targetStake - accumulated;
    const partStake = Math.min(pool.live_stake, remaining);
    accumulated += partStake;

    segments.push({
      name: pool.pool_id,
      value: partStake,
      rawAda: partStake,
      itemStyle: { color: "#F63D68" },
    });

    spoCount++;
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const percentOfTarget = (
          (params.data.value / targetStake) *
          100
        ).toFixed(2);
        const ada = params.data.rawAda.toFixed(2);
        return `
    <strong>Pool:</strong> ${params.name}<br/>
    <strong>Stake:</strong> ${lovelaceToAda(ada)}<br/>
    <strong>Percentage of total stake:</strong> ${percentOfTarget}%
  `;
      },
    },
    confine: true,
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: false,
    },
    xAxis: {
      type: "value",
      max: targetStake,
      show: false,
    },
    yAxis: {
      type: "category",
      show: false,
      data: [""],
    },
    series: segments.map(segment => ({
      type: "bar",
      stack: "total",
      name: segment.name,
      data: [segment],
      barMinHeight: 1,
    })),
  };

  return (
    <div className='relative flex w-full max-w-full items-center gap-1'>
      <div className='relative top-[-8px] mt-1.5 flex flex-col items-center'>
        <h4 className='text-text-xl font-semibold'>{spoCount}</h4>
        <span className='text-text-xs text-grayTextPrimary'>SPOs</span>
      </div>
      <div className='relative w-full'>
        <div className='absolute left-0 h-[40px] w-[51%] bg-[#F63D68]'></div>
        <div className='absolute right-0 h-[40px] w-[49%] bg-[#12B76A]'></div>
        <div
          className='absolute top-[-8px] h-[55px] border border-dashed border-black'
          style={{
            left: `${51}%`,
          }}
        ></div>
        <ReactECharts
          onEvents={{
            click: params => {
              const poolId = params.name;
              if (poolId) {
                navigate({
                  to: `/pool/${poolId}`,
                });
              }
            },
          }}
          option={option}
          className='max-h-[40px] max-w-[51%]'
        />
      </div>
    </div>
  );
};
