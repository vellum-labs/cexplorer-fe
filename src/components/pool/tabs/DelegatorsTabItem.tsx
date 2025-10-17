import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import Tabs from "@/components/global/Tabs";
import PoolDelegatorsTable from "../PoolDelegatorsTable";
import { PoolMigrationsTable } from "../PoolMigrationsTable";
import { PoolStructureTable } from "../PoolStructureTable";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { useFetchPoolDelegators } from "@/services/pools";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePoolDelegatorsTableStore } from "@/stores/tables/poolDelegatorsTableStore";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { poolDelegatorsTableOptions } from "@/constants/tables/poolDelegatorsTableOptions";
import { poolStructureTableOptions } from "@/constants/tables/poolStructureTableOptions";
import { usePoolDelegatorsStructureStore } from "@/stores/tables/poolDelegatorsStructureStore";
import { usePoolMigrationsTableStore } from "@/stores/tables/poolMigrationsTableStore";
import { formatNumber } from "@/utils/format/format";

const DelegatorsTabItem = () => {
  const route = getRouteApi("/pool/$id");
  const { id } = route.useParams();
  const miscBasic = useFetchMiscBasic();
  const miscConst = useMiscConst(miscBasic.data?.data?.version?.const);
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const [delegatorTableTotalItems, setTotalDelegatorItems] = useState(0);
  const [migrationsTotalItems, setMigrationsTotalItems] = useState(0);
  const { page, sort, order } = useSearch({ from: "/pool/$id" });

  const {
    columnsVisibility: delegatorsColumnsVisibility,
    setColumnVisibility: setDelegatorsColumnVisibility,
    rows: delegatorRows,
    setRows: setDelegatorRows,
  } = usePoolDelegatorsTableStore();

  const {
    columnsVisibility: migrationsColumnsVisibility,
    setColumnVisibility: setMigrationsColumnsVisibility,
    rows: migrationsRows,
    setRows: setMigrationsRows,
  } = usePoolMigrationsTableStore();

  const { columnsVisibility, setRows, rows, setColumnVisibility } =
    usePoolDelegatorsStructureStore();

  const delegatorsQuery = useFetchPoolDelegators(
    id,
    infiniteScrolling ? 0 : (page ?? 1) * delegatorRows - delegatorRows,
    delegatorRows,
    "live",
    sort,
    order,
  );

  const migrationsQuery = useFetchPoolDelegators(
    id,
    infiniteScrolling ? 0 : (page ?? 1) * migrationsRows - migrationsRows,
    migrationsRows,
    "gone",
    sort,
    order,
  );

  const delegatorTableTotalCount = delegatorsQuery.data?.pages[0].data.count;
  const migrationsTableTotalCount = migrationsQuery.data?.pages[0].data.count;

  useEffect(() => {
    if (
      delegatorTableTotalCount &&
      delegatorTableTotalCount !== delegatorTableTotalItems
    ) {
      setTotalDelegatorItems(delegatorTableTotalCount);
    }
  }, [delegatorTableTotalCount, delegatorTableTotalItems]);

  useEffect(() => {
    if (
      migrationsTableTotalCount &&
      migrationsTableTotalCount !== migrationsTotalItems
    ) {
      setMigrationsTotalItems(migrationsTableTotalCount);
    }
  }, [migrationsTableTotalCount, migrationsTotalItems]);

  const delegatorPoolTabs = [
    {
      key: "newcomers",
      label: "Newcomers",
      content: (
        <div className='flex w-full flex-col items-center gap-2'>
          <PoolDelegatorsTable
            totalItems={delegatorTableTotalItems}
            delegatorsQuery={delegatorsQuery}
            miscConst={miscConst}
          />
        </div>
      ),
      extraTitle: (
        <div
          className={`flex w-full items-center ${delegatorTableTotalItems === 0 ? "justify-end" : "justify-between"} gap-2`}
        >
          {!delegatorTableTotalItems && delegatorTableTotalItems !== 0 ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : delegatorTableTotalItems > 0 ? (
            <h3 className='basis-[220px]'>
              Total of {formatNumber(delegatorTableTotalItems)} newcomers
            </h3>
          ) : (
            <></>
          )}
          <div className='flex items-center justify-between gap-1'>
            <TableSettingsDropdown
              rows={delegatorRows}
              setRows={setDelegatorRows}
              columnsOptions={poolDelegatorsTableOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: delegatorsColumnsVisibility[item.key],
                  onClick: () =>
                    setDelegatorsColumnVisibility(
                      item.key,
                      !delegatorsColumnsVisibility[item.key],
                    ),
                };
              })}
            />
          </div>
        </div>
      ),
      visible: true,
    },
    {
      key: "migrations",
      label: "Migrations",
      content: (
        <div className='flex w-full flex-col items-center gap-2'>
          <PoolMigrationsTable
            totalItems={migrationsTotalItems}
            miscConst={miscConst}
            delegatorsQuery={migrationsQuery}
          />
        </div>
      ),
      extraTitle: (
        <div
          className={`flex w-full items-center ${migrationsTotalItems === 0 ? "justify-end" : "justify-between"} gap-2`}
        >
          {!migrationsTotalItems && migrationsTotalItems !== 0 ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : migrationsTotalItems > 0 ? (
            <h3 className='basis-[220px]'>
              Total of {formatNumber(migrationsTotalItems)} migrations
            </h3>
          ) : (
            <></>
          )}
          <div className='flex items-center gap-1'>
            <TableSettingsDropdown
              rows={migrationsRows}
              setRows={setMigrationsRows}
              columnsOptions={poolDelegatorsTableOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: migrationsColumnsVisibility[item.key],
                  onClick: () =>
                    setMigrationsColumnsVisibility(
                      item.key,
                      !migrationsColumnsVisibility[item.key],
                    ),
                };
              })}
            />
          </div>
        </div>
      ),
      visible: true,
    },
    {
      key: "structure",
      label: "Structure",
      content: (
        <div className='flex w-full flex-col items-end gap-2'>
          <PoolStructureTable poolId={id} />
        </div>
      ),
      extraTitle: (
        <div className='flex w-full justify-end'>
          <div className='flex items-center gap-1'>
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={poolStructureTableOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      ),
      visible: true,
    },
  ];

  return (
    <Tabs
      items={delegatorPoolTabs}
      withPadding={false}
      tabParam='subTab'
      wrapperClassname='mt-0'
    />
  );
};

export default DelegatorsTabItem;
