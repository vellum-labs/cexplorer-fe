import type { FC } from "react";
import ReactECharts from "echarts-for-react";

import { useFetchMiscBasic } from "@/services/misc";
import { useGraphColors } from "@/hooks/useGraphColors";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useMiscConst } from "@/hooks/useMiscConst";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import type { ThresholdsMilestone } from "@/types/governanceTypes";

interface PowerThresholdsSPODelegationDonutGraphProps {
  milestone: ThresholdsMilestone;
  isLoading: boolean;
  currentSupplyEpoch: number;
}

export const PowerThresholdsSPODelegationDonutGraph: FC<
  PowerThresholdsSPODelegationDonutGraphProps
> = ({ milestone, isLoading, currentSupplyEpoch }) => {
  const { textColor, bgColor } = useGraphColors();

  const { data: basicData, isLoading: basicDataLoading } =
    useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpoch = miscConst?.no;

  const currentPoolEpoch =
    milestone?.data?.find(entry => entry.epoch_no === currentEpoch) ??
    milestone?.data?.find(entry => entry.stat?.pool_distr?.sum);

  const supply = currentSupplyEpoch;
  const delegated = currentPoolEpoch?.stat?.pool_distr?.sum;

  const isDataLoading = isLoading || basicDataLoading || !currentEpoch;

  const isUnavailable = !currentSupplyEpoch || !currentPoolEpoch;

  if (isDataLoading) {
    return <LoadingSkeleton height='300px' />;
  }

  if (isUnavailable) {
    return (
      <div className='bg-muted/30 flex h-[300px] w-full items-center justify-center rounded-m'>
        <span className='text-text-xl font-semibold text-grayTextPrimary'>
          N/A
        </span>
      </div>
    );
  }

  const circulatingADA = Number(supply);
  const delegatedADA = Number(delegated);
  const undelegatedADA = circulatingADA - delegatedADA;
  const percent = (delegatedADA / circulatingADA) * 100;

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: ({ name, value, percent }: any) =>
        `<b>${name}</b><br/>Stake: ${lovelaceToAda(value)}<br/>Share: ${percent.toFixed(2)}%`,
    },
    series: [
      {
        name: "SPO Delegation",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `${percent.toFixed(1)}%`,
          fontSize: 22,
          color: textColor,
          fontWeight: 600,
        },
        labelLine: { show: false },
        data: [
          {
            value: delegatedADA,
            name: "Delegated ADA",
            itemStyle: { color: "#0284C7" },
            emphasis: { itemStyle: { color: "#0284C7" } },
          },
          {
            value: undelegatedADA,
            name: "Undelegated ADA",
            itemStyle: { color: "#E4E7EC" },
            emphasis: { itemStyle: { color: "#E4E7EC" } },
          },
        ],
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='relative h-[260px] w-full max-w-[260px]'>
        <ReactECharts
          option={option}
          notMerge
          lazyUpdate
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className='mt-13 text-center text-text-sm text-grayTextPrimary'>
        <p>
          Stake Pool Count:{" "}
          {currentPoolEpoch?.stat?.pool_distr?.count_pool_uniq ?? "–"}
        </p>
        <p>
          Unique Addresses Delegated:{" "}
          {currentPoolEpoch?.stat?.pool_distr?.count_addr_uniq ?? "–"}
        </p>
      </div>
    </div>
  );
};
