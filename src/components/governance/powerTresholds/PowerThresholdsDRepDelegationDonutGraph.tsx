import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useGraphColors } from "@/hooks/useGraphColors";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { lovelaceToAda } from "@/utils/lovelaceToAda";
import type { ThresholdsMilestone } from "@/types/governanceTypes";

interface PowerThresholdsDRepDelegationDonutGraphProps {
  milestone: ThresholdsMilestone;
  isLoading: boolean;
  currentSupplyEpoch: number;
}

export const PowerThresholdsDRepDelegationDonutGraph: FC<
  PowerThresholdsDRepDelegationDonutGraphProps
> = ({ milestone, isLoading, currentSupplyEpoch }) => {
  const { textColor, bgColor } = useGraphColors();

  const { data: basicData, isLoading: basicLoading } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpoch = miscConst?.no;

  const currentDRepEpoch =
    milestone?.data?.find(e => e.epoch_no === currentEpoch) ??
    milestone?.data?.find(e => e.stat?.drep_distr?.sum);

  const supply = currentSupplyEpoch;
  const delegated = currentDRepEpoch?.stat?.drep_distr?.sum;

  const isDataLoading = isLoading;
  basicLoading || !currentEpoch;

  const isUnavailable = !currentSupplyEpoch || !currentDRepEpoch;

  if (isDataLoading) {
    return <LoadingSkeleton height='300px' />;
  }

  if (isUnavailable) {
    return (
      <div className='bg-muted/30 flex h-[300px] w-full items-center justify-center rounded-m'>
        <span className='text-xl font-semibold text-grayTextPrimary'>N/A</span>
      </div>
    );
  }

  const total = Number(supply);
  const delegatedADA = Number(delegated);
  const undelegatedADA = total - delegatedADA;
  const percent = (delegatedADA / total) * 100;

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: ({ name, value, percent }: any) =>
        `<b>${name}</b><br/>Voting Power: ${lovelaceToAda(value)}<br/>Share: ${percent.toFixed(2)}%`,
    },
    series: [
      {
        name: "DRep Delegation",
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
            name: "Delegated Voting Power",
            itemStyle: { color: "#0284C7" },
            emphasis: { itemStyle: { color: "#0284C7" } },
          },
          {
            value: undelegatedADA,
            name: "Undelegated",
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
      <div className='mt-13 text-center text-sm text-grayTextPrimary'>
        <p>
          DRep Count: {currentDRepEpoch?.stat?.drep_distr?.count_uniq ?? "–"}
        </p>
      </div>
    </div>
  );
};
