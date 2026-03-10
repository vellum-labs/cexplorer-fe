import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { GroupsCharts } from "@/components/groups/GroupsCharts";
import { GroupsTable } from "@/components/groups/GroupsTable";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useFetchGroupsList } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useMemo, useState } from "react";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { X } from "lucide-react";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { PageBase } from "@/components/global/pages/PageBase";

export const GroupsListPage = () => {
  const { t } = useAppTranslation("pages");
  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [sortColumn, setSortColumn] = useState<string | undefined>("pool_stake");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >("desc");
  const query = useFetchGroupsList();
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

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

  const searchFilteredItems = useMemo(() => {
    if (!debouncedTableSearch) {
      return data;
    }

    const lowerCaseQuery = debouncedTableSearch.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [data, debouncedTableSearch]);

  const drepFilteredItems = useMemo(() => {
    if (filter.has_drep === undefined) {
      return searchFilteredItems;
    }

    return searchFilteredItems.filter(item => {
      const hasDrep = (item.data?.drep?.count ?? 0) > 0;
      if (+(filter.has_drep ?? 0) === 1) {
        return hasDrep;
      }
      if (+(filter.has_drep ?? 0) === 2) {
        return !hasDrep;
      }
      return true;
    });
  }, [searchFilteredItems, filter.has_drep]);

  const filteredItems = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return drepFilteredItems;
    }

    const totalLiveStake = miscConst?.live_stake ?? 1;

    return [...drepFilteredItems].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case "pools_count":
          comparison = (b.data?.pool?.count ?? 0) - (a.data?.pool?.count ?? 0);
          break;

        case "pool_stake":
          comparison = (b.data?.pool?.stake ?? 0) - (a.data?.pool?.stake ?? 0);
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
  }, [drepFilteredItems, miscConst?.live_stake, sortColumn, sortDirection]);

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

  return (
    <PageBase
      metadataTitle='groupsList'
      title={t("groups.title")}
      breadcrumbItems={[{ label: t("groups.breadcrumb") }]}
      adsCarousel={false}
    >
      <div className='flex w-full max-w-desktop flex-col items-center justify-center gap-1 px-mobile pb-3 md:px-desktop'>
          <div className='mb-2 w-full rounded-m border border-border bg-cardBg p-2'>
            <p className='text-text-sm text-grayTextPrimary'>
              {t("groups.info")}{" "}
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
              <GroupsCharts filteredItems={data} />
            )}
            <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
              <h3 className='pb-1.5 md:pb-0'>
                {t("common:phrases.totalOf")}{" "}
                {formatNumber(filteredItems.length)} {t("groups.totalOfSuffix")}
              </h3>
              <TableSearchInput
                placeholder={t("groups.searchPlaceholder")}
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
                        <span>
                          {key === "has_drep" && t("groups.alsoDrep")}:
                        </span>
                        <span>
                          {key === "has_drep" &&
                            +value === 1 &&
                            t("groups.yes")}
                          {key === "has_drep" && +value === 2 && t("groups.no")}
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
    </PageBase>
  );
};
