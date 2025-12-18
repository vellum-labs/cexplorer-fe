import type { FC } from "react";

import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";

import { Asterisk, Landmark, Route, User } from "lucide-react";

import { useFetchDrepStat } from "@/services/drep";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { PageBase } from "@/components/global/pages/PageBase";
import { GovernanceActionsTab } from "@/components/governance/tabs/GovernanceActionsTab";
import { ConstitutionTab } from "@/components/governance/tabs/ConstitutionTab";
import { GovernanceTimelineTab } from "@/components/governance/tabs/GovernanceTimelineTab";
import { generateImageUrl } from "@/utils/generateImageUrl";

export const GovernancePage: FC = () => {
  const drepStatQuery = useFetchDrepStat();
  const miscBasicQuery = useFetchMiscBasic(true);

  const { data: basicData } = miscBasicQuery;

  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const { data: drepStat } = drepStatQuery;

  const statCards = [
    {
      key: "active_gov_actions",
      icon: <Asterisk className='text-primary' />,
      label: "Governance actions",
      content: (
        <p className='text-display-xs font-semibold'>
          {drepStat?.gov_action[0]?.total
            ? drepStat?.gov_action[0]?.total
            : "-"}
        </p>
      ),
      footer: (
        <div className='flex flex-wrap'>
          <div className='flex w-fit items-center gap-1/2 pr-3'>
            <span className='text-text-sm text-grayTextPrimary'>Active</span>
            <span className='text-text-sm text-[#10B981]'>
              {drepStat?.gov_action[0]?.active || 0}
            </span>
          </div>
          <div className='flex w-fit items-center gap-1/2 pr-3'>
            <span className='text-text-sm text-grayTextPrimary'>Ratified</span>
            <span className='text-text-sm text-[#00A9E3]'>
              {drepStat?.gov_action[0]?.ratified || 0}
            </span>
          </div>
          {!!drepStat?.gov_action[0]?.enacted && (
            <div className='flex w-fit items-center gap-1/2 pr-3'>
              <span className='text-text-sm text-grayTextPrimary'>Enacted</span>
              <span className='text-text-sm text-[#876ee1]'>
                {drepStat?.gov_action[0]?.enacted}
              </span>
            </div>
          )}
          {!!drepStat?.gov_action[0]?.expires && (
            <div className='flex w-fit items-center gap-1/2 pr-2'>
              <span className='text-text-sm text-grayTextPrimary'>
                Expired / Dropped
              </span>
              <span className='text-text-sm text-[#F79009]'>
                {drepStat?.gov_action[0]?.expires}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "gov_parties",
      icon: <Asterisk className='text-primary' />,
      label: "Governance parties",
      content: (
        <div className='flex items-center justify-between gap-1'>
          <Link to='/drep'>
            <div className='flex items-center gap-1'>
              <User className='text-primary' />
              <span className='text-primary'>DReps</span>
            </div>
          </Link>
          <Link to='/pool'>
            <div className='flex items-center gap-1'>
              <Route className='text-primary' />
              <span className='text-primary'>SPOs</span>
            </div>
          </Link>
          <Link to='/gov/cc'>
            <div className='flex items-center gap-1'>
              <Landmark className='text-primary' />
              <span className='text-primary'>CC</span>
            </div>
          </Link>
        </div>
      ),
      footer: <></>,
    },
    {
      key: "featured",
      icon: undefined,
      label: (
        <AdsCarousel
          singleItem
          className='!w-full !max-w-full flex-grow overflow-hidden'
          adCardClassname='!border-none !py-0'
          filterByType='drep'
          maxWidth={false}
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
        />
      ),
      content: <></>,
      footer: <></>,
      className: "!px-0 overflow-hidden",
      fullContentHeight: true,
    },
  ];

  const tabs = [
    {
      key: "governance_actions",
      label: "Governance actions",
      content: (
        <GovernanceActionsTab key='governance_actions' miscConst={miscConst} />
      ),
      visible: true,
    },
    {
      key: "outcomes",
      label: "Outcomes",
      content: (
        <GovernanceActionsTab
          key='outcomes'
          miscConst={miscConst}
          outcomesOnly
        />
      ),
      visible: true,
    },
    {
      key: "timeline",
      label: "Timeline",
      content: <GovernanceTimelineTab miscConst={miscConst} />,
      visible: true,
    },
    {
      key: "constitutions",
      label: "Constitutions",
      content: <ConstitutionTab currentEpoch={miscConst?.epoch?.no ?? 0} />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='governance'
      title='Governance Actions'
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        { label: "Governance actions" },
      ]}
      adsCarousel={false}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='flex h-full w-full flex-wrap items-stretch gap-2 lg:flex-nowrap'>
          {drepStatQuery.isLoading || drepStatQuery.isFetching ? (
            <>
              <LoadingSkeleton
                width='456px'
                height='136px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
              <LoadingSkeleton
                width='456px'
                height='136px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
              <LoadingSkeleton
                width='456px'
                height='136px'
                rounded='xl'
                className='flex-grow lg:flex-grow-0'
              />
            </>
          ) : (
            statCards.map(
              ({
                icon,
                key,
                label,
                content,
                footer,
                className,
                fullContentHeight,
              }) => {
                return (
                  <OverviewStatCard
                    key={key}
                    icon={icon}
                    title={label}
                    value={content}
                    fullContentHeight={fullContentHeight}
                    description={footer}
                    className={`min-w-[300px] ${className ? className : ""}`}
                  />
                );
              },
            )
          )}
        </div>
      </section>
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <Tabs withPadding={false} items={tabs} />
      </section>
    </PageBase>
  );
};
