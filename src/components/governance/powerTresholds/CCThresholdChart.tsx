import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface CCThresholdChartProps {
  chartProps: {
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

  const ccMembers = Math.max(0, ccData.count || 0);
  const ccThreshold =
    visibility && ccData.quorum_denominator > 0
      ? Math.ceil(
          ccMembers * (ccData.quorum_numerator / ccData.quorum_denominator),
        )
      : 0;

  const notVoting = visibility ? ccMembers - ccThreshold : 0;

  const chartData = visibility
    ? [
        ...Array.from({ length: ccThreshold }, (_, index) => ({
          value: 1,
          name: `CC Member #${index + 1}`,
          itemStyle: {
            color: "#f43f5e",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          isVotingYes: true,
        })),
        ...Array.from({ length: notVoting }, (_, index) => ({
          value: 1,
          name: `CC Member #${ccThreshold + index + 1}`,
          itemStyle: {
            color: "#22c55e",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          isVotingNo: true,
        })),
      ]
    : [
        {
          value: 1,
          name: "N/A",
          itemStyle: { color: "#E4E7EC" },
        },
      ];

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
          return "CC Members do not vote on this action";
        }

        if (params.data.isVotingYes) {
          return `${params.data.name}<br/>Vote: Yes<br/>Needed for threshold`;
        }

        if (params.data.isVotingNo) {
          return `${params.data.name}<br/>Vote: No<br/>Not needed for threshold`;
        }

        return `${params.data.name}<br/>CC Members: ${params.data.value}`;
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
          formatter: visibility ? `${ccThreshold}` : "N/A",
          fontSize: 22,
          fontWeight: 600,
          color: textColor,
        },
        data: chartData,
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <p className='mb-1 font-medium'>Constitutional Committee</p>
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
              ccData.quorum_denominator > 0
                ? (ccData.quorum_numerator / ccData.quorum_denominator) * 100
                : 0,
            )}%`
          : "Not applicable"}
      </p>
    </div>
  );
};
