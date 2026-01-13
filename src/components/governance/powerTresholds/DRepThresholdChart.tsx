import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation();
  const { epochParam, visibility, activeVotingStake, filteredDReps, params } =
    chartProps;

  const { formatLovelace } = useADADisplay();
  const { textColor, bgColor } = useGraphColors();

  const threshold = params ? epochParam?.[params] ?? 0 : 0;

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
          name: t("governance.thresholds.otherDReps"),
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
          name: t("governance.common.notApplicable"),
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
          return t("governance.thresholds.drepNotVoting");
        }

        if (params.data.isOther) {
          const stakeFormatted = formatLovelace(params.data.value);
          return `${t("governance.thresholds.otherDReps")}<br/>${t("governance.common.stake")} ${stakeFormatted}<br/>${t("governance.common.notNeededForThreshold")}`;
        }

        if (params.data.drepData) {
          const drep = params.data.drepData;
          const stakeFormatted = formatLovelace(Number(drep.amount ?? 0));
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
              <div>${t("governance.common.votingPower")} ${stakeFormatted}</div>
              <div>${t("governance.common.delegators")} ${drep.distr?.count ?? "N/A"}</div>
            </div>
          `;
        }

        const stakeFormatted = formatLovelace(params.data.value);
        return `${params.data.name}<br/>${t("governance.common.stake")} ${stakeFormatted}`;
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
        <p className='mb-1 font-medium'>{t("governance.thresholds.drepTitle")}</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              {t("governance.thresholds.drepTooltip")}
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
      <p className='text-text-sm text-text'>
        {t("governance.common.threshold")}{" "}
        {visibility
          ? `${((threshold || 0) * 100).toFixed(0)}%`
          : t("governance.common.notApplicable")}{" "}
        {t("governance.thresholds.allDReps")}
      </p>
    </div>
  );
};
