import type { useFetchDrepAnalytics } from "@/services/drep";
import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
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
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepAnalyticsTabProps {
  query: ReturnType<typeof useFetchDrepAnalytics>;
}

export const DrepAnalyticsTab: FC<DrepAnalyticsTabProps> = ({ query }) => {
  const { t } = useAppTranslation("pages");
  const epochs = query?.data?.drep_distr
    ?.filter(item => item.epoch_no)
    ?.map(item => item.epoch_no);
  const [activeType, setActiveType] = useState<DrepListOrder>("power");
  const { textColor, bgColor } = useGraphColors();

  const abstain = query.data?.delegator?.drep_always_abstain?.stake ?? 0;
  const noConfidence =
    query.data?.delegator?.drep_always_no_confidence?.stake ?? 0;
  const totalStake = query.data?.delegator?.total?.stake ?? 0;
  const delegatedToDreps = totalStake - abstain - noConfidence;

  const items = [
    {
      key: "power",
      label: t("dreps.analytics.tabs.votingPower"),
      visible: true,
    },
    {
      key: "delegator",
      label: t("dreps.analytics.tabs.delegators"),
      visible: true,
    },
    {
      key: "own",
      label: t("dreps.analytics.tabs.ownerStake"),
      visible: true,
    },
    {
      key: "average_stake",
      label: t("dreps.analytics.tabs.averageStake"),
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
    { value: abstain, name: t("dreps.analytics.pie.abstainDrep") },
    { value: noConfidence, name: t("dreps.analytics.pie.noConfidenceDrep") },
    { value: delegatedToDreps, name: t("dreps.analytics.pie.delegatedToDreps") },
  ];

  const activeVotingPieData = [
    { value: abstain, name: t("dreps.analytics.pie.abstainNotActive") },
    { value: noConfidence, name: t("dreps.analytics.pie.noConfidence") },
    { value: delegatedToDreps, name: t("dreps.analytics.pie.delegatedToDreps") },
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
    <section className='flex flex-col gap-1'>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h2 className='mb-1'>{t("dreps.analytics.poolGraph")}</h2>
        <DrepPoolGraph epochs={epochs || []} query={query} />
      </div>
      <AverageDrepGraph />
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>
          {t("dreps.analytics.stakeCompositionByRole")}
        </h1>
        <div className='flex flex-col gap-2'>
          <DrepNotSpoGraph />
          <StakeIsSpoDrepGraph />
        </div>
      </div>
      <div className='relative w-full rounded-m border border-border p-3'>
        <h1 className='mb-1 pl-3'>{t("dreps.analytics.delegationChanges")}</h1>
        <div className='flex flex-col gap-2'>
          <DelegationChangesGraph />
        </div>
      </div>

      <div className='flex flex-wrap gap-1 lg:flex-nowrap'>
        <div className='relative w-full rounded-m border border-border p-3'>
          <h2 className='mb-1'>{t("dreps.analytics.adaInGovernance")}</h2>
          <DrepAnalytcsPieGraph option={governanceOption} />
        </div>
        <div className='relative w-full rounded-m border border-border p-3'>
          <h2 className='mb-1'>{t("dreps.analytics.activeVotingStake")}</h2>
          <DrepAnalytcsPieGraph option={activeVotingOption} />
        </div>
      </div>
      <div className='relative w-full rounded-m border border-border p-3'>
        <div className='flex flex-wrap items-center justify-between gap-1 lg:flex-nowrap'>
          <h2 className='mb-2t text-nowrap'>{t("dreps.analytics.drepSize")}</h2>
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
