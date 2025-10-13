import EChartsReact from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@/utils/format/format";
import type { GroupDetailData } from "@/types/analyticsTypes";
import { useMemo } from "react";

interface GroupDetailChartsProps {
  items: GroupDetailData["items"];
}

export const GroupDetailCharts = ({ items }: GroupDetailChartsProps) => {
  const { textColor, bgColor } = useGraphColors();

  const poolItems = useMemo(() => {
    return items?.filter(item => item.type === "pool") ?? [];
  }, [items]);

  const chartData = useMemo(() => {
    const colors = [
      "#47CD89",
      "#92c7e4",
      "#3a8dde",
      "#f69972",
      "#527381",
      "#81ba71",
      "#22366c",
      "#FFA500",
      "#FF6B6B",
      "#4ECDC4",
      "#F38181",
      "#AA96DA",
      "#5B8FF9",
      "#61DDAA",
      "#65789B",
      "#F6BD16",
      "#7262FD",
      "#78D3F8",
      "#9661BC",
      "#F6903D",
      "#008685",
      "#F08BB4",
      "#5D7092",
      "#5AD8A6",
      "#E8684A",
      "#6DC8EC",
      "#9270CA",
      "#FF9D4D",
      "#269A99",
    ];

    return poolItems.map((item, index) => {
      const poolInfo = item.info[0];
      const poolName =
        poolInfo?.pool_name?.ticker ||
        poolInfo?.pool_name?.name ||
        item.ident.substring(0, 10);

      return {
        name: poolName,
        stake: poolInfo?.live_stake ?? 0,
        pledge: poolInfo?.pledged ?? 0,
        color: colors[index % colors.length],
      };
    });
  }, [poolItems]);

  const getChartOption = (dataKey: "stake" | "pledge", title: string) => {
    return {
      title: {
        text: title,
        left: "center",
        textStyle: {
          color: textColor,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          const adaValue = formatNumber(Math.round(params.value / 1000000));
          return `${params.name}<br/>${params.marker}${adaValue} ₳`;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "80%"],
          avoidLabelOverlap: true,
          minShowLabelAngle: 10,
          label: {
            show: true,
            color: textColor,
            position: "outside",
            fontSize: 10,
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: {
              width: 1,
            },
          },
          emphasis: {
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          data: chartData.map(item => ({
            value: item[dataKey],
            name: item.name,
            itemStyle: { color: item.color },
          })),
        },
      ],
    };
  };

  if (poolItems.length === 0) {
    return null;
  }

  return (
    <div className='mb-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("stake", "Pool Stake")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("pledge", "Pledge")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </div>
  );
};
