import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { useFetchPolicyStats } from "@/services/policy";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { memo, useEffect, useState } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useADADisplay } from "@/hooks/useADADisplay";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface PolicyStatGraphProps {
  query: ReturnType<typeof useFetchPolicyStats>;
  setJson?: any;
}

export const PolicyStatGraph: FC<PolicyStatGraphProps> = memo(
  function PolicyStatGraphMemo({ setJson, query }) {
    const { t } = useAppTranslation("common");

    const legendLabels = {
      epoch: t("policy.graph.epoch"),
      totalCount: t("policy.graph.totalCount"),
      totalStake: t("policy.graph.totalStake"),
      totalAddress: t("policy.graph.totalAddress"),
      totalWithData: t("policy.graph.totalWithData"),
      totalAdaVolume: t("policy.graph.totalAdaVolume"),
      totalAssetVolume: t("policy.graph.totalAssetVolume"),
      totalPaymentCredits: t("policy.graph.totalPaymentCredits"),
      assets: t("policy.graph.assets"),
    };

    const [graphsVisibility] = useState(() => {
      try {
        const stored = localStorage.getItem("policy_stat_graph_store");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.log(e);
      }
      return {
        [legendLabels.totalCount]: true,
        [legendLabels.totalStake]: true,
        [legendLabels.totalAddress]: true,
        [legendLabels.totalWithData]: true,
        [legendLabels.totalAdaVolume]: true,
        [legendLabels.totalAssetVolume]: true,
        [legendLabels.totalPaymentCredits]: true,
        [legendLabels.assets]: true,
      };
    });

    const { textColor, bgColor } = useGraphColors();
    const { formatLovelace } = useADADisplay();

    const data = query?.data?.data?.data;

    const { data: miscBasic } = useFetchMiscBasic(true);
    const miscConst = useMiscConst(miscBasic?.data.version.const);

    const epochs = (data ?? []).map(item => item?.epoch);
    const totalCount = (data ?? []).map(item => item?.stat?.total_count);
    const totalStake = (data ?? []).map(item => item?.stat?.total_stake);
    const totalAddress = (data ?? []).map(item => item?.stat?.total_address);
    const totalWithData = (data ?? []).map(item => item?.stat?.total_with_data);
    const totalAdaVolume = (data ?? []).map(
      item => item?.stat?.total_ada_volume,
    );
    const totalAssetVolume = (data ?? []).map(
      item => item?.stat?.total_asset_volume,
    );
    const totalPaymentCredits = (data ?? []).map(
      item => item?.stat?.total_payment_cred,
    );
    const assets = (data ?? []).map(item => item?.stat?.assets ?? 0);

    const colorPalette = [
      "#FA0095",
      "#fa8775",
      "#79defd",
      "#ffb14e",
      "#00bbad",
      "#0094d4",
      "#cd34b5",
      "#6a4c93",
      "#b80058",
    ];

    const option: ReactEChartsProps["option"] = {
      grid: {
        left: "-5%",
        right: "-5%",
        top: "10%",
        bottom: "10%",
        containLabel: false,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        textStyle: {
          color: textColor,
        },
        backgroundColor: bgColor,
        axisPointer: { type: "shadow" },
        formatter: params => {
          const epoch = +params?.[0]?.name;

          const { startTime, endTime } = calculateEpochTimeByNumber(
            epoch,
            miscConst?.epoch.no ?? 0,
            miscConst?.epoch.start_time ?? "",
          );

          const header = `${t("policy.graph.date")}: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("policy.graph.epoch")}: ${epoch})<hr style="margin: 4px 0;" />`;

          const content = params
            .map(item => {
              const value = item.seriesName.includes("volume")
                ? formatLovelace(item.value)
                : formatNumber(item.value);

              return `${item.marker} ${item.seriesName}: ${value}`;
            })
            .join("<br/>");

          return `${header}${content}`;
        },
      },
      legend: {
        data: [
          legendLabels.totalCount,
          legendLabels.totalStake,
          legendLabels.totalAddress,
          legendLabels.totalWithData,
          legendLabels.totalAdaVolume,
          legendLabels.totalAssetVolume,
          legendLabels.totalPaymentCredits,
          legendLabels.assets,
        ],
        textStyle: {
          color: textColor,
        },
        type: "scroll",
        orient: "horizontal",
        selected: Object.keys(graphsVisibility).reduce((acc, key) => {
          acc[key] = graphsVisibility[key];
          return acc;
        }, {}),
      },
      xAxis: {
        type: "category",
        data: epochs,
        inverse: true,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: textColor } },
        },
        {
          type: "value",
          position: "right",
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: textColor } },
        },
        {
          type: "value",
          position: "right",
          offset: 60,
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: textColor } },
        },
      ],

      series: [
        {
          name: legendLabels.totalCount,
          type: "line",
          showSymbol: false,
          data: totalCount,
          yAxisIndex: 0,
          itemStyle: { color: colorPalette[5] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalStake,
          type: "line",
          showSymbol: false,
          data: totalStake,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[0] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalAddress,
          type: "line",
          showSymbol: false,
          data: totalAddress,
          yAxisIndex: 0,
          itemStyle: { color: colorPalette[1] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalWithData,
          type: "line",
          showSymbol: false,
          data: totalWithData,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[2] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalAdaVolume,
          type: "line",
          showSymbol: false,
          data: totalAdaVolume,
          yAxisIndex: 1,
          itemStyle: { color: colorPalette[3] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalAssetVolume,
          type: "line",
          showSymbol: false,
          data: totalAssetVolume,
          yAxisIndex: 1,
          itemStyle: { color: colorPalette[4] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.totalPaymentCredits,
          type: "line",
          showSymbol: false,
          data: totalPaymentCredits,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[6] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: legendLabels.assets,
          type: "line",
          showSymbol: false,
          data: assets,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[7] },
          lineStyle: { width: 3 },
          z: 3,
        },
      ],
    };

    useEffect(() => {
      if (setJson) {
        setJson(
          (query?.data?.data?.data ?? []).map(item => ({
            [legendLabels.epoch]: item?.epoch,
            [legendLabels.totalCount]: item?.stat?.total_count,
            [legendLabels.totalStake]: item?.stat?.total_stake,
            [legendLabels.totalAddress]: item?.stat?.total_address,
            [legendLabels.totalWithData]: item?.stat?.total_with_data,
            [legendLabels.totalAdaVolume]: item?.stat?.total_ada_volume,
            [legendLabels.totalAssetVolume]: item?.stat?.total_asset_volume,
            [legendLabels.totalPaymentCredits]: item?.stat?.total_payment_cred,
            [legendLabels.assets]: item?.stat?.assets ?? 0,
          })),
        );
      }
    }, [query.data, setJson]);

    return (
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;

              localStorage.setItem(
                "policy_stat_graph_store",
                JSON.stringify(selected),
              );
            },
          }}
          option={option}
          notMerge={false}
          lazyUpdate={false}
          className='h-full w-full'
        />
      </div>
    );
  },
);
