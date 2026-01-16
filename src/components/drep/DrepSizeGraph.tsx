import { useFetchDrepList } from "@/services/drep";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "../global/graphs/GraphWatermark";

import { useWindowDimensions } from "@vellumlabs/cexplorer-sdk";
import { useEffect, useRef, useState, useMemo } from "react";

import type { DrepListOrder } from "@/types/drepTypes";
import { useNavigate } from "@tanstack/react-router";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const formatHashLong = (hash: string | null): string => {
  if (!hash) return "";
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
};

interface DrepSizeGraphProps {
  type: DrepListOrder;
}

const colors: string[] = [
  "#FEF08A",
  "#86EFAC",
  "#DBEAFE",
  "#F3E8FF",
  "#FED7D7",
  "#FFF2CC",
  "#E0F2FE",
  "#A7F3D0",
  "#F1C0E8",
  "#C7D2FE",
  "#FDE68A",
  "#D1FAE5",
  "#FEE2E2",
  "#E0E7FF",
  "#FECACA",
  "#BAE6FD",
];

const labelColors: string[] = [
  "#854D0E",
  "#166534",
  "#1E40AF",
  "#7C3AED",
  "#DC2626",
  "#EA580C",
  "#0891B2",
  "#059669",
  "#BE185D",
  "#4338CA",
  "#D97706",
  "#047857",
  "#BE123C",
  "#5B21B6",
  "#B91C1C",
  "#0369A1",
];

export const DrepSizeGraph: FC<DrepSizeGraphProps> = ({ type }) => {
  const { t } = useAppTranslation("pages");

  const [size, setSize] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const { data } = useFetchDrepList(40, 0, "desc", type);

  const items = data?.pages[0].data.data;

  const chartRef = useRef(null);
  const { textColor, bgColor } = useGraphColors();
  const { formatLovelace } = useADADisplay();

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  useEffect(() => {
    setSize(width < 600);
  }, [width]);

  const chartData = useMemo(() => {
    const values = (items ?? []).map(item => {
      if (type === "power") {
        return item.amount || 0;
      } else if (type === "delegator") {
        return item.distr?.count || 0;
      } else if (type === "own") {
        return item.owner?.balance || 0;
      } else {
        return item.amount && item.distr?.count
          ? item.amount / item.distr.count
          : 0;
      }
    });

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values.filter(v => v > 0));

    const minBubbleSize = 50;
    const maxBubbleSize = 240;

    const data = (items ?? []).map((item, index) => {
      const drepName = item.data?.given_name;
      const fullName = drepName || formatHashLong(item.hash?.view || null);
      const label =
        fullName && fullName.length > 12
          ? fullName.substring(0, 12) + "..."
          : fullName;
      const value = values[index];

      let adjustedSize = minBubbleSize;
      if (value > 0 && maxValue > minValue) {
        const ratio = (value - minValue) / (maxValue - minValue);
        adjustedSize = minBubbleSize + ratio * (maxBubbleSize - minBubbleSize);
      }

      const baseColor = colors[index % colors.length];
      const labelColor = labelColors[index % labelColors.length];

      return {
        id: index,
        name: label,
        value: value,
        symbolSize: size ? adjustedSize * 0.7 : adjustedSize,
        itemStyle: {
          color: baseColor + "E6",
          borderColor: baseColor + "FF",
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: baseColor + "30",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        label: {
          color: labelColor,
          fontWeight: "bold",
        },
      };
    });

    return data;
  }, [items, type, size]);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
        formatter: params => {
          const itemIndex = params.dataIndex;
          const item = items?.[itemIndex];
          const drepName = item?.data?.given_name;
          const fullDisplayName =
            drepName || formatHashLong(item?.hash?.view || null);

          let valueLabel = "";
          if (type === "power") {
            valueLabel = `${t("dreps.graphs.drepSize.votingPower")}: ${formatLovelace(params.data.value)}`;
          } else if (type === "delegator") {
            valueLabel = `${t("dreps.graphs.drepSize.delegators")}: ${params.data.value}`;
          } else if (type === "own") {
            valueLabel = `${t("dreps.graphs.drepSize.ownerStake")}: ${formatLovelace(params.data.value)}`;
          } else if (type === "average_stake") {
            valueLabel = `${t("dreps.graphs.drepSize.averageStake")}: ${formatLovelace(params.data.value)}`;
          } else {
            valueLabel = `${t("dreps.graphs.drepSize.value")}: ${formatLovelace(params.data.value)}`;
          }

          return `<b>${fullDisplayName}</b> <br/> ${valueLabel}`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: chartData,
          label: {
            show: true,
            formatter: "{b}",
            position: "inside",
            fontSize: size ? 6 : 10,
            fontWeight: "bold",
          },
          force: {
            repulsion: size ? 150 : 400,
            gravity: 0.2,
            layoutAnimation: true,
          },
          roam: true,
          emphasis: {
            disabled: true,
          },
        },
      ],
    };
  }, [chartData, bgColor, textColor, size, items, type, t, formatLovelace]);

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: size ? 600 : 900 }}
        onChartReady={onChartReadyCallback}
        onEvents={{
          click: params => {
            const hash =
              params.dataIndex && items
                ? items[params.dataIndex]?.hash.view
                : "";
            navigate({
              to: `/drep/${hash}`,
            });
          },
        }}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className={`h-full w-full ${size ? "min-h-[600px]" : "min-h-[900px]"}`}
      />
    </div>
  );
};
