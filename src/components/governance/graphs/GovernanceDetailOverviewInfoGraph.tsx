import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useADADisplay } from "@/hooks/useADADisplay";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GovernanceDetailOverviewInfoGraphProps {
  data: any;
  threshold?: number;
}

export const GovernanceDetailOverviewInfoGraph: FC<
  GovernanceDetailOverviewInfoGraphProps
> = ({ data, threshold }) => {
  const { t } = useAppTranslation();
  const hasNonZeroValue = data.some((item: any) => item.value > 0);

  const filteredData = hasNonZeroValue
    ? data.filter((item: any) => item.value > 0)
    : data;

  const { theme } = useThemeStore();
  const { textColor, bgColor } = useGraphColors();
  const { formatLovelace } = useADADisplay();

  const isLightTheme = theme === "light";

  const labelStyle = {
    show: true,
    position: "inside",
    formatter: "{d}%",
    color: textColor,
    fontSize: 10,
    fontWeight: "bold",
    ...(isLightTheme && {
      textShadowColor: "#FFFFFF",
      textShadowBlur: 2,
      textShadowOffsetX: 0,
      textShadowOffsetY: 0,
    }),
  };

  const chartSize = 145;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const outerRadius = chartSize / 2;

  const thresholdAngle = threshold ? 90 - threshold * 360 : 0;
  const thresholdRad = (thresholdAngle * Math.PI) / 180;

  const lineOuterX = centerX + Math.cos(thresholdRad) * (outerRadius + 5);
  const lineOuterY = centerY - Math.sin(thresholdRad) * (outerRadius + 5);

  const showThreshold = threshold && threshold < 1;

  const graphicElements = showThreshold
    ? [
        {
          type: "line",
          shape: {
            x1: centerX,
            y1: centerY,
            x2: lineOuterX,
            y2: lineOuterY,
          },
          style: {
            stroke: isLightTheme ? "#333" : "#fff",
            lineWidth: 2,
            lineDash: [4, 3],
          },
          z: 100,
        },
      ]
    : [];

  const option = {
    tooltip: {
      backgroundColor: bgColor,
      textStyle: textColor,
      confine: true,
      trigger: "item",
      formatter: (params: any) => {
        const value = params.value ?? 0;
        const name = params.name ?? "Unknown";
        const percent = params.percent ?? 0;
        return `${name}<br/>${t("governance.common.stake")} ${formatLovelace(value)}<br/>(${percent}%)`;
      },
    },
    legend: {
      show: false,
    },
    graphic: graphicElements,
    series: [
      {
        label: labelStyle,
        avoidLabelOverlap: false,
        labelLayout: { hideOverlap: true },
        type: "pie",
        hoverAnimation: false,
        radius: "100%",
        data: filteredData,
      },
    ],
  };

  return (
    <div className='max-h-[145px] w-[145px] overflow-hidden'>
      <ReactEcharts
        opts={{ height: 145 }}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        className='w-full'
      />
    </div>
  );
};
