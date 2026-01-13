import { HeaderBanner } from "@/components/global/HeaderBanner";
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
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useGovernanceThresholds } from "@/hooks/useGovernanceThresholds";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PowerThresholdsPage: FC = () => {
  const { t } = useAppTranslation("common");
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
        <title>{metadata.powerThresholds.title}</title>
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title={t("governance.powerThresholds.title")}
          breadcrumbItems={[
            {
              label: <span className='inline pt-1/2'>{t("gov.governance")}</span>,
              link: "/gov",
            },
            { label: t("governance.powerThresholds.breadcrumb") },
          ]}
        />

        <section className='flex min-h-minHeight w-full max-w-desktop flex-col gap-1 p-desktop'>
          <>
            <>
              <div className='rounded-l'>
                <AnalyticsGraph
                  title={t("governance.powerThresholds.delegationDistribution")}
                  description={t("governance.powerThresholds.delegationDistributionDesc")}
                >
                  <AnalyticsGraph
                    title={t("governance.powerThresholds.spoAttack")}
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
                    title={t("governance.powerThresholds.percentDelegatedToSPOs")}
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
                    title={t("governance.powerThresholds.percentDelegatedToDReps")}
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
                  <h2 className='text-text-xl font-bold'>
                    {t("governance.powerThresholds.governanceThresholds")}
                  </h2>
                  <p className='text-text-sm text-grayTextPrimary'>
                    {t("governance.powerThresholds.governanceThresholdsDesc")}
                  </p>
                </div>
              </div>

              {query.isLoading ? (
                <>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index}>
                      <div className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                        <LoadingSkeleton height='24px' width='50%' />
                      </div>
                      <LoadingSkeleton height='341px' />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesNoConfidence")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfMotionNoConfidenceProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesNewCCNormal")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfCommitteeNormalProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesNewCCNoConfidence")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfCommitteeNoConfidenceProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesUpdateConstitution")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfUpdateToConstitutionProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesHardFork")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfHardForkInitiationProps}
                    onlySecurity={true}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesTreasuryWithdrawal")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfTreasuryWithdrawalProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesEconomicParams")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPEconomicGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesTechnicalParams")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPTechnicalGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesNetworkParams")}
                  </h3>
                  <GovernanceThresholdsSection
                    thresholdProps={voteOfPPNetworkGroupProps}
                  />

                  <h3 className='mb-2 mt-3 p-3 text-text-md font-semibold'>
                    {t("governance.powerThresholds.minVotesGovParams")}
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
