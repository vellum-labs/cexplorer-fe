import type { GroupsListData } from "@/types/analyticsTypes";
import { useMemo } from "react";
import { PieCharts } from "@/components/charts/PieCharts";
import { PIE_CHART_COLORS } from "@/constants/charts";

interface GroupsChartsProps {
  filteredItems: GroupsListData[];
}

export const GroupsCharts = ({
  filteredItems,
}: GroupsChartsProps) => {
  const getChartData = useMemo(
    () => (items: GroupsListData[], dataKey: string) => {
      const colorMap = new Map<string, string>();
      items.forEach((item, index) => {
        colorMap.set(
          item.name,
          PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        );
      });

      const sortedItems = [...items].sort((a, b) => {
        const pledge = (item: GroupsListData) =>
          item.data?.pool?.pledged ?? 0;
        const poolCount = (item: GroupsListData) =>
          item.data?.pool?.count ?? 1;
        const pledgePerPool = (item: GroupsListData) =>
          poolCount(item) > 0 ? pledge(item) / poolCount(item) : 0;

        switch (dataKey) {
          case "pools_count":
            return (b.data?.pool?.count ?? 0) - (a.data?.pool?.count ?? 0);
          case "pool_stake":
            return (b.data?.pool?.stake ?? 0) - (a.data?.pool?.stake ?? 0);
          case "pledge":
            return pledge(b) - pledge(a);
          case "pledge_per_pool":
            return pledgePerPool(b) - pledgePerPool(a);
          default:
            return 0;
        }
      });

      return sortedItems.map(item => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const poolCount = item.data?.pool?.count ?? 1;
        const pledgePerPool = poolCount > 0 ? pledge / poolCount : 0;

        return {
          name: item.name,
          pools_count: item.data?.pool?.count ?? 0,
          pool_stake: item.data?.pool?.stake ?? 0,
          pledge: pledge,
          pledge_per_pool: pledgePerPool,
          color: colorMap.get(item.name) ?? PIE_CHART_COLORS[0],
        };
      });
    },
    [],
  );

  const charts = [
    { dataKey: "pools_count", title: "Pools Count" },
    { dataKey: "pool_stake", title: "Pool Stake", needsAdaFormatting: true },
    { dataKey: "pledge", title: "Pledge", needsAdaFormatting: true },
    {
      dataKey: "pledge_per_pool",
      title: "μ Pledge per Pool",
      needsAdaFormatting: true,
    },
  ];

  return (
    <PieCharts
      items={filteredItems}
      charts={charts}
      getChartData={getChartData}
    />
  );
};
