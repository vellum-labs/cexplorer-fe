import { Asterisk, Users, UserX, Zap } from "lucide-react";

import { DrepAnalyticsTab } from "@/components/drep/tabs/DrepAnalyticsTab";
import { DrepDelegationsTab } from "@/components/drep/tabs/DrepDelegationsTab";
import { DrepListTab } from "@/components/drep/tabs/DrepListTab";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";

import {
  useFetchDrepAnalytics,
  useFetchDrepStat,
  useFetchStakeDrepRetired,
} from "@/services/drep";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@vellumlabs/cexplorer-sdk";
import Autoplay from "embla-carousel-autoplay";
import { PageBase } from "@/components/global/pages/PageBase";

export const DrepListPage = () => {
  const drepStatQuery = useFetchDrepStat();
  const drepAnalyticsQuery = useFetchDrepAnalytics();
  const stakeDrepRetiredQuery = useFetchStakeDrepRetired();

  const { data: drepStat } = drepStatQuery;
  const { data: drepAnalytics } = drepAnalyticsQuery;
  const { data: stakeDrepRetired } = stakeDrepRetiredQuery;

  const tabs = [
    {
      key: "list",
      label: "List",
      content: <DrepListTab />,
      visible: true,
    },
    {
      key: "delegations",
      label: "Delegations",
      content: <DrepDelegationsTab />,
      visible: true,
    },
    {
      key: "analytics",
      label: "Analytics",
      content: <DrepAnalyticsTab query={drepAnalyticsQuery} />,
      visible: true,
    },
  ];

  const statCards = [
    {
      key: "registered_dreps",
      icon: <Asterisk className='text-primary' />,
      label: "Registered DReps",
      content: (
        <p className='text-display-xs font-semibold'>
          {drepStat?.drep?.count?.total ? drepStat?.drep?.count?.total : "-"}
        </p>
      ),
      footer: (
        <div className='flex flex-wrap'>
          {drepStat?.drep?.count?.active && (
            <div className='flex w-fit items-center gap-1/2 pr-[26px]'>
              <span className='text-text-sm text-grayTextPrimary'>Active</span>
              <span className='text-text-sm text-[#16B364]'>
                {drepStat?.drep?.count?.active}
              </span>
            </div>
          )}
          {drepStat?.drep?.count?.inactive && (
            <div className='flex w-fit items-center gap-1/2 pr-[26px]'>
              <span className='text-text-sm text-grayTextPrimary'>
                Inactive
              </span>
              <span className='text-text-sm text-[#EAAA08]'>
                {drepStat?.drep?.count?.inactive}
              </span>
            </div>
          )}
          {drepStat?.drep?.count?.retired && (
            <div className='flex w-fit items-center gap-1/2 pr-[26px]'>
              <span className='text-text-sm text-grayTextPrimary'>Retired</span>
              <span className='text-text-sm text-[#F04438]'>
                {drepStat?.drep?.count?.retired}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "voting_stake",
      icon: <Zap className='text-primary' />,
      label: "Active voting stake",
      content: drepStat?.stake?.total ? (
        <AdaWithTooltip
          data={drepStat.stake.total}
          triggerClassName='font-semibold !text-2xl !text-text'
        />
      ) : (
        <p className='!text-2xl font-semibold !text-text'>-</p>
      ),
      footer: (
        <div className='flex flex-wrap'>
          {drepStat?.stake?.drep_always_abstain && (
            <div className='flex w-fit items-center gap-1/2 pr-4'>
              <span className='text-text-sm text-grayTextPrimary'>Abstain</span>
              <span className='text-text-sm text-grayTextPrimary'>
                <AdaWithTooltip data={drepStat?.stake?.drep_always_abstain} />
              </span>
            </div>
          )}
          {drepStat?.stake?.drep_always_no_confidence && (
            <div className='flex w-fit items-center gap-1/2 pr-4'>
              <span className='text-text-sm text-grayTextPrimary'>
                No confidence
              </span>
              <span className='text-text-sm text-grayTextPrimary'>
                <AdaWithTooltip
                  data={drepStat?.stake?.drep_always_no_confidence}
                />
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "delegators",
      icon: <Users className='text-primary' />,
      label: "Delegators",
      content: (
        <p className='text-display-xs font-semibold'>
          {drepAnalytics?.delegator?.total?.count
            ? formatNumber(drepAnalytics?.delegator?.total?.count)
            : "-"}
        </p>
      ),
      footer: (
        <div className='flex flex-wrap'>
          {drepAnalytics?.delegator?.drep_always_abstain?.count && (
            <div className='flex w-fit items-center gap-1/2 pr-4'>
              <span className='text-text-sm text-grayTextPrimary'>Abstain</span>
              <span className='text-text-sm text-grayTextPrimary'>
                {formatNumber(
                  drepAnalytics?.delegator?.drep_always_abstain?.count,
                )}
              </span>
            </div>
          )}
          {drepAnalytics?.delegator?.drep_always_no_confidence?.count && (
            <div className='flex w-fit items-center gap-1/2 pr-4'>
              <span className='text-text-sm text-grayTextPrimary'>
                No confidence
              </span>
              <span className='text-text-sm text-grayTextPrimary'>
                {drepAnalytics?.delegator?.drep_always_no_confidence?.count}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "retired_dreps",
      icon: <UserX className='text-primary' />,
      label: "Stake to retired DReps",
      content: stakeDrepRetired?.delegator?.stake ? (
        <AdaWithTooltip
          data={stakeDrepRetired.delegator.stake / 1e6}
          triggerClassName='font-semibold !text-2xl !text-text'
        />
      ) : (
        <p className='!text-2xl font-semibold !text-text'>-</p>
      ),
      footer: (
        <div className='flex flex-wrap gap-2'>
          <div className='flex items-center gap-1/2'>
            <span className='text-text-sm text-grayTextPrimary'>
              Delegations
            </span>
            <span className='text-text-sm font-medium text-grayTextPrimary'>
              {stakeDrepRetired?.delegator?.count ?? "-"}
            </span>
          </div>
          <div className='flex items-center gap-1/2'>
            <span className='text-text-sm text-grayTextPrimary'>
              Retired DReps
            </span>
            <span className='text-text-sm font-medium text-grayTextPrimary'>
              {stakeDrepRetired?.drep?.count ?? "-"}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageBase
      title='Delegated Representatives'
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        { label: "Delegated representatives" },
      ]}
      metadataTitle='drepList'
      adsCarousel={false}
    >
      <section className='mt-1 flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
          {drepAnalyticsQuery.isLoading ||
          drepStatQuery.isLoading ||
          drepAnalyticsQuery.isFetching ||
          drepStatQuery.isFetching ? (
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
            <Carousel
              plugins={[Autoplay({ delay: 4000 })]}
              className='w-full'
              opts={{ loop: true, align: "start" }}
            >
              <CarouselContent className='flex items-stretch overflow-visible'>
                {statCards.map(({ key, icon, label, content, footer }) => (
                  <CarouselItem
                    key={key}
                    className='flex h-full max-h-[150px] basis-full flex-col items-stretch md:basis-1/2 lg:basis-1/3'
                  >
                    <OverviewStatCard
                      icon={icon}
                      title={label}
                      value={content}
                      description={footer}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </section>
      <Tabs items={tabs} wrapperClassname='mt-0' />
    </PageBase>
  );
};
