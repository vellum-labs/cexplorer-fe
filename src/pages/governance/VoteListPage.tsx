import { type FC } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { ExternalLink, Landmark, Route, User, X } from "lucide-react";
import ExportButton from "@/components/table/ExportButton";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import GlobalTable from "@/components/table/GlobalTable";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import DateCell from "@/components/table/DateCell";

import { useFetchNewVotes } from "@/services/governance";
import { useVoteListPageTableStore } from "@/stores/tables/VoteListPageTableStore";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { voteListPageTableOptions } from "@/constants/tables/voteListPageTableOptions";
import { formatNumber } from "@/utils/format/format";
import { isHex } from "@/utils/isHex";
import { PageBase } from "@/components/global/pages/PageBase";
import { GovVoterCell } from "@/components/gov/GovVoterCell";
import { GovActionCell } from "@/components/gov/GovActionCell";
import type { Vote } from "@/constants/votes";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { VoteCell } from "@/components/governance/vote/VoteCell";

interface VoteListPageProps {
  poolId?: string;
}

export const VoteListPage: FC<VoteListPageProps> = ({ poolId }) => {
  const { page } = useSearch({
    from: poolId ? "/pool/$id" : "/gov/vote/",
  });

  const {
    columnsVisibility,
    columnsOrder,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useVoteListPageTableStore();

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
    storeKey: "vote_list",
    filterKeys: ["voter_role", "vote"],
  });

  const [
    { debouncedTableSearch: debouncedSearch, tableSearch, searchPrefix },
    setTableSearch,
    setSearchPrefix,
  ] = useSearchTable({
    debounceFilter: tableSearch =>
      tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    validPrefixes: ["tx", "gov_action_proposal", "voter_id"],
  });

  type VoterRole = "ConstitutionalCommittee" | "DRep" | "SPO";
  const voterRole =
    filter?.voter_role &&
    ["ConstitutionalCommittee", "DRep", "SPO"].includes(filter.voter_role)
      ? (filter.voter_role as VoterRole)
      : undefined;

  type VoteFilterOption = "All" | "Yes" | "No" | "Abstain";
  const vote =
    filter?.vote && ["All", "Yes", "No", "Abstain"].includes(filter?.vote)
      ? (filter.vote as VoteFilterOption)
      : undefined;

  const votesQuery = useFetchNewVotes(
    rows,
    (page ?? 1) * rows - rows,
    voterRole,
    vote,
    searchPrefix === "tx" ? debouncedSearch : undefined,
    searchPrefix === "gov_action_proposal" ? debouncedSearch : undefined,
    searchPrefix === "voter_id" && debouncedSearch.startsWith("drep1")
      ? debouncedSearch
      : undefined,
    poolId
      ? poolId
      : searchPrefix === "voter_id" && debouncedSearch.startsWith("pool1")
        ? debouncedSearch
        : undefined,
    searchPrefix === "voter_id" &&
      (debouncedSearch.startsWith("addr") || isHex(debouncedSearch))
      ? debouncedSearch
      : undefined,
  );

  const columns = [
    {
      key: "date",
      render: item => {
        if (!item?.tx?.time) {
          return "-";
        }
        return <DateCell time={item.tx.time} />;
      },
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 60,
    },
    {
      key: "gov_action",
      render: item => {
        const id = item?.proposal?.ident?.id;
        const name =
          item?.proposal?.anchor?.offchain?.name ?? "⚠️ Invalid metadata";

        if (!id) {
          return "-";
        }

        return <GovActionCell id={id} name={name} />;
      },
      jsonFormat: item => {
        return item?.proposal?.ident?.id || "-";
      },
      title: "Name",
      visible: columnsVisibility.gov_action,
      widthPx: 140,
    },
    {
      key: "voter",
      render: item => {
        const voterId = item?.info?.id;

        if (!voterId) {
          return "-";
        }

        const role = voterId.startsWith("pool")
          ? "SPO"
          : voterId.startsWith("drep")
            ? "DRep"
            : "ConstitutionalCommittee";

        return (
          <GovVoterCell
            role={role}
            info={{
              id: voterId,
              meta: item?.info?.meta,
            }}
          />
        );
      },
      title: "Voter",
      visible: columnsVisibility.voter,
      widthPx: 220,
    },
    {
      key: "voter_role",
      render: item => {
        if (!item?.voter_role) {
          return "-";
        }

        const role =
          item.voter_role === "ConstitutionalCommittee"
            ? "CC"
            : item.voter_role === "DRep"
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
      title: <p ref={anchorRefs?.voter_role}>Voter role</p>,
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
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {["ConstitutionalCommittee", "SPO", "DRep"].map(val => (
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
                <span className='text-text-sm'>{val}</span>
              </label>
            ))}
          </div>
        ),
      },
      visible: columnsVisibility.voter_role,
      widthPx: 60,
    },
    {
      key: "voting_power",
      render: item => {
        if (!item?.info?.power?.stake) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.info.power.stake} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Voting power</p>,
      visible: columnsVisibility.voting_power,
      widthPx: 60,
    },
    {
      key: "vote",
      render: item => {
        if (!item?.vote) {
          return "-";
        }

        return (
          <VoteCell
            vote={item.vote as Vote}
            txHash={item.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
          />
        );
      },
      title: <p ref={anchorRefs?.vote}>Vote</p>,
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
        filterContent: (
          <div className='flex flex-col gap-1 px-2 py-1'>
            {["Yes", "No", "Abstain"].map(val => (
              <label className='flex items-center gap-1' key={val}>
                <input
                  type='radio'
                  name='status'
                  value={val}
                  className='accent-primary'
                  checked={filterDraft["vote"] === val}
                  onChange={e =>
                    changeDraftFilter("vote", e.currentTarget.value)
                  }
                />
                <span className='text-text-sm'>{val}</span>
              </label>
            ))}
          </div>
        ),
      },
      visible: columnsVisibility.vote,
      widthPx: 45,
    },
    {
      key: "epoch",
      render: item => {
        if (!item?.proposal?.expiration) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <Link
              className='text-primary'
              to='/epoch/$no'
              params={{
                no: item.proposal.expiration,
              }}
            >
              {item.proposal.expiration}
            </Link>
          </p>
        );
      },
      title: <p className='w-full text-right'>Epoch</p>,
      visible: columnsVisibility.epoch,
      widthPx: 60,
    },
    {
      key: "block",
      render: item => {
        if (!item?.tx?.block_no) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <Link
              to='/block/$hash'
              params={{
                hash: item.tx.block_hash,
              }}
              className='text-primary'
            >
              {formatNumber(item.tx.block_no)}
            </Link>
          </p>
        );
      },
      title: <p className='w-full text-right'>Block</p>,
      visible: columnsVisibility.block,
      widthPx: 60,
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
      title: <p className='w-full text-right'>Tx</p>,
      visible: columnsVisibility.tx,
      widthPx: 60,
    },
  ];

  const totalItems = votesQuery.data?.pages[0]?.data?.count;
  const items = votesQuery.data?.pages.flatMap(page => page.data.data);

  return (
    <PageBase
      metadataTitle='voteListPage'
      showHeader={!poolId}
      adsCarousel={!poolId}
      breadcrumbItems={[
        {
          label: <span className='inline pt-1/2'>Governance</span>,
          link: "/gov",
        },
        {
          label: <span className=''>Votes</span>,
        },
      ]}
      title={<div className='flex items-center gap-1/2'>All Votes</div>}
    >
      <div className={`w-full max-w-desktop ${!poolId ? "px-2 py-3" : ""}`}>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
            {votesQuery.isLoading || votesQuery.isFetching ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : totalItems !== undefined ? (
              <h3 className='basis-[230px] text-nowrap'>
                Total of {formatNumber(totalItems)}{" "}
                {totalItems === 1 ? "vote" : "votes"}
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
                  columnsOptions={voteListPageTableOptions.map(item => {
                    return {
                      label: item.name,
                      isVisible: columnsVisibility[item.key],
                      onClick: () =>
                        setColumnVisibility(
                          item.key,
                          !columnsVisibility[item.key],
                        ),
                    };
                  })}
                />
              </div>
            </div>
          </div>

          <div className='flex gap-1'>
            <TableSearchInput
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              prefixes={[
                {
                  key: "tx",
                  name: "Tx",
                  show: tableSearch.length < 1 || isHex(tableSearch),
                },
                {
                  key: "gov_action_proposal",
                  name: "Governance Action ID",
                  show: tableSearch.length < 1 || isHex(tableSearch),
                },
                {
                  key: "voter_id",
                  name: "Voter ID",
                  show:
                    tableSearch.length < 1 ||
                    tableSearch.startsWith("drep1") ||
                    tableSearch.startsWith("pool1") ||
                    tableSearch.startsWith("addr1"),
                },
              ]}
              wrapperClassName='md:w-[320px] w-full '
              showSearchIcon
              searchPrefix={searchPrefix}
              setSearchPrefix={setSearchPrefix}
              showPrefixPopup={true}
            />
            <div className='hidden items-center gap-1 md:flex'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={voteListPageTableOptions.map(item => {
                  return {
                    label: item.name,
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                })}
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
                      {key[0].toUpperCase() + key.split("_").join(" ").slice(1)}
                      :
                    </span>
                    <span>
                      {value[0].toUpperCase() + value.slice(1).toLowerCase()}
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
          query={votesQuery}
          items={items}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof typeof columnsVisibility) -
              columnsOrder.indexOf(b.key as keyof typeof columnsVisibility)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </div>
    </PageBase>
  );
};
