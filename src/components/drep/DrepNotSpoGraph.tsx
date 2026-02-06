import type { FC } from "react";
import { useRef, useState } from "react";
import ReactEcharts from "echarts-for-react";

import { useFetchDrepNotSpoSameTime } from "@/services/drep";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { calculateEpochTimeByNumber } from "@/utils/calculateEpochTimeByNumber";
import { format } from "date-fns";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import { AnalyticsGraph } from "../analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { Switch } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Info } from "lucide-react";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const DrepNotSpoGraph: FC = () => {
  const { t } = useAppTranslation("pages");

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
  const { formatLovelace } = useADADisplay();

  const epochs = data.map(d => d.epoch_no);
  const count = data.map(d => (showFiltered ? d.total.count : d.count));
  const stake = data.map(d => (showFiltered ? d.total.stake : d.stake));
  const delegators = data.map(d => d.delegator);

  const KEYS = {
    drepCount: "drepCount",
    stake: "stake",
    delegators: "delegators",
  };

  const legendLabels = {
    [KEYS.drepCount]: t("dreps.graphs.drepsNotSpo.drepCount"),
    [KEYS.stake]: t("dreps.graphs.drepsNotSpo.stake"),
    [KEYS.delegators]: t("dreps.graphs.drepsNotSpo.delegators"),
  };

  const tooltipLabels = {
    [KEYS.drepCount]: t("dreps.graphs.drepsNotSpo.drepCount"),
    [KEYS.stake]: t("dreps.graphs.drepsNotSpo.stakeShort"),
    [KEYS.delegators]: t("dreps.graphs.drepsNotSpo.delegators"),
  };

  const groupRef = useRef<HTMLDivElement>(null);

  const option = {
    legend: {
      type: "scroll",
      data: [KEYS.drepCount, KEYS.stake, KEYS.delegators],
      formatter: (name: string) => legendLabels[name] || name,
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
          `${t("dreps.graphs.date")} ${format(startTime, "dd.MM.yy")} - ${format(endTime, "dd.MM.yy")} (${t("dreps.graphs.epoch")} ${params[0]?.axisValue})<hr>` +
          params
            .map(item => {
              const value =
                item.seriesName === KEYS.stake
                  ? formatLovelace(item.data)
                  : formatNumber(item.data);

              return `<p>${item.marker} ${tooltipLabels[item.seriesName]}: ${value}</p>`;
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
      name: t("common:labels.epoch"),
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
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: "value",
        position: "right",
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      {
        type: "value",
        position: "right",
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: "line",
        name: KEYS.drepCount,
        data: count,
        yAxisIndex: 0,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#35c2f5" },
        itemStyle: { color: "#35c2f5" },
      },
      {
        type: "line",
        name: KEYS.stake,
        data: stake,
        yAxisIndex: 1,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#f39c12" },
        itemStyle: { color: "#f39c12" },
      },
      {
        type: "line",
        name: KEYS.delegators,
        data: delegators,
        yAxisIndex: 2,
        symbol: "none",
        showSymbol: false,
        lineStyle: { color: "#2ecc71" },
        itemStyle: { color: "#2ecc71" },
      },
    ],
  };

  return (
    <AnalyticsGraph
      title={t("dreps.graphs.drepsNotSpo.title")}
      description={t("dreps.graphs.drepsNotSpo.description")}
      className='border-none'
      actions={
        <div
          ref={groupRef}
          className='flex items-center gap-1 rounded-s border border-border px-1.5 py-1'
        >
          <Switch active={showFiltered} onChange={handleSwitchChange} />
          <label
            htmlFor='filter-toggle'
            className='text-muted-foreground text-text-sm'
          >
            {t("dreps.graphs.drepsNotSpo.showFiltered")}
          </label>
          <Tooltip
            content={t("dreps.graphs.drepsNotSpo.filterTooltip")}
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
