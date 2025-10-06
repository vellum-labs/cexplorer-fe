import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { formatNumberWithSuffix } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";

interface DRepThresholdChartProps {
  chartProps: {
    epochParam: any;
    visibility: boolean;
    activeVotingStake: number;
    filteredDReps: any[];
    params: null | string;
  };
}

export const DRepThresholdChart: FC<DRepThresholdChartProps> = ({
  chartProps,
}) => {
  const { epochParam, visibility, activeVotingStake, filteredDReps, params } =
    chartProps;

  const { textColor, bgColor } = useGraphColors();

  const threshold = params ? epochParam[params] : 0;

  const votingStake = activeVotingStake;
  const requiredStake =
    visibility && votingStake > 0 ? votingStake * threshold : 0;

  let accumulated = 0;
  let count = 0;
  const requiredDReps: typeof filteredDReps = [];

  const sortedDReps = [...filteredDReps].sort(
    (a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0),
  );

  for (const drep of sortedDReps) {
    if (accumulated >= requiredStake) break;
    accumulated += Number(drep.amount ?? 0);
    count++;
    requiredDReps.push(drep);
  }

  const chartData = visibility
    ? [
        ...requiredDReps.map((drep, index) => ({
          value: Number(drep.amount ?? 0),
          name:
            drep.data?.given_name ||
            (typeof drep.hash?.view === "string"
              ? drep.hash.view.slice(0, 12) + "..."
              : null) ||
            `DRep ${index + 1}`,
          itemStyle: {
            color: "#f43f5e",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          drepData: drep,
          isRequired: true,
        })),
        {
          value: votingStake - accumulated,
          name: "Other DReps",
          itemStyle: {
            color: "#22c55e",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          isOther: true,
        },
      ]
    : [
        {
          value: 1,
          name: "Not applicable",
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
          return "DReps do not vote on this action";
        }

        if (params.data.isOther) {
          const stakeInAda = formatNumberWithSuffix(params.data.value / 1e6);
          return `Other DReps<br/>Stake: ${stakeInAda} ADA<br/>Not needed for threshold`;
        }

        if (params.data.drepData) {
          const drep = params.data.drepData;
          const stakeInAda = formatNumberWithSuffix(
            Number(drep.amount ?? 0) / 1e6,
          );
          const imageUrl = generateImageUrl(
            drep.hash?.view ?? "",
            "sm",
            "drep",
          );

          return `
            <div>
              <div style="display: flex; align-items: center; gap: 6px; font-weight: 600; margin-bottom: 4px;">
                <img src="${imageUrl}" alt="DRep" style="width: 16px; height: 16px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'"/>
                ${params.data.name}
              </div>
              <div>Voting Power: ${stakeInAda} ADA</div>
              <div>Delegators: ${drep.distr?.count ?? "N/A"}</div>
            </div>
          `;
        }

        const stakeInAda = formatNumberWithSuffix(params.data.value / 1e6);
        return `${params.data.name}<br/>Stake: ${stakeInAda} ADA`;
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
          formatter: visibility ? `${count}` : "N/A",
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
      <div className='flex items-center gap-1'>
        <p className='mb-1 font-medium'>DReps</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              Theoretical minimum number of DReps with enough voting power to
              pass this proposal
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
          ? `${((threshold || 0) * 100).toFixed(0)}%`
          : "Not applicable"}{" "}
        (All DReps)
      </p>
    </div>
  );
};
