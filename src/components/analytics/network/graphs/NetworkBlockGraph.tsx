import type { FC } from "react";
import type { NetworkBlockGraphProps } from "../tabs/NetworkBlocksTab";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";
import { AnalyticsGraph } from "../../AnalyticsGraph";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useBlockProduction } from "@/hooks/graphs/useBlockProduction";

export const NetworkBlockGraph: FC<NetworkBlockGraphProps> = ({
  epochQuery,
  miscConst,
}) => {
  const { t } = useAppTranslation("common");
  const { json, option, selectedItem, setData, setSelectedItem } =
    useBlockProduction(miscConst);

  return (
    <AnalyticsGraph
      title={t("analytics.blockProduction")}
      description={t("analytics.blockProductionDescription")}
      exportButton
      graphSortData={{
        query: epochQuery,
        selectedItem,
        setData,
        setSelectedItem,
      }}
      csvJson={json}
    >
      <div className='relative w-full'>
        <GraphWatermark />
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          className='h-full min-h-[400px] w-full'
        />
      </div>
    </AnalyticsGraph>
  );
};
