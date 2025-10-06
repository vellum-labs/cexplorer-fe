import type { FC } from "react";
import { useRef, useState } from "react";
import ReactEcharts from "echarts-for-react";

import { useFetchDrepNotSpoSameTime } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@/utils/format/format";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { Switch } from "@/components/global/Switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

export const DrepNotSpoGraph: FC = () => {
  const [showFiltered, setShowFiltered] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("drep_not_spo_show_filtered");
      return saved === null ? true : saved === "true";
    }
    return true;
  });

  const handleSwitchChange = (checked: boolean) => {
    setShowFiltered(checked);
    localStorage.setItem("drep_not_spo_show_filtered", String(checked));
  };

  const query = useFetchDrepNotSpoSameTime();
  const data = query.data?.data ?? [];

  const miscConst = useMiscConst(
    useFetchMiscBasic(true).data?.data.version.const,
  );

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const epochs = data.map(d => d.epoch_no);
  const count = data.map(d => (showFiltered ? d.total.count : d.count));
  const stake = data.map(d => (showFiltered ? d.total.stake : d.stake));
  const delegators = data.map(d => d.delegator);

  const groupRef = useRef<HTMLDivElement>(null);

  const option = {
    legend: {
      type: "scroll",
      data: ["DRep Count", "Stake (₳)", "Delegators"],
      textStyle: { color: textColor },
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: { color: textColor },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: function (params) {
        const { startTime, endTime } = calculateEpochTimeByNumber(
          +params[0]?.axisValue,
          miscConst?.epoch.no ?? 0,
          miscConst?.epoch.start_time ?? "",
        );

        return (
          `Date: ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (Epoch: ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const seriesName =
                item.seriesName === "Stake (₳)" ? "Stake" : item.seriesName;

              const value =
                item.seriesName === "Stake (₳)"
                  ? lovelaceToAda(item.data)
                  : formatNumber(item.data);

              return `<p>${item.marker} ${seriesName}: ${value}</p>`;
            })
            .join("")
        );
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
      name: "Epoch",
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
    ],
    series: [
      {
        type: "line",
        name: "DRep Count",
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
        itemStyle: { color: "#35c2f5" },
      },
      {
        type: "line",
        name: "Stake (₳)",
        data: stake,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#f39c12" },
        itemStyle: { color: "#f39c12" },
      },
      {
        type: "line",
        name: "Delegators",
        data: delegators,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#2ecc71" },
        itemStyle: { color: "#2ecc71" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title='DReps that are not SPOs'
      description='Epoch-level view of stake, DRep count, and delegator count delegated to DReps who are not SPOs'
      className='border-none'
      actions={
        <div
          ref={groupRef}
          className='flex items-center gap-2 rounded-md border border-border px-1.5 py-1'
        >
          <Switch active={showFiltered} onChange={handleSwitchChange} />
          <label
            htmlFor='filter-toggle'
            className='text-muted-foreground text-sm'
          >
            Show Filtered
          </label>
          <Tooltip
            content="Excludes 'Abstain' and 'No Confidence' DReps from Count and Stake."
            widthRef={groupRef}
          >
            <Info
              size={18}
              strokeWidth={2}
              className='text-muted-foreground cursor-help'
            />
          </Tooltip>
        </div>
      }
    >
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          key={showFiltered ? "filtered" : "total"}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
