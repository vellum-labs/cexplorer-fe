import type { GovernanceActionList } from "@/types/governanceTypes";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useGraphColors } from "@/hooks/useGraphColors";
import { getEpochByTime } from "@/utils/getEpochByTime";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import {
  type GovStatus,
  govStatusColors,
  govStatusBgColors,
  govTypeLabels,
} from "@/constants/governance";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceTimelineGraphProps {
  items: GovernanceActionList[];
  currentEpoch: number;
  epochStartTime: string;
}

const getStatus = (
  item: GovernanceActionList,
  currentEpoch: number,
): GovStatus => {
  if (item.enacted_epoch) return "ENACTED";
  if (item.ratified_epoch) return "RATIFIED";
  if (item.dropped_epoch) return "DROPPED";
  if (item.expired_epoch) return "EXPIRED";
  if (item.expiration >= currentEpoch) return "ACTIVE";
  return "EXPIRED";
};

export const GovernanceTimelineGraph: FC<GovernanceTimelineGraphProps> = ({
  items,
  currentEpoch,
  epochStartTime,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { textColor, bgColor, splitLineColor, lineColor } = useGraphColors();

  const epochStartTimestamp = new Date(epochStartTime).getTime() / 1000;

  const getStatusLabel = (status: GovStatus): string => {
    const statusLabels: Record<GovStatus, string> = {
      ACTIVE: t("governance.actions.statusActive"),
      ENACTED: t("governance.actions.statusEnacted"),
      RATIFIED: t("governance.actions.statusRatified"),
      DROPPED: t("governance.actions.statusDropped"),
      EXPIRED: t("governance.actions.statusExpired"),
    };
    return statusLabels[status];
  };

  const chartData = useMemo(() => {
    if (!items.length)
      return { data: [], categories: [], minEpoch: 0, maxEpoch: 0 };

    const processedItems = items.map((item, index) => {
      const startEpoch = getEpochByTime(
        new Date(item.tx.time).getTime(),
        epochStartTimestamp,
        currentEpoch,
      );
      const endEpoch = item.expiration;
      const status = getStatus(item, currentEpoch);
      const typeLabel = govTypeLabels[item.type] || item.type;
      const name = item.anchor?.offchain?.name || typeLabel;

      return {
        index,
        name,
        typeLabel,
        startEpoch,
        endEpoch,
        status,
        ident: item.ident,
      };
    });

    const allEpochs = processedItems.flatMap(item => [
      item.startEpoch,
      item.endEpoch,
    ]);
    const minEpoch = Math.min(...allEpochs) - 2;
    const maxEpoch = Math.max(...allEpochs, currentEpoch) + 5;

    const categories = processedItems.map(
      (item, idx) =>
        `${idx + 1}. ${item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name}`,
    );

    const offsetData = processedItems.map(item => ({
      value: item.startEpoch - minEpoch,
      itemStyle: { color: "transparent" },
    }));

    const durationData = processedItems.map(item => {
      const isLongLabel = item.typeLabel.length > 15;
      const nameFontSize = isLongLabel ? 10 : 11;
      const statusFontSize = isLongLabel ? 9 : 9;
      const statusPadding = isLongLabel ? [1, 3, 1, 3] : [2, 5, 2, 5];
      const namePadding = isLongLabel ? [0, 4, 0, 4] : [0, 6, 0, 6];
      const statusLabel = getStatusLabel(item.status);

      return {
        value: item.endEpoch - item.startEpoch,
        itemStyle: {
          color: govStatusBgColors[item.status],
          borderColor: govStatusColors[item.status],
          borderWidth: 1,
          borderRadius: [4, 4, 4, 4],
        },
        label: {
          show: true,
          position: "insideLeft" as const,
          formatter: `{status|${statusLabel}} {name|${item.typeLabel}}`,
          rich: {
            status: {
              backgroundColor: govStatusColors[item.status],
              color: "#fff",
              padding: statusPadding,
              borderRadius: 3,
              fontSize: statusFontSize,
              fontWeight: "bold" as const,
            },
            name: {
              color: "#374151",
              fontSize: nameFontSize,
              fontWeight: "bold" as const,
              padding: namePadding,
            },
          },
        },
        ident: item.ident,
      };
    });

    return {
      offsetData,
      durationData,
      categories,
      minEpoch,
      maxEpoch,
      processedItems,
    };
  }, [items, currentEpoch, epochStartTimestamp]);

  const option = useMemo(() => {
    if (!chartData.categories?.length) {
      return {};
    }

    const epochRange: number[] = [];
    for (let i = chartData.minEpoch; i <= chartData.maxEpoch; i++) {
      epochRange.push(i);
    }

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: bgColor,
        borderWidth: 0,
        padding: 0,
        textStyle: { color: textColor },
        formatter: (params: any) => {
          const durationItem = params.find(
            (p: any) => p.seriesName === "Duration",
          );
          if (!durationItem) return "";

          const itemData = chartData.processedItems?.[durationItem.dataIndex];
          if (!itemData) return "";

          const borderColor = govStatusColors[itemData.status as GovStatus];

          return `
            <div style="padding: 8px; border: 1px solid ${borderColor}; border-radius: 4px; background: ${bgColor};">
              <div style="font-weight: bold; margin-bottom: 4px;">${itemData.name}</div>
              <div>${t("governance.timeline.type")} ${itemData.typeLabel}</div>
              <div>${t("governance.timeline.status")} ${getStatusLabel(itemData.status as GovStatus)}</div>
              <div>${t("governance.timeline.votingPeriod", { start: itemData.startEpoch, end: itemData.endEpoch })}</div>
            </div>
          `;
        },
      },
      grid: {
        top: 30,
        left: 20,
        right: 40,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: chartData.maxEpoch - chartData.minEpoch,
        axisLabel: {
          color: textColor,
          formatter: (value: number) => chartData.minEpoch + value,
        },
        axisLine: { lineStyle: { color: splitLineColor } },
        splitLine: { lineStyle: { color: splitLineColor } },
        name: "Epoch",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { color: textColor },
      },
      yAxis: {
        type: "category",
        data: chartData.categories,
        inverse: true,
        axisLabel: {
          color: textColor,
          width: 200,
          overflow: "truncate",
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: splitLineColor } },
        axisTick: { show: false },
      },
      series: [
        {
          name: "CurrentEpochLine",
          type: "line",
          data: [],
          zlevel: 0,
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: {
              color: lineColor,
              width: 2,
              type: "solid",
            },
            data: [
              {
                xAxis: currentEpoch - chartData.minEpoch,
                label: {
                  show: true,
                  formatter: t("governance.timeline.currentEpoch", {
                    epoch: currentEpoch,
                  }),
                  position: "start",
                  color: lineColor,
                  fontSize: 11,
                  fontWeight: "bold",
                },
              },
            ],
          },
        },
        {
          name: "Offset",
          type: "bar",
          stack: "timeline",
          data: chartData.offsetData,
          barWidth: 24,
          silent: true,
          zlevel: 1,
        },
        {
          name: "Duration",
          type: "bar",
          stack: "timeline",
          data: chartData.durationData,
          barWidth: 24,
          zlevel: 1,
          emphasis: {
            itemStyle: {
              shadowBlur: 4,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      ],
    };
  }, [chartData, currentEpoch, textColor, bgColor, splitLineColor, lineColor]);

  const handleClick = (params: any) => {
    if (params.seriesName === "Duration" && params.data?.ident?.id) {
      navigate({
        to: "/gov/action/$id",
        params: { id: encodeURIComponent(params.data.ident.id) },
      });
    }
  };

  if (!items.length) {
    return (
      <div className='flex h-[400px] items-center justify-center rounded-m border border-border'>
        <p className='text-grayTextPrimary'>
          {t("governance.actions.noActionsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className='relative w-full rounded-m border border-border p-3'>
      <h2 className='mb-2'>{t("governance.timeline.title")}</h2>
      <div className='thin-scrollbar overflow-x-auto xl:overflow-visible'>
        <div className='relative min-w-[1400px] xl:min-w-0'>
          <GraphWatermark />
          <ReactEcharts
            option={option}
            style={{ height: Math.max(400, items.length * 40 + 100) }}
            onEvents={{ click: handleClick }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
      <div className='mt-2 flex flex-wrap items-center justify-center gap-3'>
        {(
          ["ACTIVE", "ENACTED", "RATIFIED", "DROPPED", "EXPIRED"] as GovStatus[]
        ).map(status => (
          <div key={status} className='flex items-center gap-1'>
            <div
              className='rounded-sm h-3 w-3 border'
              style={{
                backgroundColor: govStatusBgColors[status],
                borderColor: govStatusColors[status],
              }}
            />
            <span className='text-text-sm text-grayTextPrimary'>
              {getStatusLabel(status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
