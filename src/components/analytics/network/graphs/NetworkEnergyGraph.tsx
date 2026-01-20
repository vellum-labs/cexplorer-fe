import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { Dispatch, FC, SetStateAction } from "react";
import type { useFetchAnalyticsRate } from "@/services/analytics";

import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useGraphColors } from "@/hooks/useGraphColors";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface NetworkEnergyGraphProps {
  setJson?: Dispatch<SetStateAction<any>>;
  rateQuery: ReturnType<typeof useFetchAnalyticsRate>;
}

export const NetworkEnergyGraph: FC<NetworkEnergyGraphProps> = ({
  setJson,
  rateQuery,
}) => {
  const { t } = useAppTranslation("common");
  const data = rateQuery.data?.data || [];

  const [graphsVisibility, setGraphsVisibility] = useState({
    "Energy Consumption (GWh)": true,
  });

  const consumptionPerDevice = 45;
  const conversionFactor = 1_000_000_000;

  const energyConsumptionRates = data.map(item => {
    const countPoolRelayUniq = item?.stat?.count_pool_relay_uniq ?? 0;
    const estimatedUniqueDevices = countPoolRelayUniq * 1.5;

    return (
      (consumptionPerDevice * 365 * 24 * estimatedUniqueDevices) /
      conversionFactor
    );
  });

  const dates = data.map(item => item?.date ?? "Unknown Date");

  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: ["Energy Consumption (GWh)"],
      textStyle: {
        color: textColor,
      },
      selected: Object.keys(graphsVisibility).reduce((acc, key) => {
        acc[key] = graphsVisibility[key];
        return acc;
      }, {}),
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: bgColor,
      confine: true,
      textStyle: {
        color: textColor,
      },
    },
    grid: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      name: t("labels.epoch"),
      nameLocation: "middle",
      nameGap: 28,
      inverse: true,
      boundaryGap: false,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
    },
    yAxis: {
      type: "value",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
        },
      },
    },
    series: [
      {
        type: "line",
        data: energyConsumptionRates,
        name: "Energy Consumption (GWh)",
        yAxisIndex: 0,
        lineStyle: {
          color: textColor,
        },
        showSymbol: false,
        symbol: "none",
        z: 2,
      },
    ],
  };

  useEffect(() => {
    if (window && "localStorage" in window) {
      const graphStore = JSON.parse(
        localStorage.getItem(
          "network_energy_consumption_graph_store",
        ) as string,
      );

      if (graphStore) {
        setGraphsVisibility(graphStore);
      } else {
        localStorage.setItem(
          "network_energy_consumption_graph_store",
          JSON.stringify(graphsVisibility),
        );
      }
    }
  }, []);

  useEffect(() => {
    if (setJson) {
      setJson(
        dates.map((epoch, index) => {
          return {
            Epoch: epoch,
            "Energy Consumption (GWh)": energyConsumptionRates[index],
          };
        }),
      );
    }
  }, [setJson]);

  if (rateQuery.isLoading) {
    return <LoadingSkeleton height='490px' width='100%' rounded='lg' />;
  }

  return (
    <div className='relative flex w-full'>
      <GraphWatermark />
      <ReactEcharts
        option={option}
        onEvents={{
          legendselectchanged: params => {
            const { selected } = params;

            localStorage.setItem(
              "network_energy_consumption_graph_store",
              JSON.stringify(selected),
            );
          },
        }}
        notMerge={true}
        lazyUpdate={true}
        className='min-h-[490px] w-full'
      />
    </div>
  );
};
