import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { useFetchPolicyStats } from "@/services/policy";
import type { FC } from "react";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { memo, useEffect, useState } from "react";
import { useGraphColors } from "@/hooks/useGraphColors";

import { formatNumber } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

interface PolicyStatGraphProps {
  query: ReturnType<typeof useFetchPolicyStats>;
  setJson?: any;
}

export const PolicyStatGraph: FC<PolicyStatGraphProps> = memo(
  function PolicyStatGraphMemo({ setJson, query }) {
    const [graphsVisibility, setGraphsVisibility] = useState({
      "Total count": true,
      "Total stake": true,
      "Total address": true,
      "Total with data": true,
      "Total ada volume": true,
      "Total asset volume": true,
      "Total payment credits": true,
      Assets: true,
    });

    const { textColor, bgColor } = useGraphColors();

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

          const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${epoch})<hr style="margin: 4px 0;" />`;

          const content = params
            .map(item => {
              const value = item.seriesName.includes("volume")
                ? lovelaceToAda(item.value)
                : formatNumber(item.value);

              return `${item.marker} ${item.seriesName}: ${value}`;
            })
            .join("<br/>");

          return `${header}${content}`;
        },
      },
      legend: {
        data: [
          "Total count",
          "Total stake",
          "Total address",
          "Total with data",
          "Total ada volume",
          "Total asset volume",
          "Total payment credits",
          "Assets",
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
          name: "Total count",
          type: "line",
          showSymbol: false,
          data: totalCount,
          yAxisIndex: 0,
          itemStyle: { color: colorPalette[5] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total stake",
          type: "line",
          showSymbol: false,
          data: totalStake,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[0] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total address",
          type: "line",
          showSymbol: false,
          data: totalAddress,
          yAxisIndex: 0,
          itemStyle: { color: colorPalette[1] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total with data",
          type: "line",
          showSymbol: false,
          data: totalWithData,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[2] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total ada volume",
          type: "line",
          showSymbol: false,
          data: totalAdaVolume,
          yAxisIndex: 1,
          itemStyle: { color: colorPalette[3] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total asset volume",
          type: "line",
          showSymbol: false,
          data: totalAssetVolume,
          yAxisIndex: 1,
          itemStyle: { color: colorPalette[4] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Total payment credits",
          type: "line",
          showSymbol: false,
          data: totalPaymentCredits,
          yAxisIndex: 2,
          itemStyle: { color: colorPalette[6] },
          lineStyle: { width: 3 },
          z: 3,
        },
        {
          name: "Assets",
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
          (epochs ?? []).map((epoch, index) => {
            return {
              Epoch: epoch,
              "Total count": totalCount[index],
              "Total stake": totalStake[index],
              "Total address": totalAddress[index],
              "Total with data": totalWithData[index],
              "Total ada volume": totalAdaVolume[index],
              "Total asset volume": totalAssetVolume[index],
              "Total payment credits": totalPaymentCredits[index],
              Assets: assets[index],
            };
          }),
        );
      }
    }, [setJson]);

    useEffect(() => {
      if (window && "localStorage" in window) {
        const graphStore = JSON.parse(
          localStorage.getItem("policy_stat_graph_store") as string,
        );

        if (graphStore) {
          setGraphsVisibility(graphStore);
        } else {
          localStorage.setItem(
            "policy_stat_graph_store",
            JSON.stringify(graphsVisibility),
          );
        }
      }
    }, []);

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
