import { useFetchDrepList } from "@/services/drep";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import GraphWatermark from "../global/graphs/GraphWatermark";

import { useThemeStore } from "@/stores/themeStore";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import { useEffect, useRef, useState } from "react";

import type { DrepListOrder } from "@/types/drepTypes";
import { formatString } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import { useNavigate } from "@tanstack/react-router";
import { useGraphColors } from "@/hooks/useGraphColors";

interface DrepSizeGraphProps {
  type: DrepListOrder;
}

export const DrepSizeGraph: FC<DrepSizeGraphProps> = ({ type }) => {
  const [size, setSize] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { data } = useFetchDrepList(20, 0, "desc", type);
  const items = data?.pages[0].data.data;
  const chartRef = useRef(null);
  const { textColor, bgColor } = useGraphColors();

  const onChartReadyCallback = chart => {
    chartRef.current = chart;
  };

  useEffect(() => {
    setSize(width < 600);
  }, [width]);

  const colors: string[] = ["#FEF08A", "#BBF7D0"];

  const labelColors: string[] = ["#854D0E", "#166534"];

  const chartData = (items ?? []).map((item, index) => {
    const label = formatString(item.hash?.view, "long");
    const labelLength = (label ?? "").length;
    const baseSize =
      type === "power"
        ? Math.log(item.amount) * 5
        : type === "delegator"
          ? Math.log(item.distr?.count) * 5
          : type === "own"
            ? Math.log(item.owner?.balance) * 5
            : Math.log(item.amount / item.distr?.count) * 5;
    const adjustedSize = Math.max(baseSize, labelLength * 6);

    const color =
      theme === "light"
        ? colors[index % colors.length] + "80"
        : colors[index % colors.length];
    const labelColor = labelColors[index % labelColors.length];

    return {
      name: label,
      value:
        type === "power"
          ? item.amount
          : type === "delegator"
            ? item.distr.count
            : type === "own"
              ? item.owner.balance
              : item.amount / item.distr.count,
      symbolSize: size ? adjustedSize / 1.5 : adjustedSize,
      itemStyle: {
        color: color,
      },
      label: {
        color: labelColor,
      },
    };
  });

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: params => {
        return `${params.data.name} <br/> ${type !== "delegator" ? `Value: ${lovelaceToAda(params.data.value)}` : `Count: ${params.data.value}`}`;
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
          repulsion: size ? 100 : 300,
          gravity: 0.1,
        },
        emphasis: {
          disabled: true,
        },
      },
    ],
  };

  return (
    <div className='relative w-full'>
      <GraphWatermark />
      <ReactEcharts
        opts={{ height: 700 }}
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
        className='h-full min-h-[700px] w-full'
      />
    </div>
  );
};
