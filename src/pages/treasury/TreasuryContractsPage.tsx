import { useState, useMemo } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  GlobalTable,
  TableSearchInput,
  TableSettingsDropdown,
  LoadingSkeleton,
  formatNumber,
  formatString,
  Tooltip,
} from "@vellumlabs/cexplorer-sdk";
import { ContractStatusBadge } from "@/components/treasury/ContractStatusBadge";
import { ContractMilestonesBadge } from "@/components/treasury/ContractMilestonesBadge";
import { TreasuryOverviewCards } from "@/components/treasury/TreasuryOverviewCards";
import {
  useFetchVendorContractsInfinite,
  type VendorContract,
} from "@/services/vendorContracts";
import { intersectMboApiUrl } from "@/constants/confVariables";
import { Link, useSearch } from "@tanstack/react-router";
import { useTreasuryContractsTableStore } from "@/stores/tables/treasuryContractsTableStore";
import type { TreasuryContractsColumns } from "@/types/tableTypes";

const treasuryContractsTableOptions: { key: keyof TreasuryContractsColumns }[] =
  [
    { key: "project" },
    { key: "vendor" },
    { key: "budget" },
    { key: "milestones" },
    { key: "status" },
  ];

const getVendorDisplay = (contract: VendorContract) => {
  if (contract.vendor_address?.startsWith("addr")) {
    return { type: "address" as const, value: contract.vendor_address };
  }
  if (contract.vendor_address) {
    return { type: "text" as const, value: contract.vendor_address };
  }
  if (contract.vendor_name) {
    return { type: "text" as const, value: contract.vendor_name };
  }
  return { type: "text" as const, value: "-" };
};

