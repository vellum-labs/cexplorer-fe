import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

interface TotalThresholdChartProps {
  chartProps: {
    epochParam: any;
    poolsCount: number;
    drepsCount: number;
    ccData: {
      count: number;
      quorum_numerator: number;
      quorum_denominator: number;
    };
    includeInactive: boolean;
    activeVotingStake: number;
    activeVotingStakeInactive: number;
    filteredDReps: any[];
    isSecuryTitle: boolean;
    visibility: {
      total: boolean;
      cc: boolean;
      drep: boolean;
      spo: boolean;
    };
    params: {
      cc: null | string;
      drep: null | string;
      spo: null | string;
    };
  };
}

export const TotalThresholdChart: FC<TotalThresholdChartProps> = ({
  chartProps,
}) => {
  const {
    epochParam,
    poolsCount,
    drepsCount,
    ccData,
    isSecuryTitle,
    visibility,
    includeInactive,
    activeVotingStake,
    activeVotingStakeInactive,
    filteredDReps,
    params,
  } = chartProps;

  const { textColor, bgColor } = useGraphColors();

  const securyTitle = isSecuryTitle
    ? Math.ceil(poolsCount * epochParam[params.spo ?? ""])
    : "";

  const cc = visibility.cc
    ? Math.ceil(
        ccData.count * (ccData.quorum_numerator / ccData.quorum_denominator),
      )
    : 0;

  const threshold = epochParam[params.drep ?? ""];
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

  const drep = visibility.drep ? Math.ceil(count) : 0;
  const spo = visibility.spo
    ? Math.ceil(poolsCount * (params.spo ? epochParam[params.spo] : ""))
    : 0;

  const total = cc + drep + spo;

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: "Entity #{b}<br/>Votes: {c}",
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        label: {
          show: true,
          position: "center",
          formatter: () =>
            isSecuryTitle
              ? `{main|${total}}\n{gap|}\n{highlight|${securyTitle ?? ""}}`
              : `{main|${total}}`,
          rich: {
            main: {
              fontSize: 22,
              fontWeight: 600,
              color: textColor,
            },
            gap: {
              height: 10,
            },
            highlight: {
              fontSize: 22,
              fontWeight: 600,
              color: "#F79009",
            },
          },
        },
        data: [
          {
            value: isSecuryTitle ? total - Number(securyTitle) : total,
            name: "Needed",
            itemStyle: { color: "#f43f5e" },
          },
          {
            value:
              (visibility.spo ? poolsCount : 0) +
              (visibility.drep ? drepsCount : 0) +
              (visibility.cc ? ccData.count : 0) -
              total -
              (isSecuryTitle ? Number(securyTitle) : 0),
            name: "Not voting",
            itemStyle: { color: "#22c55e" },
          },
          {
            value: isSecuryTitle ? Number(securyTitle) : 0,
            name: "Secury group",
            itemStyle: { color: "#F79009" },
          },
        ],
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <p className='mb-2 font-medium'>Total</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              Minimum number of entities (CC, DReps, SPOs) needed to pass this
              governance action.
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
    </div>
  );
};
