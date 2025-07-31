import type { useFetchDrepAnalytics } from "@/services/drep";
import type { FC } from "react";

import Tabs from "@/components/global/Tabs";
import { DrepAnalytcsPieGraph } from "../DrepAnalytcsPieGraph";
import { DrepPoolGraph } from "../DrepPoolGraph";
import { DrepSizeGraph } from "../DrepSizeGraph";

import { useState } from "react";

import { useGraphColors } from "@/hooks/useGraphColors";
import type { DrepListOrder } from "@/types/drepTypes";
import { AverageDrepGraph } from "../AverageDrepGraph";
import { DrepNotSpoGraph } from "../DrepNotSpoGraph";
import { StakeIsSpoDrepGraph } from "../StakeIsSpoDrepGraph";
import { DelegationChangesGraph } from "../DelegationChangesGraph";

interface DrepAnalyticsTabProps {
  query: ReturnType<typeof useFetchDrepAnalytics>;
}

export const DrepAnalyticsTab: FC<DrepAnalyticsTabProps> = ({ query }) => {
  const epochs = query?.data?.drep_distr
    ?.filter(item => item.epoch_no)
    ?.map(item => item.epoch_no);
  const [activeType, setActiveType] = useState<DrepListOrder>("power");
  const { textColor, bgColor } = useGraphColors();

  const abstain = query.data?.delegator?.drep_always_abstain?.stake ?? 0;
  const noConfidence =
    query.data?.delegator?.drep_always_no_confidence?.stake ?? 0;
  const delegatedToPools =
    query.data?.delegator?.delegated_stake_pools?.stake ?? 0;

  const items = [
    {
      key: "power",
      label: "Stake",
      visible: true,
    },
    {
      key: "delegator",
      label: "Delegators",
      visible: true,
    },
    {
      key: "own",
      label: "Owner Stake",
      visible: true,
    },
    {
      key: "average_stake",
      label: "Average Stake",
      visible: true,
    },
  ];

  const commonPieTooltip = (params, data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data
      .map(item => {
        const percent = ((item.value / total) * 100).toFixed(2);
        const isHovered = item.name === params.name;
        return `${isHovered ? "<b>" : ""}${item.name}: ${percent}%${isHovered ? "</b>" : ""}`;
      })
      .join("<br/>");
  };

  const governancePieData = [
    { value: abstain, name: "Abstain DRep" },
    { value: noConfidence, name: "No Confidence DRep" },
    { value: delegatedToPools, name: "Delegated to DReps" },
  ];

  const activeVotingPieData = [
    { value: noConfidence, name: "No Confidence" },
    { value: delegatedToPools, name: "Delegated to DReps" },
  ];

  const governanceOption = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: params => commonPieTooltip(params, governancePieData),
    },
    label: { color: textColor },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: governancePieData,
        label: {
          show: true,
          formatter: "{b}\n {d}%",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const activeVotingOption = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: { color: textColor },
      formatter: params => commonPieTooltip(params, activeVotingPieData),
    },
    label: { color: textColor },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: activeVotingPieData,
        label: {
          show: true,
          formatter: "{b}\n {d}%",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <section className='flex flex-col gap-2'>
      <div className='relative w-full rounded-lg border border-border p-5'>
        <h2 className='mb-2'>Pool Graph</h2>
        <DrepPoolGraph epochs={epochs || []} query={query} />
      </div>
      <AverageDrepGraph />
      <div className='relative w-full rounded-lg border border-border p-5'>
        <h1 className='mb-2 pl-5'>Stake Composition by Role</h1>
        <div className='flex flex-col gap-4'>
          <DrepNotSpoGraph />
          <StakeIsSpoDrepGraph />
        </div>
      </div>
      <div className='relative w-full rounded-lg border border-border p-5'>
        <h1 className='mb-2 pl-5'>Delegation Changes</h1>
        <div className='flex flex-col gap-4'>
          <DelegationChangesGraph />
        </div>
      </div>

      <div className='flex flex-wrap gap-2 lg:flex-nowrap'>
        <div className='relative w-full rounded-lg border border-border p-5'>
          <h2 className='mb-2'>ADA in Governance</h2>
          <DrepAnalytcsPieGraph option={governanceOption} />
        </div>
        <div className='relative w-full rounded-lg border border-border p-5'>
          <h2 className='mb-2'>Active Voting Stake</h2>
          <DrepAnalytcsPieGraph option={activeVotingOption} />
        </div>
      </div>
      <div className='relative w-full rounded-lg border border-border p-5'>
        <div className='flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap'>
          <h2 className='mb-2t text-nowrap'>Drep Size</h2>
          <Tabs
            items={items}
            tabParam='graph'
            withPadding={false}
            withMargin={false}
            onClick={activeTab => setActiveType(activeTab as DrepListOrder)}
            toRight
          />
        </div>
        <DrepSizeGraph type={activeType} />
      </div>
    </section>
  );
};
