import { HeaderBanner } from "@/components/global/HeaderBanner";
import { webUrl } from "@/constants/confVariables";
import type { FC } from "react";
import metadata from "../../../conf/metadata/en-metadata.json";

import { Helmet } from "react-helmet";
import { AnalyticsGraph } from "@/components/analytics/AnalyticsGraph";
import { PowerThresholdsSPODelegationDonutGraph } from "@/components/governance/powerTresholds/PowerThresholdsSPODelegationDonutGraph";
import { DelegatedAdaOverTimeGraph } from "@/components/governance/powerTresholds/SPODelegationByEpochGraph";
import { PowerThresholdsDRepDelegationDonutGraph } from "@/components/governance/powerTresholds/PowerThresholdsDRepDelegationDonutGraph";
import { DelegatedAdaToDRepsOverTimeGraph } from "@/components/governance/powerTresholds/DelegatedAdaToDRepsOverTimeGraph";
import { GovernanceThresholdsSection } from "@/components/governance/powerTresholds/GovernanceThresholdsSection";
import { PowerThresholdsSPOAttackGraph } from "@/components/governance/powerTresholds/PowerThresholdsSPOAttackGraph";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { useGovernanceThresholds } from "@/hooks/useGovernanceThresholds";

export const PowerThresholdsPage: FC = () => {
  const {
    miscConst,
    query,
    poolList,
    voteOfMotionNoConfidenceProps,
    voteOfCommitteeNormalProps,
    voteOfCommitteeNoConfidenceProps,
    voteOfUpdateToConstitutionProps,
    voteOfHardForkInitiationProps,
    voteOfTreasuryWithdrawalProps,
    voteOfPPEconomicGroupProps,
    voteOfPPTechnicalGroupProps,
    voteOfPPNetworkGroupProps,
    voteOfPPGovGroupProps,
  } = useGovernanceThresholds();

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{metadata.powerThresholds.title}</title>
        <meta
          name='description'
          content={metadata.powerThresholds.description}
        />
        <meta name='keywords' content={metadata.powerThresholds.keywords} />
        <meta property='og:title' content={metadata.powerThresholds.title} />
        <meta
          property='og:description'
          content={metadata.powerThresholds.description}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title='Power Thresholds'
          breadcrumbItems={[
            {
              label: <span className='inline pt-1/2'>Governance</span>,
              link: "/gov",
            },
            { label: "Power thresholds" },
          ]}
        />

        <section className='flex min-h-minHeight w-full max-w-desktop flex-col gap-1 p-desktop'>
          <>
            <>
              <div className='rounded-l'>
                <AnalyticsGraph
                  title='Delegation Distribution'
                  description='Amount of ADA delegated to stake pools and dReps.'
                >
                  <AnalyticsGraph
                    title='Number of SPOs Capable of Performing a 51% Attack'
                    className='border-none px-0'
                  >
                    {query.isLoading ? (
                      <LoadingSkeleton height='120px' />
                    ) : (
                      <PowerThresholdsSPOAttackGraph
                        poolList={poolList}
                        liveStake={miscConst?.live_stake ?? 0}
                      />
                    )}
                  </AnalyticsGraph>

                  <AnalyticsGraph
                    title='Percent of Circulating ADA Delegated to SPOs'
                    exportButton
                    className='border-none px-0'
                  >
                    {query.isLoading ? (
                      <div className='flex flex-col gap-1.5 md:flex-row'>
                        <LoadingSkeleton height='490px' />
                      </div>
                    ) : (
                      <div className='flex flex-col gap-1.5 md:flex-row'>
                        <div className='flex flex-col justify-center border-none md:w-1/4'>
                          <PowerThresholdsSPODelegationDonutGraph
                            milestone={
                              query.data?.data?.analytics_milestone as any
                            }
                            isLoading={query.isLoading}
                            currentSupplyEpoch={
                              miscConst?.circulating_supply ?? 0
                            }
                          />
                        </div>
                        <div className='border-none md:w-3/4'>
                          <DelegatedAdaOverTimeGraph
                            milestone={
                              query.data?.data?.analytics_milestone as any
                            }
                            isLoading={query.isLoading}
                            currentSupplyEpoch={
                              miscConst?.circulating_supply ?? 0
                            }
                          />
                        </div>
                      </div>
                    )}
                  </AnalyticsGraph>

                  <AnalyticsGraph
                    title='Percent of Circulating ADA Delegated to DReps'
                    exportButton
                    className='border-none px-0'
                  >
                    {query.isLoading ? (
                      <div className='flex flex-col gap-1.5 md:flex-row'>
                        <LoadingSkeleton height='490px' />
                      </div>
                    ) : (
                      <div className='flex flex-col gap-1.5 md:flex-row'>
                        <div className='flex flex-col justify-center border-none md:w-1/4'>
                          <PowerThresholdsDRepDelegationDonutGraph
                            milestone={
                              query.data?.data?.analytics_milestone as any
                            }
                            isLoading={query.isLoading}
                            currentSupplyEpoch={
                              miscConst?.circulating_supply ?? 0
                            }
                          />
                        </div>
                        <div className='border-none md:w-3/4'>
                          <DelegatedAdaToDRepsOverTimeGraph
                            milestone={
                              query.data?.data?.analytics_milestone as any
                            }
                            isLoading={query.isLoading}
                            currentSupplyEpoch={
                              miscConst?.circulating_supply ?? 0
                            }
                          />
                        </div>
                      </div>
                    )}
                  </AnalyticsGraph>
                </AnalyticsGraph>
              </div>
            </>

            <div className='rounded-l border border-border'>
              <div className='flex items-center justify-between p-3'>
                <div>
                  <h2 className='text-xl font-bold'>Governance Thresholds</h2>
                  <p className='text-sm text-grayTextPrimary'>
                    Number of minimum votes needed for approving governance
                    actions by type (includes all DReps).
                  </p>
                </div>
              </div>

              {query.isLoading ? (
                <>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index}>
                      <div className='mb-2 mt-3 p-3 text-base font-semibold'>
                        <LoadingSkeleton height='24px' width='50%' />
                      </div>
                      <LoadingSkeleton height='341px' />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Pass a Vote of No Confidence
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfMotionNoConfidenceProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Elect a New Constitutional Committee
                    (Normal State)
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfCommitteeNormalProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Elect a New Constitutional Committee
                    (No Confidence State)
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfCommitteeNoConfidenceProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Update the Cardano Constitution
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfUpdateToConstitutionProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Initiate a Hard Fork
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfHardForkInitiationProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Withdraw Funds from the Cardano
                    Treasury
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfTreasuryWithdrawalProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Change Economic Parameters
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPEconomicGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Change Network Technical Parameters
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPTechnicalGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Change Network Parameters
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPNetworkGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-base font-semibold'>
                    Minimum Votes Needed to Change Governance Parameter
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPGovGroupProps}
                  />
                </>
              )}
            </div>
          </>
        </section>
      </main>
    </>
  );
};
