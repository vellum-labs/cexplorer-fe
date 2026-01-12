import type { GroupDetailData } from "@/types/analyticsTypes";
import { useMemo } from "react";
import { PieCharts } from "@/components/charts/PieCharts";
import { PIE_CHART_COLORS } from "@/constants/charts";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface GroupDetailDRepChartsProps {
  items: GroupDetailData["items"];
}

export const GroupDetailDRepCharts = ({
  items,
}: GroupDetailDRepChartsProps) => {
  const { t } = useAppTranslation("common");
  const drepItems = useMemo(() => {
    return items?.filter(item => item.type === "drep") ?? [];
  }, [items]);

  const getChartData = useMemo(
    () => (filteredItems: typeof drepItems) => {
      return filteredItems.map((item, index) => {
        const drepInfo = item.info[0];
        const drepName =
          drepInfo?.data?.given_name || item.ident.substring(0, 15) + "...";

        return {
          name: drepName,
          voting_power: drepInfo?.amount ?? 0,
          delegators: drepInfo?.distr?.count ?? 0,
          color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        };
      });
    },
    [],
  );

  const charts = [
    {
      dataKey: "voting_power",
      title: t("groups.votingPower"),
      needsAdaFormatting: true,
    },
    { dataKey: "delegators", title: t("groups.delegators") },
  ];

  const tooltipTranslations = {
    others: t("charts.others"),
    items: t("charts.items"),
    total: t("charts.total"),
    andMore: (count: number) => t("charts.andMore", { count }),
  };

  return (
    <PieCharts
      items={drepItems}
      charts={charts}
      getChartData={getChartData}
      tooltipTranslations={tooltipTranslations}
    />
  );
};
