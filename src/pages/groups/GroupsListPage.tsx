import TableSearchInput from "@/components/global/inputs/SearchInput";
import GlobalTable from "@/components/table/GlobalTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useFetchGroupsList } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { GroupsListData } from "@/types/analyticsTypes";
import type { TableColumns } from "@/types/tableTypes";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { Badge } from "@/components/global/badges/Badge";
import { Check, Filter } from "lucide-react";
import { getPledgeColor } from "@/utils/getPledgeColor";
import { cn } from "@/lib/utils";
import { SortArrow } from "@/components/global/SortArrow";

export const GroupsListPage = () => {
  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [filteredItems, setFilteredItems] = useState<GroupsListData[]>([]);
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | undefined>(undefined);
  const query = useFetchGroupsList();
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const data = useMemo(() => query.data?.data.data ?? [], [query.data?.data.data]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: desc -> asc -> undefined (unsorted)
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortColumn(undefined);
        setSortDirection(undefined);
      }
    } else {
      // First click on a new column: set to descending
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const columns: TableColumns<GroupsListData> = [
    {
      key: "pools_count",
      title: (
        <span
          className='flex cursor-pointer items-center gap-1/2'
          onClick={() => handleSort("pools_count")}
        >
          Pools count <SortArrow direction={sortColumn === "pools_count" ? sortDirection : undefined} />
        </span>
      ),
      render: item => (
        <span className='text-grayTextPrimary'>{item.data?.pool?.count ?? 0}</span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "name",
      title: "Group name",
      render: item => (
        <Link
          className='text-primary'
          to='/groups/$url'
          params={{ url: item.url }}
        >
          {item.name}
        </Link>
      ),
      widthPx: 50,
      visible: true,
    },
    {
      key: "pool_stake",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pool_stake")}
        >
          Pool stake <SortArrow direction={sortColumn === "pool_stake" ? sortDirection : undefined} />
        </span>
      ),
      render: item => (
        <span className='flex w-full justify-end text-grayTextPrimary'>
          {item.data?.pool?.stake ? (
            <AdaWithTooltip data={item.data.pool.stake} />
          ) : (
            "-"
          )}
        </span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "delegators",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("delegators")}
        >
          Delegators <SortArrow direction={sortColumn === "delegators" ? sortDirection : undefined} />
        </span>
      ),
      render: item => (
        <span className='flex w-full justify-end text-grayTextPrimary'>
          {item.data?.pool?.delegators ?? "-"}
        </span>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "share",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("share")}
        >
          Share <SortArrow direction={sortColumn === "share" ? sortDirection : undefined} />
        </span>
      ),
      render: item => {
        const groupStake = item.data?.pool?.stake ?? 0;
        const totalLiveStake = miscConst?.live_stake ?? 1;

        // Calculate share: (group stake / total live stake) * 100
        const sharePercentage = totalLiveStake > 0
          ? ((groupStake / totalLiveStake) * 100).toFixed(2)
          : "0.00";

        return (
          <span className='flex w-full justify-end text-grayTextPrimary'>
            {sharePercentage}%
          </span>
        );
      },
      widthPx: 30,
      visible: true,
    },
    {
      key: "pledge",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pledge")}
        >
          Pledge <SortArrow direction={sortColumn === "pledge" ? sortDirection : undefined} />
        </span>
      ),
      render: item => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const stake = item.data?.pool?.stake ?? 0;

        // Calculate leverage: stake / pledge (handle infinity case)
        let leverage = 0;
        if (pledge > 0) {
          leverage = Math.round(stake / pledge);
        }

        return (
          <div className='flex flex-col items-end'>
            <div className='flex items-center gap-1/2'>
              <Check
                size={11}
                className='translate-y-[1px] stroke-[#17B26A]'
              />
              <span className='w-[60px] whitespace-nowrap text-grayTextPrimary'>
                <AdaWithTooltip data={pledge} />
              </span>
            </div>
            <div className='flex items-center justify-end gap-1/2'>
              <Filter
                size={11}
                color={getPledgeColor(leverage)}
                className={cn("translate-y-[2px]")}
              />
              <span className='text-text-xs text-grayTextPrimary'>
                {pledge > 0 ? `x${leverage}` : "∞"}
              </span>
            </div>
          </div>
        );
      },
      widthPx: 30,
      visible: true,
    },
    {
      key: "mu_pledge_per_pool",
      title: (
        <span
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => handleSort("pledge_per_pool")}
        >
          μ Pledge per pool <SortArrow direction={sortColumn === "pledge_per_pool" ? sortDirection : undefined} />
        </span>
      ),
      render: item => {
        const pledge = item.data?.pool?.pledged ?? 0;
        const poolCount = item.data?.pool?.count ?? 1;
        const pledgePerPool = poolCount > 0 ? pledge / poolCount : 0;

        return (
          <span className='flex w-full justify-end text-grayTextPrimary'>
            <AdaWithTooltip data={pledgePerPool} />
          </span>
        );
      },
      widthPx: 40,
      visible: true,
    },
    {
      key: "drep",
      title: <span className='flex w-full justify-end'>Also DRep</span>,
      render: item => {
        const drepCount = item.data?.drep?.count ?? 0;

        if (drepCount === 0) {
          return (
            <span className='flex w-full justify-end'>
              <Badge color="gray" small>No</Badge>
            </span>
          );
        }

        return (
          <span className='flex w-full justify-end'>
            <Badge color="blue" small>Yes: {drepCount}x</Badge>
          </span>
        );
      },
      widthPx: 30,
      visible: true,
    },
  ];

  useEffect(() => {
    let filtered = data;

    // Apply search filter
    if (debouncedTableSearch) {
      filtered = data.filter(item =>
        item.name.toLowerCase().includes(debouncedTableSearch.toLowerCase()),
      );
    }

    // Apply sorting only if a column is selected
    if (sortColumn && sortDirection) {
      const sorted = [...filtered].sort((a, b) => {
        const totalLiveStake = miscConst?.live_stake ?? 1;
        let comparison = 0;

        switch (sortColumn) {
          case "pools_count":
            comparison = (b.data?.pool?.count ?? 0) - (a.data?.pool?.count ?? 0);
            break;

          case "pool_stake":
            comparison = (b.data?.pool?.stake ?? 0) - (a.data?.pool?.stake ?? 0);
            break;

          case "delegators":
            comparison = (b.data?.pool?.delegators ?? 0) - (a.data?.pool?.delegators ?? 0);
            break;

          case "share": {
            const shareA = (a.data?.pool?.stake ?? 0) / totalLiveStake;
            const shareB = (b.data?.pool?.stake ?? 0) / totalLiveStake;
            comparison = shareB - shareA;
            break;
          }

          case "pledge":
            comparison = (b.data?.pool?.pledged ?? 0) - (a.data?.pool?.pledged ?? 0);
            break;

          case "pledge_per_pool": {
            const pledgePerPoolA = (a.data?.pool?.count ?? 1) > 0
              ? (a.data?.pool?.pledged ?? 0) / (a.data?.pool?.count ?? 1)
              : 0;
            const pledgePerPoolB = (b.data?.pool?.count ?? 1) > 0
              ? (b.data?.pool?.pledged ?? 0) / (b.data?.pool?.count ?? 1)
              : 0;
            comparison = pledgePerPoolB - pledgePerPoolA;
            break;
          }

          default:
            comparison = 0;
        }

        // Reverse comparison if ascending
        return sortDirection === "asc" ? -comparison : comparison;
      });

      setFilteredItems(sorted);
    } else {
      // No sorting applied, use filtered data as-is
      setFilteredItems(filtered);
    }
  }, [debouncedTableSearch, data, sortColumn, sortDirection, miscConst?.live_stake]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.groupsList.title}</title>}
        <meta name='description' content={metadata.groupsList.description} />
        <meta name='keywords' content={metadata.groupsList.keywords} />
      </Helmet>
      <main className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center justify-center px-mobile md:px-desktop'>
          <Breadcrumb className='mb-2 w-full'>
            <BreadcrumbList className='flex items-center'>
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to='/'>
                  Home
                </Link>
              </BreadcrumbItem>
              /<BreadcrumbItem className='text-text'>Groups</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className='flex min-h-minHeight w-full flex-col items-center'>
            <TableSearchInput
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='mb-2 ml-auto md:w-[320px] w-full '
              showSearchIcon
              showPrefixPopup={false}
            />
            <GlobalTable
              type='default'
              scrollable
              totalItems={filteredItems.length}
              columns={columns}
              items={filteredItems}
              query={query}
            />
          </section>
        </div>
      </main>
    </>
  );
};
