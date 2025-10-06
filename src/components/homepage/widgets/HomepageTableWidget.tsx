import type { WidgetDataTypes, WidgetTypes } from "@/types/widgetTypes";
import type { FC } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { Fragment, useRef } from "react";
import { Search } from "lucide-react";

import { useGetTableWidget } from "@/hooks/widget/useGetWidget";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useClickOutsideGroup } from "@/hooks/useClickOutsideGroup";

import { memo } from "react";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import { Pagination } from "@/components/global/Pagination";
import { paginateArray } from "@/utils/paginateArray";
import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Button from "@/components/global/Button";
import { Loading } from "@/components/global/Loading";

interface HomepageTableWidgetProps {
  rowHeight?: number;
  type: WidgetTypes;
  dataType: WidgetDataTypes;
  width: number;
}

const MemoCell = memo(function MemoizedCell({ children, ...props }: any) {
  return <TableCell {...props}>{children}</TableCell>;
});

export const HomepageTableWidget: FC<HomepageTableWidgetProps> = ({
  dataType,
  type,
  rowHeight,
  width,
}) => {
  const [initLoading, setInitLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [inputOpen, setInputOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const [tableSearch, setTableSearch] = useState<string>("");

  const debouncedTableSearch = useDebounce(tableSearch);

  const {
    columns: rawColumns,
    isLoading,
    items: itemsData,
    totalItems,
    optionalColumns,
    mobileColumns,
    miniTableColumnsOrder,
    overrideWidth,
    columnsVisibility,
    tableListOptions,
    optionalTableListOptions,
    mobileTableListOptions,
    placeholder,
    filterKeys,
    hasFilter,
    changeFilterByKey,
    setColumnVisibility,
  } = useGetTableWidget(type, dataType, page, debouncedTableSearch);

  const defaultPagination = itemsData && totalItems === itemsData.length;

  const [tableOptions, setTableOptions] = useState<any[] | undefined>(
    tableListOptions,
  );

  const totalPages =
    totalItems && itemsData
      ? debouncedTableSearch
        ? 1
        : Math.ceil(defaultPagination ? totalItems / 10 : totalItems / 20)
      : 0;

  const memoizedOverrideWidth = useMemo(
    () => overrideWidth,
    [Object.keys(overrideWidth).join(), Object.values(overrideWidth).join()],
  );
  const memoizedColumnsVisibility = useMemo(
    () => columnsVisibility,
    [
      Object.keys(columnsVisibility || {}).join(),
      Object.values(columnsVisibility || {}).join(),
    ],
  );

  const initialColumns = useMemo(() => {
    return rawColumns.map(col => ({
      ...col,
      widthPx: memoizedOverrideWidth[col.key]
        ? memoizedOverrideWidth[col.key]
        : 20,
    }));
  }, [rawColumns?.length, memoizedOverrideWidth]);

  const [columns, setColumns] = useState(initialColumns);

  const compareColumns = (cols1: any[], cols2: any[]) => {
    const normalize = cols =>
      cols.map(col => `${col.key}-${col.widthPx}-${col.visible}`).join("|");

    const normalized1 = normalize(cols1);
    const normalized2 = normalize(cols2);

    return normalized1 === normalized2;
  };

  const changeColumns = useCallback(
    (
      callbackFilter: (item: any) => boolean,
      sortFunc?: (a: any, b: any) => number,
    ) => {
      const newArr = initialColumns
        .filter(item => item.visible)
        .map(item => ({
          ...item,
          widthPx: memoizedOverrideWidth[item.key]
            ? memoizedOverrideWidth[item.key]
            : 20,
        }));
      const updatedColumns = newArr.filter(callbackFilter);
      if (sortFunc) {
        updatedColumns.sort(sortFunc);
      }

      if (!compareColumns(columns, updatedColumns)) {
        setColumns(updatedColumns);
      }
    },
    [initialColumns, memoizedOverrideWidth, columns],
  );

  const handleRemoveFilters = () => {
    if (!filterKeys || !changeFilterByKey) {
      return;
    }

    filterKeys.map(key => changeFilterByKey(key));
  };

  const sortByMiniTable = (a: any, b: any) =>
    miniTableColumnsOrder?.indexOf(a.key) -
    miniTableColumnsOrder?.indexOf(b.key);

  const removeOptional = (item: any) => optionalColumns.includes(item.key);

  const showMobile = (item: any) => mobileColumns.includes(item.key);

  const minTableWidth = useMemo(
    () =>
      columns
        .filter(column => column.visible)
        .reduce(
          (totalWidth, column) => totalWidth + (column.widthPx || 100),
          0,
        ),
    [columns],
  );

  const items = defaultPagination
    ? paginateArray(itemsData, page, 10)
    : itemsData;

  useClickOutsideGroup([inputRef], () => {
    setInputOpen(false);
  });

  useEffect(() => {
    let nextColumns: any[] = [];

    if (width < 2) {
      changeColumns(showMobile, sortByMiniTable);
      setTableOptions(mobileTableListOptions);
      return;
    }

    if (width === 2) {
      changeColumns(removeOptional, sortByMiniTable);
      setTableOptions(optionalTableListOptions);
      return;
    }

    if (width > 2) {
      nextColumns = initialColumns
        .filter(item => item.visible)
        .map(item => ({
          ...item,
          widthPx: memoizedOverrideWidth[item.key] ?? 20,
        }));

      setColumns(nextColumns);
      setTableOptions(tableListOptions);
    }
  }, [
    width,
    memoizedColumnsVisibility,
    initialColumns?.length,
    memoizedOverrideWidth,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setInitLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (initLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className='absolute right-28 top-2'>
        <TableSettingsDropdown
          rows={0}
          setRows={() => {}}
          visibleRows={false}
          columnsOptions={
            columnsVisibility && setColumnVisibility && tableOptions
              ? tableOptions.map(item => {
                  return {
                    label: item.name,
                    isVisible: columnsVisibility[item?.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  };
                })
              : []
          }
        />
      </div>
      <div className='absolute bottom-[20px] left-1/2 -translate-x-1/2 transform'>
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
        />
      </div>
      {width > 1 && (
        <div className='absolute right-40 top-[8px]'>
          <PaginationPrevious
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
          />
          <PaginationNext
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          />
        </div>
      )}
      {width > 1 && (
        <div
          className='absolute right-[260px] top-[11px] flex h-[30px] items-center'
          ref={inputRef}
        >
          <Search
            size={15}
            className={`absolute ${inputOpen ? "left-2" : "-left-4"} cursor-pointer rounded-lg`}
            onClick={() => setInputOpen(true)}
            color={inputOpen ? "black" : undefined}
          />
          <input
            type='text'
            className={`${inputOpen ? "min-h-[25.6px] w-[200px] border border-border pl-3" : "w-0"} transition-width overflow-hidden rounded-lg text-xs text-black duration-300 ease-in-out focus-within:outline-none hover:outline-none`}
            placeholder={placeholder}
            value={tableSearch}
            onChange={e => setTableSearch(e.currentTarget.value)}
          />
        </div>
      )}
      {hasFilter && (
        <Button
          variant='tertiary'
          size='md'
          label='Remove filters'
          className='absolute left-28 top-[6px]'
          onClick={handleRemoveFilters}
        />
      )}
      <div
        className={`thin-scrollbar relative w-full max-w-desktop overflow-x-hidden [&>div]:w-full`}
        style={{
          transform: "rotateX(180deg)",
        }}
      >
        <Table
          style={{
            transform: "rotateX(180deg)",
            minWidth: `${minTableWidth}px`,
          }}
          className='thin-scrollbar border-separate border-spacing-0 transition-all duration-300'
        >
          <TableHeader
            className={`"relative top-0 z-10 ${!isLoading ? "border-none" : ""}`}
          >
            <tr className=''>
              {columns.map(({ title, key, widthPx, visible }) => (
                <Fragment key={key}>
                  {visible && (
                    <TableHead
                      draggable
                      style={{
                        maxWidth: `${widthPx || 200}px`,
                        width: `${widthPx}px`,
                      }}
                      className={`relative box-border table-cell bg-darker font-semibold first:pl-4 last:pr-4`}
                    >
                      {title}
                    </TableHead>
                  )}
                </Fragment>
              ))}
            </tr>
          </TableHeader>
          <TableBody className='text-grayTextPrimary'>
            {isLoading ? (
              <>
                {Array.from(
                  { length: 10 },
                  (_, index) => index + 1 * 10 - 1,
                ).map(index => (
                  <TableRow
                    style={{
                      height: rowHeight ? `${rowHeight}px` : `49px`,
                      maxHeight: rowHeight ? `${rowHeight}px` : `49px`,
                    }}
                    key={index}
                  >
                    {columns.map(({ key, widthPx, visible, className }) => (
                      <Fragment key={key}>
                        {visible && (
                          <MemoCell
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                              height: rowHeight ? `${rowHeight}px` : `49px`,
                              maxHeight: rowHeight ? `${rowHeight}px` : `49px`,
                            }}
                            className={`${index % 2 !== 0 ? "bg-darker" : ""} table-cell py-1 text-left first:pl-4 last:pr-4 [&>a]:text-primary ${className}`}
                          >
                            <LoadingSkeleton height='20px' />
                          </MemoCell>
                        )}
                      </Fragment>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {items?.map((item, index) => (
                  <TableRow
                    style={{
                      height: rowHeight ? `${rowHeight}px` : `49px`,
                      maxHeight: rowHeight ? `${rowHeight}px` : `49px`,
                    }}
                    key={index}
                    className={`${index % 2 !== 0 ? "bg-darker" : ""} group duration-150`}
                  >
                    {columns.map(
                      ({
                        key,
                        widthPx,
                        render,
                        visible,
                        className,
                        standByRanking,
                        rankingStart,
                      }) => (
                        <Fragment key={key}>
                          {visible && (
                            <MemoCell
                              style={{
                                maxWidth: `${widthPx || 100}px`,
                                width: `${widthPx || 100}px`,
                                height: rowHeight ? `${rowHeight}px` : `49px`,
                                maxHeight: rowHeight
                                  ? `${rowHeight}px`
                                  : `49px`,
                              }}
                              className={`table-cell py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover ${className}`}
                            >
                              {!standByRanking
                                ? item && render(item)
                                : rankingStart === "asc"
                                  ? 10 - index
                                  : 10 * (1 - 1) + index + 1}
                            </MemoCell>
                          )}
                        </Fragment>
                      ),
                    )}
                  </TableRow>
                ))}
              </>
            )}

            {isLoading && (
              <>
                {Array.from(
                  { length: 10 },
                  (_, index) => index + 1 * 10 - 1,
                ).map(index => (
                  <TableRow
                    style={{
                      height: rowHeight ? `${rowHeight}px` : `49px`,
                      maxHeight: rowHeight ? `${rowHeight}px` : `49px`,
                    }}
                    className={`${index % 2 !== 0 ? "bg-darker" : ""}`}
                    key={index}
                  >
                    {columns.map(({ key, widthPx, visible }) => (
                      <Fragment key={key}>
                        {visible && (
                          <MemoCell
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                              height: rowHeight ? `${rowHeight}px` : `49px`,
                              maxHeight: rowHeight ? `${rowHeight}px` : `49px`,
                            }}
                            className={`table-cell py-1 text-left first:pl-4 last:pr-4`}
                          >
                            <LoadingSkeleton height='20px' />
                          </MemoCell>
                        )}
                      </Fragment>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
