import type { GroupDetailData } from "@/types/analyticsTypes";
import { useMemo } from "react";
import { PieCharts } from "@/components/charts/PieCharts";
import { PIE_CHART_COLORS } from "@/constants/charts";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GroupDetailChartsProps {
  items: GroupDetailData["items"];
}

export const GroupDetailCharts = ({ items }: GroupDetailChartsProps) => {
  const { t } = useAppTranslation("common");
  const poolItems = useMemo(() => {
    return items?.filter(item => item.type === "pool") ?? [];
  }, [items]);

  const getChartData = useMemo(
    () => (filteredItems: typeof poolItems) => {
      return filteredItems.map((item, index) => {
        const poolInfo = item.info[0];
        const poolName =
          poolInfo?.pool_name?.ticker ||
          poolInfo?.pool_name?.name ||
          item.ident.substring(0, 10);

        return {
          name: poolName,
          stake: poolInfo?.live_stake ?? 0,
          pledge: poolInfo?.pledged ?? 0,
          color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        };
      });
    },
    [],
  );

  const charts = [
    {
      dataKey: "stake",
      title: t("groups.poolStake"),
      needsAdaFormatting: true,
    },
    { dataKey: "pledge", title: t("groups.pledge"), needsAdaFormatting: true },
  ];

  const tooltipTranslations = {
    others: t("charts.others"),
    items: t("charts.items"),
    total: t("charts.total"),
    andMore: (count: number) => t("charts.andMore", { count }),
  };

  return (
    <PieCharts
      items={poolItems}
      charts={charts}
      getChartData={getChartData}
      tooltipTranslations={tooltipTranslations}
    />
  );
};
