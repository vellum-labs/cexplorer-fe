import type { FC } from "react";
import ReactEcharts from "echarts-for-react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolMilestoneAnalytics } from "@/services/analytics";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";

export const PoolDelegationGraph: FC = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchPoolMilestoneAnalytics();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(item => item.epoch_no);
  const adaDelegated = data.map(item => item.stat?.pool_distr?.sum ?? 0);
  const circulatingPercent = data.map(item => {
    const sum = item.stat?.pool_distr?.sum ?? 0;
    const circulating = item.stat?.circulating_supply ?? 1;
    return (sum / circulating) * 100;
  });
  const delegatedWallets = data.map(
    item => item.stat?.pool_distr?.count_addr_uniq ?? 0,
  );

  const adaDelegatedLabel = t("pools.analytics.legend.adaDelegated");
  const circulatingPercentLabel = t("pools.analytics.legend.circulatingPercent");
  const delegatedWalletsLabel = t("pools.analytics.legend.delegatedWallets");
  const dateLabel = t("pools.analytics.tooltip.date");
  const epochLabel = t("pools.analytics.tooltip.epoch");

  const option = {
    legend: {
      type: "scroll",
      data: [adaDelegatedLabel, circulatingPercentLabel, delegatedWalletsLabel],
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      confine: true,
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        const header = `${dateLabel}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${epochLabel}: ${params[0]?.axisValue})<hr style="margin: 4px 0;" />`;

        const lines = params.map(item => {
          const isAda = item.seriesName.includes("ADA");
          const isPercent = item.seriesName.includes("%");
          let value: string;
          if (isAda) {
            value = formatLovelace(item.data);
          } else if (isPercent) {
            value = `${item.data.toFixed(2)}%`;
          } else {
            value = formatNumber(item.data);
          }
          return `<p>${item.marker} ${item.seriesName}: ${value}</p>`;
        });

        return header + lines.join("");
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 18,
    },
    xAxis: {
      type: "category",
      data: epochs,
      name: epochLabel,
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      inverse: true,
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: textColor } },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        position: "right",
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { show: false },
      },
      {
        type: "value",
        position: "right",
        offset: 30,
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: false,
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: "bar",
        name: adaDelegatedLabel,
        data: adaDelegated,
        yAxisIndex: 0,
        color: "#f39c12",
      },
      {
        type: "line",
        name: circulatingPercentLabel,
        data: circulatingPercent,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        color: "#35c2f5",
      },
      {
        type: "line",
        name: delegatedWalletsLabel,
        data: delegatedWallets,
        yAxisIndex: 2,
        symbol: "none",
        showSymbol: false,
        color: "#2ecc71",
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("pools.analytics.delegation.title")}
      description={t("pools.analytics.delegation.description")}
      className='border-none'
    >
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
