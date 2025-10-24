import type { EpochListData } from "@/types/epochTypes";
import type { EpochListColumns } from "@/types/tableTypes";
import type { FC } from "react";

import TableSettingsDropdown from "../../global/dropdowns/TableSettingsDropdown";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "../../table/GlobalTable";
import ExportButton from "@/components/table/ExportButton";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import { useEpochListTableStore } from "@/stores/tables/epochListTableStore";
import { epochListTableOptions } from "@/constants/tables/epochListTableOptions";
import { useEpochList } from "@/hooks/tables/useEpochList";

interface EpochsTabItemProps {
  epoch_number: number;
  data: EpochListData[];
}

export const EpochsTabItem: FC<EpochsTabItemProps> = ({
  epoch_number,
  data,
}) => {
  const {
    columnsVisibility,
    columnsOrder,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useEpochListTableStore()();

  const { columns, epochListQuery, filteredData, setTableSearch, tableSearch } =
    useEpochList({ data, epoch_number });

  return (
    <>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {epochListQuery.isLoading || epochListQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : epoch_number > 0 ? (
            <h3 className='basis-[230px] text-nowrap'>
              Total of {formatNumber(epoch_number)} epochs
            </h3>
          ) : (
            ""
          )}
          <div className='flex w-full justify-end md:hidden'>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton
                columns={columns}
                items={filteredData.filter(item => {
                  if (/\D/.test(tableSearch)) {
                    return true;
                  }

                  return String(item.no).includes(tableSearch);
                })}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={epochListTableOptions.map(item => {
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
            placeholder='Search  your results...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton
              columns={columns}
              items={filteredData.filter(item => {
                if (/\D/.test(tableSearch)) {
                  return true;
                }

                return String(item.no).includes(tableSearch);
              })}
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={epochListTableOptions.map(item => {
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
        pagination={true}
        totalItems={epoch_number}
        itemsPerPage={rows}
        rowHeight={67}
        minContentWidth={1100}
        scrollable
        query={epochListQuery}
        items={filteredData.filter(item => {
          if (/\D/.test(tableSearch)) {
            return true;
          }

          return String(item.no).includes(tableSearch);
        })}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof EpochListColumns) -
            columnsOrder.indexOf(b.key as keyof EpochListColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
