import type { FC } from "react";
import { useSearch } from "@tanstack/react-router";

import GlobalTable from "@/components/table/GlobalTable";
import ExportButton from "@/components/table/ExportButton";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useRecentVotesTableStore } from "@/stores/tables/recentVotesTableStore";
import { useFetchCCVotes } from "@/services/governance";
import { formatString, formatNumber } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { isHex } from "@/utils/isHex";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { GovActionCell } from "../../GovActionCell";
import { VoteCell } from "@/components/governance/vote/VoteCell";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const RecentTab: FC = () => {
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
      title: "Governance Action",
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
      title: "Name",
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
      title: "CC Member",
      widthPx: 220,
      visible: columnsVisibility.cc_member,
      render: item => {
        const meta = item.info?.meta;
        const id = item.info?.id ?? "N/A";
        const name = meta?.name ?? "Unknown";
        const img = meta?.img;

        const fallbackletters = [...name]
          .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
          .join("");

        return (
          <div className='flex items-center gap-1.5'>
            <div className='min-w-[32px]'>
              <Image
                src={img}
                alt='member'
                className='rounded-max'
                width={32}
                height={32}
                fallbackletters={fallbackletters}
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-textPrimary font-medium'>{name}</span>
              <div className='flex gap-1'>
                {/* <Link
                  to='/gov/cc/$coldKey'
                  params={{ coldKey: id }}
                  className='text-primary'
                >
                </Link> */}
                {formatString(id, "long")}
                <Copy copyText={id} />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "vote",
      title: <p ref={anchorRefs?.vote}>Vote</p>,
      widthPx: 100,
      visible: columnsVisibility.vote,
      render: item => {
        const vote = item.vote;
        return (
          <VoteCell
            vote={vote}
            txHash={item?.tx?.hash}
            proposalId={item?.proposal?.ident?.id}
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
                <span className='text-text-sm'>{val}</span>
              </label>
            ))}
          </div>
        ),
      },
    },
    {
      key: "tx",
      title: "Tx Hash",
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
      title: "Time",
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
              Total of {formatNumber(totalItems)} votes
            </h3>
          )}
          <div className='flex items-center gap-1 md:hidden'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
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
            placeholder='Search your results...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full'
            showSearchIcon
            prefixes={[
              {
                key: "committee_voter",
                name: "CC Member",
                show: tableSearch.length < 1 || isHex(tableSearch),
              },
              {
                key: "tx_hash",
                name: "Tx Hash",
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
      />
    </section>
  );
};
