import type { FC } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useParams } from "@tanstack/react-router";
import {
  useFetchVendorContractDetail,
  useFetchVendorContractMilestones,
} from "@/services/vendorContracts";
import { formatString, LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { ContractDetailOverview } from "@/components/treasury/ContractDetailOverview";
import { MilestoneOverview } from "@/components/treasury/MilestoneOverview";
import { MilestonePaymentsTable } from "@/components/treasury/MilestonePaymentsTable";
import { intersectMboApiUrl } from "@/constants/confVariables";

export const TreasuryContractDetailPage: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { id } = useParams({
    from: "/treasury/contracts/$id",
  });

  const detailQuery = useFetchVendorContractDetail(id);
  const milestonesQuery = useFetchVendorContractMilestones(id);

  const contract = detailQuery.data?.data;
  const milestones = milestonesQuery.data?.data || [];

  if (!intersectMboApiUrl) {
    return (
      <PageBase
        metadataOverride={{
          title: t("treasury.contractDetail.title", "Contract Detail"),
        }}
        title={t("treasury.contractDetail.title", "Contract Detail")}
        breadcrumbItems={[
          { label: t("treasury.title", "Treasury"), link: "/treasury" },
          {
            label: t("treasury.contracts.breadcrumb", "Contracts"),
            link: "/treasury/contracts",
          },
          { label: t("treasury.contractDetail.breadcrumb", "Detail") },
        ]}
        adsCarousel={false}
      >
        <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
          <div className='rounded-l border border-border bg-cardBg p-4 text-center'>
            <p className='text-grayTextPrimary'>
              {t(
                "treasury.contracts.notAvailable",
                "Treasury contracts are only available on mainnet.",
              )}
            </p>
          </div>
        </section>
      </PageBase>
    );
  }

  const isLoading = detailQuery.isLoading || milestonesQuery.isLoading;

  return (
    <PageBase
      metadataOverride={{
        title: contract?.project_name || t("treasury.contractDetail.title", "Contract Detail"),
      }}
      title={
        isLoading ? (
          <LoadingSkeleton height='28px' width='300px' />
        ) : (
          contract?.project_name || t("treasury.contractDetail.title", "Contract Detail")
        )
      }
      breadcrumbItems={[
        { label: t("treasury.title", "Treasury"), link: "/treasury" },
        {
          label: t("treasury.contracts.breadcrumb", "Contracts"),
          link: "/treasury/contracts",
        },
        {
          label: isLoading ? (
            <LoadingSkeleton height='16px' width='80px' />
          ) : (
            formatString(contract?.project_id || id, "short")
          ),
        },
      ]}
      adsCarousel={false}
    >
      <section className='flex w-full max-w-desktop flex-col gap-2 px-mobile pb-3 md:px-desktop'>
        <ContractDetailOverview
          contract={contract}
          isLoading={isLoading}
          labels={{
            details: {
              title: t("treasury.contractDetail.details.title", "Details"),
              projectId: t(
                "treasury.contractDetail.details.projectId",
                "Project ID",
              ),
              vendor: t("treasury.contractDetail.details.vendor", "Vendor"),
              contractAddress: t(
                "treasury.contractDetail.details.contractAddress",
                "Contract Address",
              ),
              fundingTx: t(
                "treasury.contractDetail.details.fundingTx",
                "Funding Transaction",
              ),
              fundDate: t(
                "treasury.contractDetail.details.fundDate",
                "Fund Date",
              ),
              initialAmount: t(
                "treasury.contractDetail.details.initialAmount",
                "Initial Amount",
              ),
              status: t("treasury.contractDetail.details.status", "Status"),
            },
            description: {
              title: t(
                "treasury.contractDetail.description.title",
                "Contract Description",
              ),
              noDescription: t(
                "treasury.contractDetail.description.noDescription",
                "No description available.",
              ),
              contractUrl: t(
                "treasury.contractDetail.description.contractUrl",
                "Contract URL",
              ),
            },
            statusLabels: {
              completed: t("treasury.contracts.status.completed", "Completed"),
              active: t("treasury.contracts.status.inProgress", "In Progress"),
              paused: t("treasury.contracts.status.paused", "Paused"),
              cancelled: t("treasury.contracts.status.cancelled", "Cancelled"),
              pending_approval: t(
                "treasury.contracts.status.pendingApproval",
                "Pending Approval",
              ),
            },
          }}
        />

        <MilestoneOverview
          milestones={milestones}
          isLoading={milestonesQuery.isLoading}
          labels={{
            title: t(
              "treasury.contractDetail.milestones.title",
              "Milestone Overview",
            ),
            noMilestones: t(
              "treasury.contractDetail.milestones.noMilestones",
              "No milestones found.",
            ),
            amount: t(
              "treasury.contractDetail.milestones.amount",
              "Amount",
            ),
            status: t(
              "treasury.contractDetail.milestones.status",
              "Status",
            ),
            completedAt: t(
              "treasury.contractDetail.milestones.completedAt",
              "Completed At",
            ),
            withdrawnAt: t(
              "treasury.contractDetail.milestones.withdrawnAt",
              "Withdrawn At",
            ),
            description: t(
              "treasury.contractDetail.milestones.description",
              "Description",
            ),
            statusLabels: {
              pending: t(
                "treasury.contractDetail.milestones.statusLabels.pending",
                "Pending",
              ),
              completed: t(
                "treasury.contractDetail.milestones.statusLabels.completed",
                "Completed",
              ),
              withdrawn: t(
                "treasury.contractDetail.milestones.statusLabels.withdrawn",
                "Withdrawn",
              ),
            },
          }}
        />

        <MilestonePaymentsTable
          projectId={id}
          labels={{
            title: t(
              "treasury.contractDetail.payments.title",
              "Milestone Payments",
            ),
            columns: {
              milestone: t(
                "treasury.contractDetail.payments.columns.milestone",
                "Milestone",
              ),
              event: t(
                "treasury.contractDetail.payments.columns.event",
                "Event",
              ),
              amount: t(
                "treasury.contractDetail.payments.columns.amount",
                "Amount",
              ),
              transaction: t(
                "treasury.contractDetail.payments.columns.transaction",
                "Transaction",
              ),
              date: t(
                "treasury.contractDetail.payments.columns.date",
                "Date",
              ),
            },
            noPayments: t(
              "treasury.contractDetail.payments.noPayments",
              "No payments found.",
            ),
            rowsLabel: t("common:table.rows", "Rows"),
            eventTypes: {
              initialize: t(
                "treasury.contractDetail.payments.eventTypes.initialize",
                "Initialize",
              ),
              withdraw: t(
                "treasury.contractDetail.payments.eventTypes.withdraw",
                "Withdraw",
              ),
              resume: t(
                "treasury.contractDetail.payments.eventTypes.resume",
                "Resume",
              ),
              disburse: t(
                "treasury.contractDetail.payments.eventTypes.disburse",
                "Disburse",
              ),
              publish: t(
                "treasury.contractDetail.payments.eventTypes.publish",
                "Publish",
              ),
              complete: t(
                "treasury.contractDetail.payments.eventTypes.complete",
                "Complete",
              ),
              pause: t(
                "treasury.contractDetail.payments.eventTypes.pause",
                "Pause",
              ),
              fund: t(
                "treasury.contractDetail.payments.eventTypes.fund",
                "Fund",
              ),
            },
            expandedDetails: {
              description: t(
                "treasury.contractDetail.payments.expandedDetails.description",
                "Description",
              ),
              evidenceSubmission: t(
                "treasury.contractDetail.payments.expandedDetails.evidenceSubmission",
                "Evidence Submission",
              ),
              open: t(
                "treasury.contractDetail.payments.expandedDetails.open",
                "Open",
              ),
            },
            displayingText: (count, total) =>
              t("common:table.displaying", { count, total }),
          }}
        />
      </section>
    </PageBase>
  );
};
