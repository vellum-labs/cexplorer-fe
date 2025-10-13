import EChartsReact from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { formatNumber } from "@/utils/format/format";
import type { GroupsListData } from "@/types/analyticsTypes";
import { useMemo } from "react";

interface GroupsChartsProps {
  filteredItems: GroupsListData[];
}

export const GroupsCharts = ({ filteredItems }: GroupsChartsProps) => {
  const { textColor, bgColor } = useGraphColors();

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

    return filteredItems.map((item, index) => {
      const pledge = item.data?.pool?.pledged ?? 0;
      const poolCount = item.data?.pool?.count ?? 1;
      const pledgePerPool = poolCount > 0 ? pledge / poolCount : 0;

      return {
        name: item.name,
        pools_count: item.data?.pool?.count ?? 0,
        pool_stake: item.data?.pool?.stake ?? 0,
        pledge: pledge,
        pledge_per_pool: pledgePerPool,
        color: colors[index % colors.length],
      };
    });
  }, [filteredItems]);

  const getChartOption = (
    dataKey: "pools_count" | "pool_stake" | "pledge" | "pledge_per_pool",
    title: string,
  ) => {
    const needsAdaFormatting =
      dataKey === "pool_stake" ||
      dataKey === "pledge" ||
      dataKey === "pledge_per_pool";

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
          if (needsAdaFormatting) {
            const adaValue = formatNumber(Math.round(params.value / 1000000));
            return `${params.name}<br/>${params.marker}${adaValue} ₳`;
          }
          return `${params.name}<br/>${params.marker}${formatNumber(params.value)}`;
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

  return (
    <div className='mb-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("pools_count", "Pools Count")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("pool_stake", "Pool Stake")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("pledge", "Pledge")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
      <div className='w-full'>
        <EChartsReact
          option={getChartOption("pledge_per_pool", "μ Pledge per Pool")}
          style={{ height: "400px", width: "100%" }}
        />
      </div>
    </div>
  );
};
