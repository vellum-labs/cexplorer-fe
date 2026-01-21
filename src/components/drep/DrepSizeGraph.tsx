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
import {
  DREP_GRAPH_COLORS,
  DREP_GRAPH_LABEL_COLORS,
  formatHashLong,
} from "@/constants/drepGraphColors";

interface DrepSizeGraphProps {
  type: DrepListOrder;
}

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
      switch (type) {
        case "power":
          return item.amount || 0;
        case "delegator":
          return item.distr?.count || 0;
        case "own":
          return item.owner?.balance || 0;
        default:
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

      const baseColor = DREP_GRAPH_COLORS[index % DREP_GRAPH_COLORS.length];
      const labelColor = DREP_GRAPH_LABEL_COLORS[index % DREP_GRAPH_LABEL_COLORS.length];

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
          switch (type) {
            case "power":
              valueLabel = `${t("dreps.graphs.drepSize.votingPower")}: ${formatLovelace(params.data.value)}`;
              break;
            case "delegator":
              valueLabel = `${t("dreps.graphs.drepSize.delegators")}: ${params.data.value}`;
              break;
            case "own":
              valueLabel = `${t("dreps.graphs.drepSize.ownerStake")}: ${formatLovelace(params.data.value)}`;
              break;
            case "average_stake":
              valueLabel = `${t("dreps.graphs.drepSize.averageStake")}: ${formatLovelace(params.data.value)}`;
              break;
            default:
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
