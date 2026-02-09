import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import ReactEcharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";

import type { MiscConstResponseData } from "@/types/miscTypes";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EpochStakedAdaProps {
  stats: EpochStatsSummary;
  isLoading: boolean;
  isError: boolean;
  constData?: MiscConstResponseData;
}

export const EpochStakedAda: FC<EpochStakedAdaProps> = ({
  stats,
  isError,
  isLoading,
  constData,
}) => {
  const { t } = useAppTranslation("pages");

  const stakedAda =
    (stats?.stake?.epoch / (constData?.circulating_supply ?? 1)) * 100;

  const { textColor, bgColor } = useGraphColors();

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: param => {
        const color = param.color;
        return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;"></span>${param.data.name}: ${param.data.value}%`;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        label: {
          color: textColor,
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: (stakedAda > 100 ? 100 : stakedAda).toFixed(2),
            name: t("epochs.stakedAda.staked"),
            itemStyle: { color: "#47CD89" },
          },
          {
            value: (100 - stakedAda).toFixed(2),
            name: t("epochs.stakedAda.unstaked"),
            itemStyle: { color: "#FEC84B" },
          },
        ],
      },
    ],
  };

  return (
    <div className='flex h-[520px] w-1/2 flex-grow basis-[600px] flex-col gap-2 rounded-l border border-border p-3 md:flex-shrink-0'>
      <div className='flex flex-col'>
        <h3>{t("epochs.stakedAda.title")}</h3>
        <span className='text-text-md font-semibold text-grayTextPrimary'>
          {t("epochs.stakedAda.subtitle")}
        </span>
      </div>
      {!stats || isError || isLoading ? (
        <LoadingSkeleton height='550px' width='100%' rounded='lg' />
      ) : (
        <ReactEcharts
          option={option}
          className='min-h-[520px] w-full'
          opts={{ height: 400 }}
        />
      )}
    </div>
  );
};
