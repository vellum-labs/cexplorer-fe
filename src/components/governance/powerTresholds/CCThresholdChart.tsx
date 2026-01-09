import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation();
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
          return t("governance.thresholds.ccNotVoting");
        }

        if (params.data.isVotingYes) {
          return `${params.data.name}<br/>${t("governance.card.voteYes")}<br/>${t("governance.common.neededForThreshold")}`;
        }

        if (params.data.isVotingNo) {
          return `${params.data.name}<br/>${t("governance.card.voteNo")}<br/>${t("governance.common.notNeededForThreshold")}`;
        }

        return `${params.data.name}<br/>${t("governance.thresholds.ccMembers")}: ${params.data.value}`;
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
      <div className='flex items-center gap-1'>
        <p className='mb-1 font-medium'>{t("governance.thresholds.ccTitle")}</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              {t("governance.thresholds.ccTooltip")}
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
          ? `${Math.round(
              ccData.quorum_denominator > 0
                ? (ccData.quorum_numerator / ccData.quorum_denominator) * 100
                : 0,
            )}%`
          : t("governance.common.notApplicable")}
      </p>
    </div>
  );
};
