import type { PoolBlock } from "@/types/analyticsTypes";
import type { PoolBlockTableColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import PoolCell from "@/components/table/PoolCell";
import { CircleAlert } from "lucide-react";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchAnalyticsPoolBlock } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { usePoolsIssuesMissedBlocksTableStore } from "@/stores/tables/poolIssuesMissedBlocksTableStore";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";
import { poolIssuesMissedBlocksTableOptions } from "@/constants/tables/poolIssuesMissedBlocksTableOptions";

export const PoolIssuesMissedBlocks: FC = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [active, setActive] = useState<string>("recent");
  const [epochCount, setEpochCount] = useState<number>(
    miscConst?.epoch?.no ? miscConst?.epoch?.no - 1 : 0,
  );

  const query = useFetchAnalyticsPoolBlock(epochCount);
  const totalMissed = query.data?.count;
  const items = query?.data?.data;

  const estimatedBlocks = (items ?? []).reduce(
    (a, b) => a + b.blocks_estimated,
    0,
  );
  const mintedBlocks = (items ?? []).reduce((a, b) => a + b.blocks_minted, 0);

  const calculateTotalDeviation = (blocksMinted, blocksEstimated) => {
    return ((blocksEstimated - blocksMinted) / blocksEstimated) * 100;
  };

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = usePoolsIssuesMissedBlocksTableStore();

  const epochButtons = [
    {
      key: "recent",
      title: "Recent",
      epochOffset: 1,
    },
    {
      key: "2_epochs",
      title: "2 epochs",
      epochOffset: 2,
    },
    {
      key: "3_epochs",
      title: "3 epochs",
      epochOffset: 3,
    },
    {
      key: "4_epochs",
      title: "4 epochs",
      epochOffset: 4,
    },
    {
      key: "longterm",
      title: "Longterm",
      epochOffset: 10,
    },
  ];

  const switchActive = useCallback(
    (key: string) => {
      const selectedOption = epochButtons.find(option => option.key === key);
      if (selectedOption) {
        setActive(key);
        setEpochCount((miscConst?.epoch?.no ?? 0) - selectedOption.epochOffset);
      }
    },
    [miscConst?.epoch?.no],
  );

  const tabOptions = epochButtons.map(({ key, title }) => ({
    label: (
      <span className={active === key ? "text-primary" : ""}>{title}</span>
    ),
    onClick: () => switchActive(key),
  }));

  const columns: TableColumns<PoolBlock> = [
    {
      key: "pool",
      render: item => (
        <PoolCell
          poolInfo={{
            id: item.pool_id,
            meta: item.pool.meta,
          }}
        />
      ),
      title: "Pool",
      visible: columnsVisibility.pool,
      widthPx: 150,
    },
    {
      key: "luck",
      render: item => {
        if (typeof item.luck !== "number") {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right text-grayTextPrimary'>
            {item.luck * 100 ? (item.luck * 100).toFixed(2) : 0}%
          </p>
        );
      },
      title: <p className='w-full text-right'>Luck</p>,
      visible: columnsVisibility.luck,
      widthPx: 50,
    },
    {
      key: "minted_blocks",
      render: item => {
        if (typeof item.blocks_minted !== "number") {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            {formatNumber(item.blocks_minted.toFixed(2))}
          </p>
        );
      },
      title: (
        <p className='flex w-full justify-end text-right'>Minted blocks</p>
      ),
      visible: columnsVisibility.minted_blocks,
      widthPx: 150,
    },
    {
      key: "estimated_blocks",
      render: item => {
        if (typeof item.blocks_estimated !== "number") {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            {formatNumber(item.blocks_estimated.toFixed(2))}
          </p>
        );
      },
      title: (
        <p className='flex w-full justify-end text-right'>Estimated blocks</p>
      ),
      visible: columnsVisibility.estimated_blocks,
      widthPx: 150,
    },
  ];

  useEffect(() => {
    if (totalMissed && totalMissed !== totalItems) {
      setTotalItems(totalMissed);
    }
  }, [totalMissed, totalItems]);

  useEffect(() => {
    if (miscConst?.epoch?.no) {
      setEpochCount(miscConst?.epoch?.no - 1);
    }
  }, [miscConst?.epoch?.no]);

  return (
    <section className='flex min-h-minHeight w-full flex-col items-center'>
      <OverviewStatCard
        title=''
        description="This estimate is based on pool performance data. Pools don't always achieve their expected block allocation per epoch. Smaller pools may vary between 50% and 200% of expected performance. The feature is being optimized to account for these fluctuations."
        icon={<CircleAlert className='text-primary' />}
        value
        className='mb-1.5 h-[100px] max-h-[100px] !flex-row items-center !gap-1'
      />
      <div className='mb-1.5 flex w-full flex-col justify-between gap-1.5 min-[580px]:flex-row lg:items-center lg:gap-0'>
        <div className='hidden gap-1 lg:flex'>
          {epochButtons.map(({ key, title }) => (
            <Button
              key={key}
              onClick={() => switchActive(key)}
              label={title}
              size='sm'
              variant={active === key ? "primary" : "tertiary"}
            />
          ))}
        </div>
        <div className='block w-fit rounded-s border border-border lg:hidden'>
          <Dropdown
            id={active}
            width='150px'
            label={
              epochButtons[epochButtons.findIndex(item => item.key === active)]
                .title
            }
            options={tabOptions}
            triggerClassName='text-primary font-medium px-1.5 py-1'
            closeOnSelect
          />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex gap-1/2 text-text-xs'>
            <span className='text-grayTextPrimary'>Monitored epochs</span>
            <span>
              {miscConst?.epoch?.no ? miscConst?.epoch?.no - epochCount : 0}
            </span>
          </div>
          <div className='flex gap-1/2 text-text-xs'>
            <span className='text-grayTextPrimary'>
              Minimum estimated blocks
            </span>
            <span>
              {Math.min(
                ...(items || []).map(item => item.blocks_estimated),
              ).toFixed(2)}
            </span>
          </div>
          <div className='flex gap-1/2 text-text-xs'>
            <span className='text-grayTextPrimary'>Allowed deviation</span>
            <span>
              {mintedBlocks && estimatedBlocks
                ? calculateTotalDeviation(
                    mintedBlocks,
                    estimatedBlocks,
                  ).toFixed(2)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full items-center justify-between gap-1'>
          {query.isLoading ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : query.isError ? (
            <></>
          ) : (
            <h3 className='basis-[230px]'>
              Total of {formatNumber(totalItems)} pool issues
            </h3>
          )}

          <div>
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={poolIssuesMissedBlocksTableOptions.map(item => {
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
      </div>
      <GlobalTable
        type='default'
        totalItems={(items || []).length}
        itemsPerPage={rows}
        rowHeight={69}
        pagination
        scrollable
        query={query}
        items={items ?? []}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolBlockTableColumns) -
            columnsOrder.indexOf(b.key as keyof PoolBlockTableColumns)
          );
        })}
        minContentWidth={700}
        onOrderChange={setColumsOrder}
      />
    </section>
  );
};
