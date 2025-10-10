import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";

import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { isMobileDevice } from "@/utils/isMobileDevice";
import { paginateArray } from "@/utils/paginateArray";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import type { MouseEventHandler, ReactNode, RefObject } from "react";
import React, { useEffect, useRef, useState } from "react";
import { NoResultsFound } from "../global/NoResultsFound";
import { Pagination } from "../global/Pagination";
import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";
import { Funnel } from "lucide-react";
import { FunnelFilter } from "../global/FunnelFilter";

export type Column<T> = {
  key: string;
  title: React.ReactNode;
  standByRanking?: boolean;
  render: (item: T) => React.ReactNode | null;
  extraContent?: React.ReactNode;
  widthPx?: number;
  visible?: boolean;
  rankingStart?: "asc" | "desc";
  className?: string;
  filter?: {
    filterOpen?: boolean;
    activeFunnel?: boolean;
    filterContent?: ReactNode;
    filterButtonDisabled?: boolean;
    anchorRef: RefObject<any>;
    width?: string;
    onShow?: MouseEventHandler<SVGSVGElement>;
    onReset?: () => void;
    onFilter?: () => void;
  };
};

type PropsBase<T> = {
  items: T[] | undefined;
  columns: Column<T>[];
  scrollable?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  standByRanking?: boolean;
  onOrderChange?: (columns: any[]) => void;
  minContentWidth?: number;
  disableDrag?: boolean;
  rowHeight?: number;
};
interface InfiniteQueryProps<T> extends PropsBase<T> {
  type: "infinite";
  query: UseInfiniteQueryResult<InfiniteData<any>, unknown>;
  currentPage: number;
}

interface QueryProps<T> extends PropsBase<T> {
  type: "default";
  query: UseQueryResult<any, unknown>;
  pagination?: boolean;
}

type Props<T> = InfiniteQueryProps<T> | QueryProps<T>;

