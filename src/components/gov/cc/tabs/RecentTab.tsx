import type { FC } from "react";
import { useSearch } from "@tanstack/react-router";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useRecentVotesTableStore } from "@/stores/tables/recentVotesTableStore";
import { useFetchCCVotes } from "@/services/governance";
import { formatString, formatNumber } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { isHex } from "@/utils/isHex";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { GovActionCell } from "../../GovActionCell";
import { VoteCell } from "@/components/governance/vote/VoteCell";
import { GovVoterCell } from "../../GovVoterCell";
import { GovernanceRole } from "@/types/governanceTypes";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { isVoteLate } from "@/utils/governance/isVoteLate";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const RecentTab: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { page = 1 } = useSearch({ from: "/gov/cc/" });

  const {
    columnsVisibility,
    columnsOrder,
    rows,
    setRows,
    setColumsOrder,
    setColumnVisibility,
  } = useRecentVotesTableStore()();

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
    storeKey: "recent_votes",
    filterKeys: ["vote"],
  });

  const [
    { debouncedTableSearch: debouncedSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["committee_voter", "tx_hash"],
  });

  const offset = (page ?? 1) * rows - rows;
  const query = useFetchCCVotes(
    rows,
    offset,
    filter?.vote ? filter.vote : undefined,
    searchPrefix === "committee_voter" ? debouncedSearch : undefined,
    searchPrefix === "tx" ? debouncedSearch : undefined,
  );

  const totalItems = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);

  const columns = [
    {
      key: "index",
      title: "#",
      standByRanking: true,
      widthPx: 40,
      visible: columnsVisibility.index,
      render: () => undefined,
    },
    {
      key: "proposal",
      title: t("gov.cc.governanceAction"),
      widthPx: 150,
      visible: columnsVisibility.proposal,
      render: item => {
        const type = item.proposal?.type;
        return type ? (
          <ActionTypes title={type} />
        ) : (
          <span className='text-grayTextSecondary'>N/A</span>
        );
      },
    },
    {
      key: "governance_action_name",
      title: t("gov.cc.name"),
      widthPx: 220,
      visible: columnsVisibility.governance_action_name ?? true,
      render: item => {
        const id = item?.proposal?.ident?.id;
        const name =
          item?.proposal?.anchor?.offchain?.name ?? "⚠️ Invalid metadata";

        if (!id) return "-";

        return <GovActionCell id={id} name={name} />;
      },
    },
    {
      key: "cc_member",
      title: t("gov.cc.ccMember"),
      widthPx: 220,
      visible: columnsVisibility.cc_member,
      render: item => {
        const voterId = item?.info?.id;

        if (!voterId) {
          return "-";
        }

        return (
          <GovVoterCell
            role={GovernanceRole.ConstitutionalCommittee}
            info={{
              id: voterId,
              meta: item?.info?.meta,
              ident: item?.info?.ident,
            }}
          />
        );
      },
    },
    {
      key: "vote",
      title: <p ref={anchorRefs?.vote}>{t("gov.cc.vote")}</p>,
      widthPx: 130,
      visible: columnsVisibility.vote,
      render: item => {
        const vote = item.vote;
        return (
          <VoteCell
            vote={vote}
            txHash={item?.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
            anchorInfo={item?.anchor}
            isLate={isVoteLate(item)}
          />
        );
      },
      filter: {
        anchorRef: anchorRefs?.vote,
        width: "170px",
        activeFunnel: !!filter.vote,
        filterOpen: filterVisibility.vote,
        filterButtonDisabled: filter.vote === filterDraft["vote"],
        onShow: e => toggleFilter(e, "vote"),
        onFilter: () => changeFilterByKey("vote", filterDraft["vote"]),
        onReset: () => changeFilterByKey("vote"),
        resetLabel: t("common:actions.reset"),
        filterLabel: t("common:actions.filter"),
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {["Yes", "No", "Abstain"].map(val => (
              <label className='flex items-center gap-1' key={val}>
                <input
                  type='radio'
                  name='vote_filter'
                  value={val}
                  className='accent-primary'
                  checked={filterDraft["vote"] === val}
                  onChange={e =>
                    changeDraftFilter("vote", e.currentTarget.value)
                  }
                />
                <span className='text-text-sm'>
                  {t(`common:gov.cc.${val.toLowerCase()}`)}
                </span>
              </label>
            ))}
          </div>
        ),
      },
    },
    {
      key: "tx",
      title: t("gov.cc.txHash"),
      widthPx: 200,
      visible: columnsVisibility.tx,
      render: item => {
        const hash = item.tx?.hash ?? "N/A";
        return hash !== "N/A" ? (
          <div className='flex gap-1'>
            <Link to='/tx/$hash' params={{ hash }} className='text-primary'>
              {formatString(hash, "long")}
            </Link>
            <Copy copyText={hash} />
          </div>
        ) : (
          <span className='text-grayTextSecondary'>N/A</span>
        );
      },
    },
    {
      key: "time",
      title: t("gov.cc.time"),
      widthPx: 180,
      visible: columnsVisibility.time,
      render: item => <TimeDateIndicator time={item.tx?.time} />,
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col pb-3'>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full items-center justify-between gap-1'>
          {query.isLoading ? (
            <LoadingSkeleton height='27px' width='220px' />
          ) : (
            <h3 className='basis-[230px]'>
              {t("gov.cc.totalVotes", { count: formatNumber(totalItems) })}
            </h3>
          )}
          <div className='flex items-center gap-1 md:hidden'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={columns.map(col => ({
                label: col.title,
                isVisible: columnsVisibility[col.key],
                onClick: () =>
                  setColumnVisibility(
                    col.key as keyof typeof columnsVisibility,
                    !columnsVisibility[
                      col.key as keyof typeof columnsVisibility
                    ],
                  ),
              }))}
            />
          </div>
        </div>

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder={t("gov.cc.searchResults")}
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full'
            showSearchIcon
            prefixes={[
              {
                key: "committee_voter",
                name: t("gov.cc.ccMember"),
                show: tableSearch.length < 1 || isHex(tableSearch),
              },
              {
                key: "tx_hash",
                name: t("gov.cc.txHash"),
                show: tableSearch.length < 1 || isHex(tableSearch),
              },
            ]}
            searchPrefix={searchPrefix}
            setSearchPrefix={setSearchPrefix}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={columns.map(col => ({
                label: col.title,
                isVisible: columnsVisibility[col.key],
                onClick: () =>
                  setColumnVisibility(
                    col.key as keyof typeof columnsVisibility,
                    !columnsVisibility[
                      col.key as keyof typeof columnsVisibility
                    ],
                  ),
              }))}
            />
          </div>
        </div>
      </div>
      {hasFilter && (
        <div className='mb-1.5 flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                >
                  <span>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, " ")}
                    :
                  </span>
                  <span className='capitalize'>{value.toLowerCase()}</span>
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
        scrollable
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        items={items}
        query={query}
        rowHeight={65}
        minContentWidth={1300}
        columns={columns.sort(
          (a, b) =>
            columnsOrder.indexOf(a.key as keyof typeof columnsVisibility) -
            columnsOrder.indexOf(b.key as keyof typeof columnsVisibility),
        )}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("common:table.displaying", { count, total })
        }
        noItemsLabel={t("common:table.noItems")}
      />
    </section>
  );
};
