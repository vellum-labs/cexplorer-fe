import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

interface DRepThresholdChartProps {
  chartProps: {
    epochParam: any;
    drepsCount: number;
    includeInactive: boolean;
    visibility: boolean;
    activeVotingStake: number;
    activeVotingStakeInactive: number;
    filteredDReps: any[];
    params: null | string;
  };
}

export const DRepThresholdChart: FC<DRepThresholdChartProps> = ({
  chartProps,
}) => {
  const {
    epochParam,
    drepsCount,
    includeInactive,
    visibility,
    activeVotingStake,
    filteredDReps,
    activeVotingStakeInactive,
    params,
  } = chartProps;

  const { textColor, bgColor } = useGraphColors();

  const threshold = params ? epochParam[params] : 0;

  const yesThresholdAmount = visibility
    ? Math.ceil(
        (includeInactive ? activeVotingStakeInactive : activeVotingStake) *
          threshold,
      )
    : 0;

  let accumulated = 0;
  let count = 0;
  const requiredDReps: typeof filteredDReps = [];

  for (const drep of filteredDReps) {
    if (accumulated >= yesThresholdAmount) break;
    accumulated += Number(drep.amount ?? 0);
    count++;
    requiredDReps.push(drep);
  }

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        if (!visibility) {
          return "DReps do not vote on this action";
        }

        const isVoting = params.data.name === "Voting";
        const value = isVoting ? count : drepsCount - count;
        return `${params.data.name}<br/>DReps: ${value}`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        emphasis: visibility
          ? {}
          : {
              disabled: true,
            },
        label: {
          show: true,
          position: "center",
          formatter: visibility
            ? filteredDReps.length >= 100 && accumulated < yesThresholdAmount
              ? "100+"
              : `${count}`
            : "N/A",
          fontSize: 22,
          fontWeight: 600,
          color: textColor,
        },
        data: visibility
          ? [
              {
                value: accumulated,
                name: "Voting",
                itemStyle: { color: "#f43f5e" },
              },
              {
                value:
                  (includeInactive
                    ? activeVotingStakeInactive
                    : activeVotingStake) - accumulated,
                name: "Not voting",
                itemStyle: { color: "#22c55e" },
              },
            ]
          : [
              {
                value: 1,
                name: "Not applicable",
                itemStyle: { color: "#E4E7EC" },
              },
            ],
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <p className='mb-2 font-medium'>DReps</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              Minimum number of DReps with enough voting power to pass this
              proposal.
            </p>
          }
        >
          <CircleHelp
            size={15}
            className='-translate-y-[4.5px] cursor-pointer text-grayTextPrimary'
          />
        </Tooltip>
      </div>
      <div className='h-[260px] w-full max-w-[260px]'>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <p className='text-sm text-text'>
        Threshold: {visibility ? `${threshold * 100}%` : "Not applicable"} (
        {includeInactive ? "Including Inactive" : "Only Active"})
      </p>
    </div>
  );
};
