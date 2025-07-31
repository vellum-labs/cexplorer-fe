import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { formatNumberWithSuffix } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import ReactEcharts from "echarts-for-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";

interface Props {
  epochs: number[];
  leaderLovelace: number[];
  membetPct: number[];
  memberLovelace: number[];
  operatorPct: number[];
}

const PoolRewardsGraph = memo(function PoolRewardsGraphMemo({
  epochs,
  leaderLovelace,
  memberLovelace,
  membetPct,
  operatorPct,
}: Props) {
  const {
    textColor,
    bgColor,
    splitLineColor,
    lineColor,
    inactivePageIconColor,
  } = useGraphColors();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [graphsVisibility, setGraphsVisibility] = useState({
    "Delegators ROA (%)": true,
    "Operators ROA (%)": true,
    "Delegators Rewards (₳)": true,
    "Operator rewards (₳)": true,
  });

  const chartRef = useRef(null);

  const option = useMemo(
    () => ({
      legend: {
        pageIconColor: textColor,
        pageIconInactiveColor: inactivePageIconColor,
        pageTextStyle: { color: textColor },
        type: "scroll",
        data: Object.keys(graphsVisibility),
        textStyle: { color: textColor },
        selected: graphsVisibility,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: bgColor,
        confine: true,
        textStyle: { color: textColor },
        formatter: (params: any) => {
          const epoch = +params?.[0]?.name;

          if (!miscConst?.epoch?.start_time || !miscConst?.epoch?.no) {
            return params
              .map(item => {
                const isAda = item.seriesName.includes("₳");
                const cleanName = item.seriesName
                  .replace("(₳)", "")
                  .replace("(%)", "")
                  .trim();
                const value = isAda
                  ? lovelaceToAda(item.value * 1e6)
                  : Number(item.value).toFixed(2);
                return `${item.marker} ${cleanName}: ${value}`;
              })
              .join("<br/>");
          }

          const { startTime, endTime } = calculateEpochTimeByNumber(
            epoch,
            miscConst.epoch.no,
            miscConst.epoch.start_time,
          );

          const header = `Date: ${format(startTime, "dd.MM.yy")} - ${format(
            endTime,
            "dd.MM.yy",
          )} (Epoch: ${epoch})<hr style="margin: 4px 0;" />`;

          const lines = params.map(item => {
            const isAda = item.seriesName.includes("₳");
            const cleanName = item.seriesName
              .replace("(₳)", "")
              .replace("(%)", "")
              .trim();
            const value = isAda
              ? lovelaceToAda(item.value * 1e6)
              : `${Number(item.value).toFixed(2)}%`;
            return `${item.marker} ${cleanName}: ${value}`;
          });

          return header + lines.join("<br/>");
        },
      },
      grid: {
        top: 40,
        right: 50,
        bottom: 40,
        left: 60,
      },
      xAxis: {
        type: "category",
        data: epochs,
        inverse: true,
        name: "Epoch",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: textColor } },
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          name: "Rewards (₳)",
          nameRotate: 90,
          nameLocation: "middle",
          nameGap: 45,
          id: "0",
          axisLabel: {
            color: textColor,
            formatter: val => formatNumberWithSuffix(val, true),
          },
          splitLine: { lineStyle: { color: splitLineColor } },
          axisLine: { lineStyle: { color: textColor } },
        },
        {
          type: "value",
          position: "right",
          nameGap: 35,
          id: "1",
          axisLabel: {
            color: textColor,
            formatter: val => formatNumberWithSuffix(val, true),
          },
          splitLine: { lineStyle: { color: splitLineColor } },
          axisLine: { lineStyle: { color: splitLineColor } },
        },
        {
          type: "value",
          position: "right",
          id: "2",
          axisLabel: {
            show: false,
            color: textColor,
          },
          splitLine: { lineStyle: { color: splitLineColor } },
          axisLine: { lineStyle: { color: splitLineColor } },
        },
      ],
      series: [
        {
          data: membetPct,
          type: "line",
          name: "Delegators ROA (%)",
          yAxisIndex: 1,
          showSymbol: false,
          itemStyle: { color: "#e3033a" },
        },
        {
          data: operatorPct,
          type: "line",
          name: "Operators ROA (%)",
          yAxisIndex: 1,
          showSymbol: false,
          itemStyle: { color: "#21fc1e" },
        },
        {
          data: memberLovelace,
          type: "line",
          name: "Delegators Rewards (₳)",
          yAxisIndex: 0,
          showSymbol: false,
          lineStyle: { color: lineColor },
          areaStyle: { opacity: 0.2, color: lineColor },
          itemStyle: { color: lineColor },
        },
        {
          data: leaderLovelace,
          type: "line",
          name: "Operator rewards (₳)",
          yAxisIndex: 2,
          showSymbol: false,
          lineStyle: { color: "#ffc115" },
          itemStyle: { color: "#ffc115" },
        },
      ],
    }),
    [
      textColor,
      bgColor,
      splitLineColor,
      inactivePageIconColor,
      lineColor,
      graphsVisibility,
      epochs,
      membetPct,
      operatorPct,
      memberLovelace,
      leaderLovelace,
      miscConst,
    ],
  );

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem("pool_rewards_graph_store") as string,
      );
      if (graphStore) setGraphsVisibility(graphStore);
      else
        localStorage.setItem(
          "pool_rewards_graph_store",
          JSON.stringify(graphsVisibility),
        );
    }
  }, []);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        onEvents={{
          legendselectchanged: params => {
            localStorage.setItem(
              "pool_rewards_graph_store",
              JSON.stringify(params.selected),
            );
          },
        }}
        opts={{ height: 280 }}
        onChartReady={chart => (chartRef.current = chart)}
        option={option}
        notMerge
        className='h-full min-h-[200px] w-full'
      />
    </div>
  );
});

export default PoolRewardsGraph;
