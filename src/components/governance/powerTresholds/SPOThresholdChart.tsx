import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

interface SPOThresholdChartProps {
  chartProps: {
    epochParam: any;
    poolsCount: number;
    visibility: boolean;
    params: null | string;
    isSecuryTitle: boolean;
  };
}

export const SPOThresholdChart: FC<SPOThresholdChartProps> = ({
  chartProps,
}) => {
  const { epochParam, poolsCount, visibility, params, isSecuryTitle } =
    chartProps;

  const { textColor, bgColor } = useGraphColors();

  const thresholdParam = params ? epochParam[params] : 0;
  const spoThreshold = visibility ? Math.ceil(poolsCount * thresholdParam) : 0;

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: visibility
        ? "{b}<br/>SPOs: {c}"
        : "SPOs do not vote on this action",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        emphasis: visibility ? {} : { disabled: true },
        label: {
          show: true,
          position: "center",
          formatter: visibility ? `${spoThreshold}` : "N/A",
          fontSize: 22,
          fontWeight: 600,
          color: isSecuryTitle ? "#F79009" : textColor,
        },
        data: visibility
          ? [
              {
                value: spoThreshold,
                name: "Voting",
                itemStyle: {
                  color: isSecuryTitle ? "#F79009" : "#f43f5e",
                },
              },
              {
                value: poolsCount - spoThreshold,
                name: "Not voting",
                itemStyle: {
                  color: isSecuryTitle ? "#FEC84B" : "#22c55e",
                },
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
        <p className='mb-2 font-medium'>SPOs</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              Minimum number of SPOs with enough stake to pass this proposal.
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
        Threshold:{" "}
        {visibility
          ? `${(thresholdParam * 100).toFixed(0)}%`
          : "Not applicable"}
      </p>
    </div>
  );
};
