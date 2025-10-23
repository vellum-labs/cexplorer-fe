import type { GovernanceActionDetailAboutListColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import GlobalTable from "@/components/table/GlobalTable";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useGovActionDetailDrepsTableStore } from "@/stores/tables/governanceDetailDrepsTableStore";
import { useFetchGovernanceVote } from "@/services/governance";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { governanceActionDetailDrepSposTableOptions } from "@/constants/tables/governanceActionDetailAboutTableOptions";
import { SortArrow } from "@vellumlabs/cexplorer-sdk";
import { getColumnsSortOrder } from "@vellumlabs/cexplorer-sdk";
import { GovVoterCell } from "@/components/gov/GovVoterCell";

interface GovernanceDetailDrepsSubtabProps {
  id: string;
}

export const GovernanceDetailDrepsSubtab: FC<
  GovernanceDetailDrepsSubtabProps
> = ({ id }) => {
  const { page, order, sort } = useSearch({
    from: "/gov/action/$id",
  });

  const navigate = useNavigate();

  const getOrder = (orderValue: "stake" | "represented_by") => {
    return getColumnsSortOrder(sort) !== undefined || order !== orderValue
      ? orderValue
      : undefined;
  };

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useGovActionDetailDrepsTableStore();

  const govQuery = useFetchGovernanceVote(
    rows,
    (page ?? 1) * rows - rows,
    id,
    "DRep",
    order,
    sort,
  );

  const columns = [
    {
      key: "voter",
      render: item => {
        if (!item?.info?.id) return "-";
        return <GovVoterCell role='DRep' info={item.info} />;
      },
      title: "Voter",
      visible: columnsVisibility.voter,
      widthPx: 120,
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
        <div
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => {
            navigate({
              search: {
                sort: order === "stake" ? getColumnsSortOrder(sort) : "desc",
                order: getOrder("stake"),
              } as any,
            });

            return;
          }}
        >
          <span>Stake</span>
          <SortArrow direction={order === "stake" ? sort : undefined} />
        </div>
      ),
      visible: columnsVisibility.voting_power,
      widthPx: 90,
    },
    {
      key: "delegators",
      render: item => {
        if (!item?.info?.power?.represented_by) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>{item?.info?.power?.represented_by}</p>
        );
      },
      title: (
        <div
          className='flex w-full cursor-pointer items-center justify-end gap-1/2'
          onClick={() => {
            navigate({
              search: {
                sort:
                  order === "represented_by"
                    ? getColumnsSortOrder(sort)
                    : "desc",
                order: getOrder("represented_by"),
              } as any,
            });

            return;
          }}
        >
          <span>Delegators</span>
          <SortArrow
            direction={order === "represented_by" ? sort : undefined}
          />
        </div>
      ),
      visible: columnsVisibility.delegators,
      widthPx: 90,
    },
  ];

  const totalItems = govQuery.data?.pages[0].data.count;
  const items = govQuery.data?.pages.flatMap(page => page.data.data);

  return (
    <>
      <div className='mb-2 mt-1 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {govQuery.isLoading || govQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems !== undefined ? (
            <h3 className='basis-[230px] text-nowrap'>
              Total of {formatNumber(totalItems)} DReps
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
                columnsOptions={governanceActionDetailDrepSposTableOptions.map(
                  item => {
                    return {
                      label: item.name,
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
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={governanceActionDetailDrepSposTableOptions.map(
                item => {
                  return {
                    label: item.name,
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
      />
    </>
  );
};
