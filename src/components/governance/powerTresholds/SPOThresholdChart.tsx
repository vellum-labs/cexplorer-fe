import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface SPOThresholdChartProps {
  chartProps: {
    epochParam: any;
    visibility: boolean;
    params: null | string;
    isSecuryTitle: boolean;
    poolList: any;
    totalSpoStake?: number;
  };
}

export const SPOThresholdChart: FC<SPOThresholdChartProps> = ({
  chartProps,
}) => {
  const { t } = useAppTranslation();
  const {
    epochParam,
    visibility,
    params,
    isSecuryTitle,
    poolList,
    totalSpoStake,
  } = chartProps;

  const { formatLovelace } = useADADisplay();
  const { textColor, bgColor } = useGraphColors();

  const threshold = params ? epochParam[params] : 0;

  const pools = poolList?.data ?? [];
  const totalStake =
    totalSpoStake ??
    pools.reduce(
      (sum: any, pool: any) => sum + Number(pool.live_stake ?? 0),
      0,
    );
  const requiredStake =
    visibility && totalStake > 0 ? totalStake * threshold : 0;

  const sortedPools = [...pools].sort(
    (a, b) => Number(b.live_stake ?? 0) - Number(a.live_stake ?? 0),
  );

  let accumulated = 0;
  let count = 0;
  const requiredPools: typeof pools = [];

  for (const pool of sortedPools) {
    if (accumulated >= requiredStake) break;
    accumulated += Number(pool.live_stake ?? 0);
    count++;
    requiredPools.push(pool);
  }

  const getRequiredColor = () => {
    if (!visibility) return "#E4E7EC";
    return isSecuryTitle ? "#F79009" : "#f43f5e";
  };

  const getOtherColor = () => {
    if (!visibility) return "#E4E7EC";
    return isSecuryTitle ? "#FEC84B" : "#22c55e";
  };

  const chartData = visibility
    ? [
        ...requiredPools.map((pool, index) => ({
          value: Number(pool.live_stake ?? 0),
          name:
            pool.pool_name?.ticker ||
            pool.pool_name?.name ||
            (typeof pool.pool_id === "string"
              ? pool.pool_id.slice(0, 8) + "..."
              : null) ||
            `Pool ${index + 1}`,
          itemStyle: {
            color: getRequiredColor(),
            borderColor: "#ffffff",
            borderWidth: 0.1,
          },
          poolData: pool,
          isRequired: true,
        })),
        {
          value: totalStake - accumulated,
          name: t("governance.thresholds.otherSPOs"),
          itemStyle: {
            color: getOtherColor(),
            borderColor: "#ffffff",
            borderWidth: 0.1,
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
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: (params: any) => {
        if (!visibility) {
          return t("governance.thresholds.spoNotVoting");
        }

        if (params.data.isOther) {
          const stakeFormatted = formatLovelace(params.data.value);
          return `${t("governance.thresholds.otherSPOs")}<br/>${t("governance.common.stake")} ${stakeFormatted}<br/>${t("governance.common.notNeededForThreshold")}`;
        }

        if (params.data.poolData) {
          const pool = params.data.poolData;
          const stakeFormatted = formatLovelace(Number(pool.live_stake ?? 0));
          const imageUrl = generateImageUrl(pool.pool_id ?? "", "sm", "pool");

          return `
            <div>
              <div style="display: flex; align-items: center; gap: 6px; font-weight: 600; margin-bottom: 4px;">
                <img src="${imageUrl}" alt="Pool" style="width: 16px; height: 16px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'"/>
                ${params.data.name}
              </div>
              <div>${t("governance.thresholds.liveStake")} ${stakeFormatted}</div>
              <div>${t("governance.common.delegators")} ${pool.delegators ?? "N/A"}</div>
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
        <p className='mb-1 font-medium'>{t("governance.thresholds.spoTitle")}</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              {params === "pvtpp_security_group"
                ? t("governance.thresholds.spoTooltipSecurity")
                : t("governance.thresholds.spoTooltip")}
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
          : t("governance.common.notApplicable")}
      </p>
    </div>
  );
};
