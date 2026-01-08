import type { GroupsListData } from "@/types/analyticsTypes";
import { useMemo } from "react";
import { PieCharts } from "@/components/charts/PieCharts";
import { PIE_CHART_COLORS } from "@/constants/charts";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GroupsChartsProps {
  filteredItems: GroupsListData[];
}

export const GroupsCharts = ({
  filteredItems,
}: GroupsChartsProps) => {
  const { t } = useAppTranslation("pages");

  const tooltipTranslations = useMemo(
    () => ({
      others: t("groups.tooltip.others"),
      items: t("groups.tooltip.items"),
      total: t("groups.tooltip.total"),
      andMore: (count: number) => t("groups.tooltip.andMore", { count }),
    }),
    [t],
  );

  const charts = useMemo(
    () => [
      { dataKey: "pools_count", title: t("groups.charts.poolsCount") },
      { dataKey: "pool_stake", title: t("groups.charts.poolStake"), needsAdaFormatting: true },
      { dataKey: "pledge", title: t("groups.charts.pledge"), needsAdaFormatting: true },
      {
        dataKey: "pledge_per_pool",
        title: t("groups.charts.pledgePerPool"),
        needsAdaFormatting: true,
      },
    ],
    [t],
  );

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

  return (
    <PieCharts
      items={filteredItems}
      charts={charts}
      getChartData={getChartData}
      tooltipTranslations={tooltipTranslations}
    />
  );
};
