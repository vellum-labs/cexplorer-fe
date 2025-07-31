import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface CCThresholdChartProps {
  chartProps: {
    epochParam?: any;
    ccData: {
      count: number;
      quorum_numerator: number;
      quorum_denominator: number;
    };
    visibility: boolean;
    params: null | string;
  };
}

export const CCThresholdChart: FC<CCThresholdChartProps> = ({ chartProps }) => {
  const { ccData, visibility } = chartProps;

  const { textColor, bgColor } = useGraphColors();

  const ccMembers = ccData.count;
  const ccThreshold = visibility
    ? Math.ceil(
        ccMembers * (ccData.quorum_numerator / ccData.quorum_denominator),
      )
    : 0;

  const notVoting = visibility ? ccMembers - ccThreshold : 0;

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
      formatter: visibility
        ? "{b}<br/>CC Members: {c}"
        : "CC Members do not vote on this action",
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
          formatter: visibility ? `${ccThreshold}` : "N/A",
          fontSize: 22,
          fontWeight: 600,
          color: textColor,
        },
        data: visibility
          ? [
              {
                value: ccThreshold,
                name: "Voting",
                itemStyle: { color: "#f43f5e" },
              },
              {
                value: notVoting,
                name: "Not voting",
                itemStyle: { color: "#22c55e" },
              },
            ]
          : [
              {
                value: 1,
                name: "N/A",
                itemStyle: { color: "#E4E7EC" },
              },
            ],
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <p className='mb-2 font-medium'>Constitutional Committee</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              Minimum number of CC members required to approve this proposal.
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
          ? `${Math.round(
              (ccData.quorum_numerator / ccData.quorum_denominator) * 100,
            )}%`
          : "Not applicable"}
      </p>
    </div>
  );
};
