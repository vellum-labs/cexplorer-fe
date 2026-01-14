import type { GovernanceActionDetailAboutListColumns } from "@/types/tableTypes";
import type { FC } from "react";

import ExportButton from "@/components/table/ExportButton";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { useFetchGovernanceVote } from "@/services/governance";
import { useGovActionDetailAboutTableStore } from "@/stores/tables/governanceDetailAboutTableStore";
import { useFilterTable } from "@/hooks/tables/useFilterTable";

import { governanceActionDetailAboutTableOptions } from "@/constants/tables/governanceActionDetailAboutTableOptions";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import { ExternalLink, Landmark, Route, User, X } from "lucide-react";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { GovVoterCell } from "@/components/gov/GovVoterCell";
import { VoteCell } from "@/components/governance/vote/VoteCell";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { isVoteLate } from "@/utils/governance/isVoteLate";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";

interface GovernanceDetailAboutTabProps {
  id: string;
}

export const GovernanceDetailAboutTab: FC<GovernanceDetailAboutTabProps> = ({
  id,
}) => {
  const { t } = useAppTranslation(["pages", "common"]);
  type VoterRole = "ConstitutionalCommittee" | "DRep" | "SPO";

  const voterRoleLabels: Record<VoterRole, string> = {
    ConstitutionalCommittee: t(
      "common:governance.voteDetail.constitutionalCommittee",
    ),
    DRep: t("common:labels.drep"),
    SPO: t("common:labels.spo"),
  };

  const { page } = useSearch({
    from: "/gov/action/$id",
  });

  const {
    columnsVisibility,
    columnsOrder,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useGovActionDetailAboutTableStore();

  const {
    filterVisibility,
    filter,
    hasFilter,
    anchorRefs,
    filterDraft,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey: "governance_detail_voted",
    filterKeys: ["voter_role", "vote"],
    tabName: "voted",
    onlyURL: ["voter_role", "vote"],
  });
  const [{ tableSearch, debouncedTableSearch }, setTableSearch] =
    useSearchTable();

  const govQuery = useFetchGovernanceVote(
    rows,
    (page ?? 1) * rows - rows,
    id,
    filter?.voter_role ? filter.voter_role : undefined,
    undefined,
    undefined,
    filter?.vote ? filter.vote : undefined,
    false,
    debouncedTableSearch ? debouncedTableSearch : undefined,
  );

  const columns = [
    {
      key: "date",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }

        return <DateCell time={item.tx.time} withoutConvert />;
      },
      title: t("common:labels.date"),
      visible: columnsVisibility.date,
      widthPx: 90,
    },
    {
      key: "voter",
      render: item => {
        const voterId = item?.info?.id;
        const role = item?.voter_role;

        if (!voterId) {
          return "-";
        }

        return (
          <GovVoterCell
            info={{
              id: voterId,
              meta: item?.info?.meta,
              ident: item?.info?.ident,
            }}
            role={role}
          />
        );
      },
      title: t("common:governance.voting.voter"),
      visible: columnsVisibility.voter,
      widthPx: 160,
    },
    {
      key: "voter_role",
      render: item => {
        if (!item?.voter_role) {
          return "-";
        }

        const role =
          item?.voter_role === "ConstitutionalCommittee"
            ? "CC"
            : item?.voter_role === "DRep"
              ? "DRep"
              : "SPO";

        return (
          <div className='relative flex h-[24px] w-fit items-center justify-end gap-1/2 rounded-m border border-border px-[6px]'>
            {role === "DRep" && <User className='text-primary' size={12} />}
            {role === "CC" && <Landmark className='text-primary' size={12} />}
            {role === "SPO" && <Route className='text-primary' size={12} />}
            <span className='text-text-xs font-medium'>{role}</span>
          </div>
        );
      },
      title: (
        <p ref={anchorRefs?.voter_role}>
          {t("common:governance.voting.voterRole")}
        </p>
      ),
      filter: {
        anchorRef: anchorRefs?.voter_role,
        activeFunnel: !!filter.voter_role,
        filterOpen: filterVisibility.voter_role,
        filterButtonDisabled: filter.voter_role
          ? filter.voter_role === filterDraft["voter_role"]
          : false,
        onShow: e => toggleFilter(e, "voter_role"),
        onFilter: () =>
          changeFilterByKey("voter_role", filterDraft["voter_role"]),
        onReset: () => changeFilterByKey("voter_role"),
        resetLabel: t("common:actions.reset"),
        filterLabel: t("common:actions.filter"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {(["ConstitutionalCommittee", "SPO", "DRep"] as VoterRole[]).map(
              val => (
                <label className='flex items-center gap-1' key={val}>
                  <input
                    type='radio'
                    name='status'
                    value={val}
                    className='accent-primary'
                    checked={filterDraft["voter_role"] === val}
                    onChange={e =>
                      changeDraftFilter("voter_role", e.currentTarget.value)
                    }
                  />
                  <span className='text-text-sm'>{voterRoleLabels[val]}</span>
                </label>
              ),
            )}
          </div>
        ),
      },
      visible: columnsVisibility.voter_role,
      widthPx: 90,
    },
    {
      key: "voting_power",
      render: item => {
        if (!item?.info?.power?.stake) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item?.info?.power?.stake} />
          </p>
        );
      },
      title: (
        <p className='w-full text-right'>
          {t("common:governance.voting.votingPower")}
        </p>
      ),
      visible: columnsVisibility.voting_power,
      widthPx: 90,
    },
    {
      key: "vote",
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        return (
          <VoteCell
            vote={item?.vote}
            txHash={item?.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
            isLate={isVoteLate(item)}
            anchorInfo={item?.anchor}
          />
        );
      },
      title: <p ref={anchorRefs?.vote}>{t("common:labels.vote")}</p>,
      filter: {
        anchorRef: anchorRefs?.vote,
        width: "170px",
        activeFunnel: !!filter.vote,
        filterOpen: filterVisibility.vote,
        filterButtonDisabled: filter.vote
          ? filter.vote === filterDraft["vote"]
          : false,
        onShow: e => toggleFilter(e, "vote"),
        onFilter: () => changeFilterByKey("vote", filterDraft["vote"]),
        onReset: () => changeFilterByKey("vote"),
        resetLabel: t("common:actions.reset"),
        filterLabel: t("common:actions.filter"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {[
              { value: "Yes", label: t("common:governance.common.yes") },
              { value: "No", label: t("common:governance.common.no") },
              {
                value: "Abstain",
                label: t("common:governance.common.abstain"),
              },
            ].map(({ value, label }) => (
              <label className='flex items-center gap-1' key={value}>
                <input
                  type='radio'
                  name='status'
                  value={value}
                  className='accent-primary'
                  checked={filterDraft["vote"] === value}
                  onChange={e =>
                    changeDraftFilter("vote", e.currentTarget.value)
                  }
                />
                <span className='text-text-sm'>{label}</span>
              </label>
            ))}
          </div>
        ),
      },
      visible: columnsVisibility.vote,
      widthPx: 90,
    },

    {
      key: "epoch",
      render: item => <EpochCell no={item?.tx?.epoch_no} />,
      title: (
        <p className='w-full text-right'>
          {t("common:governance.voting.epoch")}
        </p>
      ),
      visible: columnsVisibility.epoch,
      widthPx: 50,
    },
    {
      key: "block",
      render: item => {
        if (!item?.tx?.block_no) {
          return <p className='text-right'>-</p>;
        }

        return <BlockCell hash={item?.tx?.block_hash} no={item.tx.block_no} />;
      },
      title: (
        <p className='w-full text-right'>
          {t("common:governance.voting.block")}
        </p>
      ),
      visible: columnsVisibility.block,
      widthPx: 90,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.tx?.hash) {
          return "-";
        }

        return (
          <Link
            to='/tx/$hash'
            params={{
              hash: item.tx.hash,
            }}
            className='flex items-center justify-end text-primary'
          >
            <ExternalLink size={18} />
          </Link>
        );
      },
      title: <p className='w-full text-right'>{t("common:labels.tx")}</p>,
      visible: columnsVisibility.tx,
      widthPx: 90,
    },
  ];

  const totalItems = govQuery.data?.pages[0].data.count;
  const items = govQuery.data?.pages.flatMap(page => page.data.data);

  return (
    <>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {govQuery.isLoading || govQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems !== undefined ? (
            <h3 className='basis-[230px] text-nowrap'>
              {t("common:governance.voting.totalVotes", {
                count: formatNumber(totalItems),
              })}
            </h3>
          ) : (
            ""
          )}

          <div className='flex w-full justify-end md:hidden'>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                rowsLabel={t("common:table.rows")}
                columnsOptions={governanceActionDetailAboutTableOptions.map(
                  item => {
                    return {
                      label: t(`common:tableSettings.${item.key}`),
                      isVisible: columnsVisibility[item.key],
                      onClick: () =>
                        setColumnVisibility(
                          item.key,
                          !columnsVisibility[item.key],
                        ),
                    };
                  },
                )}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder={t("common:governance.voting.searchPlaceholder")}
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={governanceActionDetailAboutTableOptions.map(
                item => {
                  return {
                    label: t(`common:tableSettings.${item.key}`),
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                },
              )}
            />
          </div>
        </div>
      </div>
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  <span>
                    {key[0].toUpperCase() + key.split("_").join(" ").slice(1)}:
                  </span>
                  <span>
                    {key === "voter_role" && value in voterRoleLabels
                      ? voterRoleLabels[value as VoterRole]
                      : value[0].toUpperCase() + value.slice(1).toLowerCase()}
                  </span>
                  <X
                    size={13}
                    className='cursor-pointer'
                    onClick={() => changeFilterByKey(key)}
                  />
                </div>
              ),
          )}
        </div>
      )}
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        rowHeight={67}
        minContentWidth={1100}
        scrollable
        query={govQuery}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(
              a.key as keyof GovernanceActionDetailAboutListColumns,
            ) -
            columnsOrder.indexOf(
              b.key as keyof GovernanceActionDetailAboutListColumns,
            )
          );
        })}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("common:table.displaying", { count, total })
        }
        noItemsLabel={t("common:table.noItems")}
      />
    </>
  );
};
