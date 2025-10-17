import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

interface GovernanceDetailOverviewInfoGraphProps {
  data: any;
}

export const GovernanceDetailOverviewInfoGraph: FC<
  GovernanceDetailOverviewInfoGraphProps
> = ({ data }) => {
  const hasNonZeroValue = data.some((item: any) => item.value > 0);

  const filteredData = hasNonZeroValue
    ? data.filter((item: any) => item.value > 0)
    : data;

  const { theme } = useThemeStore();
  const { textColor, bgColor } = useGraphColors();

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
        return `${name}<br/>Stake: ${lovelaceToAda(value)} ADA<br/>(${percent}%)`;
      },
    },
    legend: {
      show: false,
    },
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
    <div className='max-h-[145px] w-[145px]'>
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
