import TableSearchInput from "@/components/global/inputs/SearchInput";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { GroupsCharts } from "@/components/groups/GroupsCharts";
import { GroupsTable } from "@/components/groups/GroupsTable";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { useFetchGroupsList } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { GroupsListData } from "@/types/analyticsTypes";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { X } from "lucide-react";
import { useFilterTable } from "@/hooks/tables/useFilterTable";

export const GroupsListPage = () => {
  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [filteredItems, setFilteredItems] = useState<GroupsListData[]>([]);
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const query = useFetchGroupsList();
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const {
    anchorRefs,
    filterVisibility,
    filter,
    filterDraft,
    hasFilter,
    toggleFilter,
    changeDraftFilter,
    changeFilterByKey,
  } = useFilterTable({
    storeKey: "groups_list_filter",
    filterKeys: ["has_drep"],
  });

  const data = useMemo(
    () => query.data?.data.data ?? [],
    [query.data?.data.data],
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortColumn(undefined);
        setSortDirection(undefined);
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  useEffect(() => {
    let filtered = data;

    if (debouncedTableSearch) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(debouncedTableSearch.toLowerCase()),
      );
    }

    if (filter.has_drep !== undefined) {
      filtered = filtered.filter(item => {
        const hasDrep = (item.data?.drep?.count ?? 0) > 0;
        if (+(filter.has_drep ?? 0) === 1) {
          return hasDrep;
        } else if (+(filter.has_drep ?? 0) === 2) {
          return !hasDrep;
        }
        return true;
      });
    }

    if (sortColumn && sortDirection) {
      const sorted = [...filtered].sort((a, b) => {
        const totalLiveStake = miscConst?.live_stake ?? 1;
        let comparison = 0;

        switch (sortColumn) {
          case "pools_count":
            comparison =
              (b.data?.pool?.count ?? 0) - (a.data?.pool?.count ?? 0);
            break;

          case "pool_stake":
            comparison =
              (b.data?.pool?.stake ?? 0) - (a.data?.pool?.stake ?? 0);
            break;

          case "delegators":
            comparison =
              (b.data?.pool?.delegators ?? 0) - (a.data?.pool?.delegators ?? 0);
            break;

          case "share": {
            const shareA = (a.data?.pool?.stake ?? 0) / totalLiveStake;
            const shareB = (b.data?.pool?.stake ?? 0) / totalLiveStake;
            comparison = shareB - shareA;
            break;
          }

          case "pledge":
            comparison =
              (b.data?.pool?.pledged ?? 0) - (a.data?.pool?.pledged ?? 0);
            break;

          case "pledge_per_pool": {
            const pledgePerPoolA =
              (a.data?.pool?.count ?? 1) > 0
                ? (a.data?.pool?.pledged ?? 0) / (a.data?.pool?.count ?? 1)
                : 0;
            const pledgePerPoolB =
              (b.data?.pool?.count ?? 1) > 0
                ? (b.data?.pool?.pledged ?? 0) / (b.data?.pool?.count ?? 1)
                : 0;
            comparison = pledgePerPoolB - pledgePerPoolA;
            break;
          }

          default:
            comparison = 0;
        }

        return sortDirection === "asc" ? -comparison : comparison;
      });

      setFilteredItems(sorted);
    } else {
      setFilteredItems(filtered);
    }
  }, [
    debouncedTableSearch,
    data,
    sortColumn,
    sortDirection,
    miscConst?.live_stake,
    filter.has_drep,
  ]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.groupsList.title}</title>}
        <meta name='description' content={metadata.groupsList.description} />
        <meta name='keywords' content={metadata.groupsList.keywords} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title='Cardano Groups (Donuts)'
          breadcrumbItems={[{ label: "Groups" }]}
        />
        <div className='flex w-full max-w-desktop flex-col items-center justify-center gap-1 p-mobile md:p-desktop'>
          <div className='mb-2 w-full rounded-m border border-border bg-cardBg p-2'>
            <p className='text-text-sm text-grayTextPrimary'>
              This dashboard is managed by Cardano community. Everyone can add
              or modify existing groups via{" "}
              <a
                href='https://github.com/vellum-labs/cexplorer-community/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary'
              >
                cexplorer-community on github
              </a>
              .
            </p>
          </div>
          <section className='flex min-h-minHeight w-full flex-col items-center'>
            {query.isLoading ? (
              <div className='mb-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
                <LoadingSkeleton height='400px' rounded='lg' />
                <LoadingSkeleton height='400px' rounded='lg' />
                <LoadingSkeleton height='400px' rounded='lg' />
                <LoadingSkeleton height='400px' rounded='lg' />
              </div>
            ) : (
              <GroupsCharts filteredItems={filteredItems} />
            )}
            <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
              <h3 className='pb-1.5 md:pb-0'>
                Total of {formatNumber(filteredItems.length)} groups
              </h3>
              <TableSearchInput
                placeholder='Search your results...'
                value={tableSearch}
                onchange={setTableSearch}
                wrapperClassName='md:w-[320px] w-full'
                showSearchIcon
                showPrefixPopup={false}
              />
            </div>
            {hasFilter && (
              <div className='mb-1 flex w-full flex-wrap items-center gap-1/2 md:flex-nowrap'>
                {Object.entries(filter).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className='flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
                      >
                        <span>{key === "has_drep" && "Also DRep"}:</span>
                        <span>
                          {key === "has_drep" && +value === 1 && "Yes"}
                          {key === "has_drep" && +value === 2 && "No"}
                        </span>
                        <X
                          size={13}
                          className='cursor-pointer'
                          onClick={() => {
                            changeFilterByKey(key);
                          }}
                        />
                      </div>
                    ),
                )}
              </div>
            )}
            <GroupsTable
              filteredItems={filteredItems}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              handleSort={handleSort}
              miscConstLiveStake={miscConst?.live_stake ?? undefined}
              anchorRefs={anchorRefs}
              filterVisibility={filterVisibility}
              filter={filter}
              filterDraft={filterDraft}
              toggleFilter={toggleFilter}
              changeDraftFilter={changeDraftFilter}
              changeFilterByKey={changeFilterByKey}
              query={query}
            />
          </section>
        </div>
      </main>
    </>
  );
};