export const TreasuryContractsPage = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const searchParams = useSearch({ from: "/treasury/contracts/" });

  const [search, setSearch] = useState("");

  const {
    columnsVisibility,
    setColumnVisibility,
    rows,
    setRows,
    columnsOrder,
    setColumnsOrder,
  } = useTreasuryContractsTableStore()();

  const page = (searchParams as { page?: number }).page || 1;

  const query = useFetchVendorContractsInfinite({
    page,
    limit: rows,
    search: search || undefined,
  });

  const contracts = query.data?.pages.flatMap(p => p.data) || [];
  const totalCount = query.data?.pages[0]?.pagination?.total_count || 0;

  const columns = useMemo(
    () => [
      {
        key: "project",
        title: t("treasury.contracts.columns.project", "Project"),
        visible: columnsVisibility.project,
        widthPx: 420,
        render: (item: VendorContract) => (
          <Link
            to='/treasury/contracts/$id'
            params={{ id: item.project_id }}
            className='line-clamp-2 text-primary'
          >
            {item.project_name}
          </Link>
        ),
      },
      {
        key: "vendor",
        title: t("treasury.contracts.columns.vendor", "Vendor"),
        visible: columnsVisibility.vendor,
        widthPx: 120,
        render: (item: VendorContract) => {
          const vendor = getVendorDisplay(item);
          if (vendor.type === "address") {
            return (
              <Link
                to='/address/$address'
                params={{ address: vendor.value }}
                className='text-primary'
              >
                {formatString(vendor.value, "short")}
              </Link>
            );
          }
          const isLongText = vendor.value.length > 15;
          const content = (
            <span className='block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-text'>
              {vendor.value}
            </span>
          );
          if (isLongText) {
            return <Tooltip content={vendor.value}>{content}</Tooltip>;
          }
          return content;
        },
      },
      {
        key: "budget",
        title: t("treasury.contracts.columns.budget", "Budget"),
        visible: columnsVisibility.budget,
        widthPx: 90,
        render: (item: VendorContract) => (
          <span className='font-medium'>
            ₳{formatNumber(item.initial_amount_ada)}
          </span>
        ),
      },
      {
        key: "milestones",
        title: <span className='flex w-full justify-center'>{t("treasury.contracts.columns.milestones", "Milestones")}</span>,
        visible: columnsVisibility.milestones,
        widthPx: 125,
        render: (item: VendorContract) => (
          <div className='flex w-full justify-center'>
            <ContractMilestonesBadge
              total={item.milestones_summary.total}
              completed={item.milestones_summary.completed}
              pending={item.milestones_summary.pending}
              labels={{
                allClaimed: t(
                  "treasury.contracts.milestones.allClaimed",
                  "All claimed",
                ),
                claimable: t(
                  "treasury.contracts.milestones.claimable",
                  "Claimable",
                ),
                none: t("treasury.contracts.milestones.none", "None"),
              }}
            />
          </div>
        ),
      },
      {
        key: "status",
        title: <span className='flex w-full justify-center'>{t("treasury.contracts.columns.stage", "Stage")}</span>,
        visible: columnsVisibility.status,
        widthPx: 125,
        render: (item: VendorContract) => (
          <div className='flex w-full justify-center'>
            <ContractStatusBadge
              status={item.status}
              labels={{
                completed: t("treasury.contracts.status.completed", "Completed"),
                active: t("treasury.contracts.status.inProgress", "In Progress"),
                paused: t("treasury.contracts.status.paused", "Paused"),
                cancelled: t("treasury.contracts.status.cancelled", "Cancelled"),
                pending_approval: t(
                  "treasury.contracts.status.pendingApproval",
                  "Pending Approval",
                ),
              }}
            />
          </div>
        ),
      },
    ],
    [t, columnsVisibility],
  );

  return (
    <PageBase
      metadataOverride={{
        title: t("treasury.contracts.title", "Treasury Contracts"),
      }}
      title={t("treasury.contracts.title", "Treasury Contracts")}
      breadcrumbItems={[
        { label: t("treasury.title", "Treasury"), link: "/treasury" },
        { label: t("treasury.contracts.breadcrumb", "Contracts") },
      ]}
      adsCarousel={false}
    >
      <section className='flex w-full min-w-0 max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {!intersectMboApiUrl ? (
          <div className='rounded-l border border-border bg-cardBg p-4 text-center'>
            <p className='text-grayTextPrimary'>
              {t(
                "treasury.contracts.notAvailable",
                "Treasury contracts are only available on mainnet.",
              )}
            </p>
          </div>
        ) : (
          <>
            <TreasuryOverviewCards
              labels={{
                budget: {
                  title: t(
                    "treasury.contracts.overview.budget.title",
                    "Budget",
                  ),
                  description: t(
                    "treasury.contracts.overview.budget.description",
                    "The Intersect Treasury Contracts budget. These funds are used to pay the vendors as they reach project milestones.",
                  ),
                  currency: t(
                    "treasury.contracts.overview.budget.currency",
                    "Currency",
                  ),
                  budgetLabel: t(
                    "treasury.contracts.overview.budget.budgetLabel",
                    "Budget",
                  ),
                  totalSpent: t(
                    "treasury.contracts.overview.budget.totalSpent",
                    "Total Spent",
                  ),
                  remainingBudget: t(
                    "treasury.contracts.overview.budget.remainingBudget",
                    "Remaining Budget",
                  ),
                },
                statistics: {
                  title: t(
                    "treasury.contracts.overview.statistics.title",
                    "Statistics",
                  ),
                  totalDistributed: t(
                    "treasury.contracts.overview.statistics.totalDistributed",
                    "Total distributed",
                  ),
                  completedProjects: t(
                    "treasury.contracts.overview.statistics.completedProjects",
                    "Completed projects",
                  ),
                  completedMilestones: t(
                    "treasury.contracts.overview.statistics.completedMilestones",
                    "Completed milestones",
                  ),
                  lastUpdate: t(
                    "treasury.contracts.overview.statistics.lastUpdate",
                    "Last update",
                  ),
                },
              }}
            />

            <div className='mb-1 flex w-full flex-col justify-between gap-1 min-[870px]:flex-row min-[870px]:items-center'>
              <div className='flex items-center gap-1'>
                {query.isLoading || query.isFetching ? (
                  <LoadingSkeleton height='27px' width='220px' />
                ) : (
                  <h3 className='text-nowrap'>
                    {formatNumber(totalCount)}{" "}
                    {t(
                      "treasury.contracts.vendorContracts",
                      "vendor contracts",
                    )}
                  </h3>
                )}
              </div>

              <div className='flex gap-1'>
                <TableSearchInput
                  placeholder={t(
                    "treasury.contracts.searchPlaceholder",
                    "Search by project",
                  )}
                  value={search}
                  onchange={setSearch}
                  wrapperClassName='min-[870px]:w-[320px] w-full'
                  showSearchIcon
                  showPrefixPopup={false}
                />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  rowsLabel={t("common:table.rows", "Rows")}
                  columnsOptions={treasuryContractsTableOptions.map(item => ({
                    label: t(
                      `treasury.contracts.columns.${item.key}`,
                      item.key,
                    ),
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  }))}
                />
              </div>
            </div>

            <GlobalTable
              type='infinite'
              currentPage={page}
              totalItems={totalCount}
              itemsPerPage={rows}
              scrollable
              query={query}
              minContentWidth={880}
              items={contracts}
              columns={columns.sort((a, b) => {
                return (
                  columnsOrder.indexOf(
                    a.key as keyof TreasuryContractsColumns,
                  ) -
                  columnsOrder.indexOf(b.key as keyof TreasuryContractsColumns)
                );
              })}
              onOrderChange={setColumnsOrder}
              renderDisplayText={(count, total) =>
                t("common:table.displaying", { count, total })
              }
              noItemsLabel={t("common:table.noItems", "No items found")}
            />
          </>
        )}
      </section>
    </PageBase>
  );
};