const GlobalTable = <T extends Record<string, any>>({
  items: baseItems,
  columns: initialColumns,
  scrollable,
  totalItems = 0,
  itemsPerPage = 20,
  query,
  onOrderChange,
  minContentWidth = 1100,
  disableDrag = false,
  rowHeight = 60,
  type,
  ...props
}: Props<T>) => {
  const defaultQueryPagination =
    "pagination" in props && props.pagination === true;
  const currentPage = "currentPage" in props ? props.currentPage : 1;
  const [defaultQueryCurrentPage, setDefaultQueryCurrentPage] =
    useState<number>(currentPage);

  const items =
    "pagination" in props
      ? defaultQueryPagination
        ? paginateArray(baseItems as T[], defaultQueryCurrentPage, itemsPerPage)
        : baseItems
      : baseItems;

  const { infiniteScrolling } = useInfiniteScrollingStore();
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalItems / itemsPerPage),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [columns, setColumns] = useState(initialColumns);
  const [scrolled, setScrolled] = useState(false);
  const isEmpty = items?.length === 0 || !items || totalItems === 0;
  const navigate = useNavigate();
  const isLoading =
    query.isLoading || (query as UseInfiniteQueryResult).isFetchingNextPage;
  const targetRef = useRef<HTMLTableElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  const [firstClickedColumnIndex, setFirstClickedColumnIndex] = useState<
    number | null
  >(null);

  const handleColumnClick = (index: number) => {
    if (!isMobileDevice()) return;
    if (disableDrag || !onOrderChange) return;
    if (firstClickedColumnIndex === null) {
      setFirstClickedColumnIndex(index);
    } else {
      const newColumns = [...columns];
      [newColumns[firstClickedColumnIndex], newColumns[index]] = [
        newColumns[index],
        newColumns[firstClickedColumnIndex],
      ];
      setColumns(newColumns);
      onOrderChange && onOrderChange(newColumns.map(({ key }) => key));
      setColumns(newColumns);
      setFirstClickedColumnIndex(null);
    }
  };

  const handleDragStart = (index: number) => {
    if (isMobileDevice() || !onOrderChange) return;
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (isMobileDevice()) return;
    e.preventDefault();
    setIsDragging(false);
    setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (isMobileDevice()) return;
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newColumns = [...columns];
      const draggedItem = newColumns.splice(draggedIndex, 1)[0];
      newColumns.splice(dropIndex, 0, draggedItem);
      setColumns(newColumns);
      onOrderChange && onOrderChange(newColumns.map(({ key }) => key));
    }
    setIsDragging(false);
    setOverIndex(null);
  };

  const indexToRound =
    items?.length && items.length < itemsPerPage
      ? items.length - 1
      : itemsPerPage
        ? itemsPerPage - 1
        : items !== undefined
          ? items?.length - 1
          : 0;

  useEffect(() => {
    if ("pagination" in props) {
      setTotalPages(
        Array.isArray(baseItems)
          ? Math.ceil(baseItems.length / itemsPerPage)
          : 0,
      );
    }
  }, [items]);

  useEffect(() => {
    if (!items && !isLoading) {
      setTotalPages(0);
      return;
    }

    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage, items, isLoading]);

  useEffect(() => {
    const fetchOnScroll = () => {
      if (
        targetRef.current &&
        targetRef.current.getBoundingClientRect().bottom <
          window.innerHeight + 200 &&
        !isLoading &&
        (query as UseInfiniteQueryResult).fetchNextPage
      ) {
        (query as UseInfiniteQueryResult).fetchNextPage();
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    if (infiniteScrolling) {
      addEventListener("scroll", fetchOnScroll, { signal });
    }

    return () => {
      controller.abort();
    };
  }, [infiniteScrolling, query, isLoading, currentPage, navigate]);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const top = headerRef.current.getBoundingClientRect().top;
        setScrolled(top <= 0);
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("scroll", handleScroll, { signal });
    return () => {
      controller.abort();
    };
  }, [headerRef]);

  useEffect(() => {
    if (!targetRef.current) return;

    const handleClick = (e: MouseEvent) => {
      if (targetRef.current?.contains(e.target as Node)) return;
      setFirstClickedColumnIndex(null);
    };

    document.addEventListener("mousedown", e => handleClick(e), {
      capture: true,
    });

    return () => {
      document.removeEventListener("mousedown", e => handleClick(e), {
        capture: true,
      });
    };
  }, [targetRef]);

  return (
    <>
      <div
        className={`thin-scrollbar relative w-full max-w-desktop rounded-l border border-border ${scrollable && `overflow-x-auto xl:overflow-visible [&>div]:w-full`}`}
        style={{
          transform: "rotateX(180deg)",
        }}
      >
        <Table
          style={{
            transform: "rotateX(180deg)",
            minWidth: `${minContentWidth}px`,
          }}
          className='thin-scrollbar border-separate border-spacing-0'
          ref={targetRef}
        >
          <TableHeader
            ref={headerRef}
            className={`${infiniteScrolling ? "sticky" : "relative"} ${scrolled && infiniteScrolling ? "shadow-md" : ""} top-0 z-10 ${isEmpty && !isLoading ? "border-none" : ""} ${disableDrag && "pointer-events-none"}`}
          >
            <tr className=''>
              {columns.map(({ title, widthPx, visible, filter }, index) => (
                <React.Fragment key={index + "head"}>
                  {visible && (
                    <TableHead
                      key={index + "header"}
                      draggable
                      onDragStart={
                        onOrderChange ? () => handleDragStart(index) : undefined
                      }
                      onDragOver={
                        onOrderChange
                          ? e => handleDragOver(e, index)
                          : undefined
                      }
                      onDrop={
                        onOrderChange ? e => handleDrop(e, index) : undefined
                      }
                      onClick={() => handleColumnClick(index)}
                      style={{
                        maxWidth: `${widthPx || 200}px`,
                        width: `${widthPx}px`,
                        filter:
                          firstClickedColumnIndex !== null &&
                          firstClickedColumnIndex !== index
                            ? `hue-rotate(${index * 20}deg)`
                            : "none",
                      }}
                      className={`relative box-border rounded-t-xl border-b border-border bg-darker font-semibold ${isMobileDevice() || !onOrderChange ? "cursor-pointer" : "cursor-move"} last:pr-4 ${firstClickedColumnIndex !== null && firstClickedColumnIndex !== index && `bg-yellow-200/20 border border-dashed border-yellow-400`} table-cell first:pl-4 ${firstClickedColumnIndex !== null && "text-text [&>p]:text-text"} ${firstClickedColumnIndex === index || (isDragging && draggedIndex === index && "border border-dashed border-text text-grayTextPrimary [&>p]:text-grayTextPrimary")} ${overIndex === index && "bg-border"}`}
                    >
                      <div className='flex items-center gap-1/2'>
                        {title}
                        {filter && (
                          <Funnel
                            size={15}
                            className={`inline min-w-[20px] cursor-pointer ${filter?.activeFunnel ? "text-primary" : ""}`}
                            onClick={filter.onShow}
                            onMouseDown={e => e.stopPropagation()}
                          />
                        )}
                        {filter?.filterOpen && (
                          <FunnelFilter
                            anchorRef={filter.anchorRef}
                            onReset={filter.onReset}
                            onFilter={filter.onFilter}
                            disabled={filter.filterButtonDisabled}
                            width={filter?.width}
                          >
                            {filter.filterContent}
                          </FunnelFilter>
                        )}
                      </div>
                    </TableHead>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </TableHeader>
          <TableBody className='text-grayTextPrimary'>
            {isLoading && !infiniteScrolling ? (
              <>
                {Array.from(
                  { length: itemsPerPage },
                  (_, index) =>
                    index + currentPage * itemsPerPage - itemsPerPage,
                ).map(index => (
                  <TableRow
                    style={{
                      height: `${rowHeight}px`,
                      maxHeight: `${rowHeight}px`,
                    }}
                    key={"loaderTr" + index}
                  >
                    {columns.map(({ widthPx, visible, className }, i) => (
                      <React.Fragment key={"loaderTh" + i}>
                        {visible && (
                          <TableCell
                            key={`loaderTh-${index}-${i}`}
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                              height: `${rowHeight}px`,
                              maxHeight: `${rowHeight}px`,
                            }}
                            className={`${index % 2 !== 0 ? "bg-darker" : ""} ${indexToRound === index ? "first:rounded-bl-xl last:rounded-br-xl" : ""} table-cell py-1 text-left first:pl-4 last:pr-4 [&>a]:text-primary ${className}`}
                          >
                            <LoadingSkeleton height='20px' />
                          </TableCell>
                        )}
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {items?.map((item, index) => (
                  <TableRow
                    style={{
                      height: `${rowHeight}px`,
                      maxHeight: `${rowHeight}px`,
                    }}
                    key={`tr${index}`}
                    className={`${index % 2 !== 0 ? "bg-darker" : ""} group duration-150`}
                  >
                    {columns.map(
                      (
                        {
                          widthPx,
                          render,
                          visible,
                          className,
                          standByRanking,
                          rankingStart,
                        },
                        i,
                      ) => (
                        <React.Fragment key={"th" + i}>
                          {visible && (
                            <TableCell
                              key={`th-${index}-${i}`}
                              style={{
                                maxWidth: `${widthPx || 100}px`,
                                width: `${widthPx || 100}px`,
                                height: `${rowHeight}px`,
                                maxHeight: `${rowHeight}px`,
                              }}
                              className={`${indexToRound === index ? "first:rounded-bl-xl last:rounded-br-xl" : ""} table-cell py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover ${className}`}
                            >
                              {!standByRanking
                                ? item && render(item)
                                : rankingStart === "asc"
                                  ? (totalItems ?? 0) - index
                                  : itemsPerPage * (currentPage - 1) +
                                    index +
                                    1}
                            </TableCell>
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </TableRow>
                ))}
              </>
            )}

            {isLoading && infiniteScrolling && (
              <>
                {Array.from(
                  { length: itemsPerPage },
                  (_, index) =>
                    index + currentPage * itemsPerPage - itemsPerPage,
                ).map(index => (
                  <TableRow
                    style={{
                      height: `${rowHeight}px`,
                      maxHeight: `${rowHeight}px`,
                    }}
                    className={`${index % 2 !== 0 ? "bg-darker" : ""}`}
                    key={"infiniteLoader" + index}
                  >
                    {columns.map(({ widthPx, visible }, i) => (
                      <React.Fragment key={"infiniteLoader" + index + i}>
                        {visible && (
                          <TableCell
                            key={"infiniteLoaderTd" + index + i}
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                              height: `${rowHeight}px`,
                              maxHeight: `${rowHeight}px`,
                            }}
                            className={`${indexToRound === index ? "first:rounded-bl-xl last:rounded-br-xl" : ""} table-cell py-1 text-left first:pl-4 last:pr-4`}
                          >
                            <LoadingSkeleton height='20px' />
                          </TableCell>
                        )}
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && !items?.length && <NoResultsFound />}

      {!infiniteScrolling &&
        totalItems > itemsPerPage &&
        !defaultQueryPagination &&
        (query as UseInfiniteQueryResult).fetchNextPage && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}

      {!infiniteScrolling &&
        defaultQueryPagination &&
        totalItems > itemsPerPage &&
        (totalPages === defaultQueryCurrentPage ||
          Number(items?.length) >= itemsPerPage) && (
          <Pagination
            currentPage={defaultQueryCurrentPage}
            setCurrentPage={setDefaultQueryCurrentPage}
            totalPages={totalPages}
          />
        )}
      {(type === "default" && defaultQueryPagination && !!items?.length) ||
        (type === "infinite" && !!items?.length && (
          <span className='mt-1 flex w-full justify-center text-text-sm text-grayTextPrimary'>
            {totalItems > 0 && items?.length
              ? `Displaying ${items.length > totalItems ? totalItems : items.length} out of ${totalItems} items`
              : "No items for displaying"}
          </span>
        ))}
    </>
  );
};

export default GlobalTable;
