import type { GroupsListData } from "@/types/analyticsTypes";
import { useMemo } from "react";
import { PieCharts } from "@/components/charts/PieCharts";
import { PIE_CHART_COLORS } from "@/constants/charts";

interface GroupsChartsProps {
  filteredItems: GroupsListData[];
}

export const GroupsCharts = ({ filteredItems }: GroupsChartsProps) => {
  const getChartData = useMemo(
    () => (items: GroupsListData[]) => {
      return items.map((item, index) => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const poolCount = item.data?.pool?.count ?? 1;
        const pledgePerPool = poolCount > 0 ? pledge / poolCount : 0;

        return {
          name: item.name,
          pools_count: item.data?.pool?.count ?? 0,
          pool_stake: item.data?.pool?.stake ?? 0,
          pledge: pledge,
          pledge_per_pool: pledgePerPool,
          color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
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
    <PieCharts items={filteredItems} charts={charts} getChartData={getChartData} />
  );
};
