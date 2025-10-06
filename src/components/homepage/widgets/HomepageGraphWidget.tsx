import type { WidgetDataTypes, WidgetTypes } from "@/types/widgetTypes";
import { memo, type FC } from "react";

import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import ReactEcharts from "echarts-for-react";

import { useGetGraphWidget } from "@/hooks/widget/useGetWidget";
import { useThemeStore } from "@/stores/themeStore";

interface HomepageGraphWidgetProps {
  type: WidgetTypes;
  dataType: WidgetDataTypes;
}

export const HomepageGraphWidget: FC<HomepageGraphWidgetProps> = memo(
  function HomepageGraphWidget({ dataType, type }) {
    const { theme } = useThemeStore();

    const {
      json,
      option,
      selectedItem,
      query,
      wrapper,
      storageKey,
      isLoading,
      setData,
      setSelectedItem,
      onClick,
    } = useGetGraphWidget(type, dataType);

    if (isLoading) {
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-[150px] w-full items-center justify-center'>
            <div
              className={`loader h-[60px] w-[60px] border-[4px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"} border-t-[4px]`}
            ></div>
          </div>
        </div>
      );
    }

    return wrapper ? (
      <AnalyticsGraph
        className='flex max-h-[360px] w-full flex-col gap-1.5 border-none !p-4'
        exportButton
        graphSortData={{
          query: query as any,
          setData: setData as any,
          setSelectedItem: setSelectedItem as any,
          selectedItem: selectedItem as any,
        }}
        csvJson={json}
      >
        <div
          className='z-[99999] w-full'
          style={{
            maxHeight: "350px",
          }}
        >
          <GraphWatermark />
          <ReactEcharts
            onEvents={{
              legendselectchanged: params => {
                const { selected } = params;

                if (storageKey)
                  localStorage.setItem(storageKey, JSON.stringify(selected));
              },
            }}
            option={option}
            notMerge={false}
            lazyUpdate={false}
            className='h-full w-full'
            style={{
              minHeight: "350px",
            }}
          />
        </div>
      </AnalyticsGraph>
    ) : (
      <div
        className='relative w-full p-1.5'
        style={{
          maxHeight: "350px",
        }}
      >
        <GraphWatermark />
        <ReactEcharts
          onEvents={{
            legendselectchanged: params => {
              const { selected } = params;

              localStorage.setItem(storageKey, JSON.stringify(selected));
            },
            click: onClick ? onClick : () => undefined,
          }}
          option={option}
          notMerge={false}
          lazyUpdate={false}
          className='h-full w-full'
          style={{
            minHeight: "350px",
          }}
        />
      </div>
    );
  },
);
