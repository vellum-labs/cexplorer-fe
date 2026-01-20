import type { FC } from "react";
import { useState, useRef } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useFetchAdaHandleList } from "@/services/assets";
import { useHandlesListTableStore } from "@/stores/tables/handlesListTableStore";
import { handlesListTableOptions } from "@/constants/tables/handlesListTableOptions";
import type { AdaHandleListItem } from "@/types/assetsTypes";
import { getHandleStandard } from "@/utils/getHandleStandard";

export const RecentlyMintedHandlesTab: FC = () => {
  const { page, search: urlSearch } = useSearch({ from: "/handle-dns/" });
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(urlSearch ?? "");
  const debouncedSearch = useDebounce(searchValue.replace(/^\$/, ""), 500);

  const { columnsVisibility, setColumnVisibility, rows, setRows } =
    useHandlesListTableStore()();

  const offset = ((page ?? 1) - 1) * rows;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    navigate({
      to: "/handle-dns",
      search: {
        page: 1,
        search: value || undefined,
        tab: undefined,
        handle: undefined,
      },
    });
  };

  const query = useFetchAdaHandleList(
    rows,
    offset,
    debouncedSearch || undefined,
  );

  const items =
    query.data?.pages?.flatMap(page => page?.data?.data ?? []) ?? [];
  const totalFromQuery = query.data?.pages?.[0]?.data?.count ?? 0;
  const totalRef = useRef(0);
  if (totalFromQuery > 0) {
    totalRef.current = totalFromQuery;
  }
  const totalItems = totalRef.current;

  const columns = [
    {
      key: "minted",
      render: (item: AdaHandleListItem) => {
        return item.last_mint ? <DateCell time={item.last_mint} /> : "-";
      },
      title: "Asset minted",
      visible: columnsVisibility.minted,
      widthPx: 150,
    },
    {
      key: "standard",
      render: (item: AdaHandleListItem) => {
        const standard = getHandleStandard(item.hex);
        return (
          <Badge color='gray' className='min-w-[95px] justify-center'>
            {standard}
          </Badge>
        );
      },
      title: "Standard",
      visible: columnsVisibility.standard,
      widthPx: 130,
    },
    {
      key: "handle",
      render: (item: AdaHandleListItem) => {
        return (
          <Link
            to='/handle-dns'
            search={{ page: 1, search: undefined, tab: "validator", handle: `$${item.name}` }}
            className='flex items-center gap-1/2 text-text hover:text-primary'
          >
            <img src={DollarIcon} alt='$' className='h-[14px] w-[14px]' />
            {item.name}
          </Link>
        );
      },
      title: "Asset",
      visible: columnsVisibility.handle,
      widthPx: 200,
    },
    {
      key: "rarity",
      render: (item: AdaHandleListItem) => {
        const rarityColors: Record<string, "gray" | "blue" | "purple" | "yellow"> = {
          basic: "gray",
          common: "blue",
          rare: "purple",
          ultra_rare: "yellow",
        };
        const color = rarityColors[item.rarity] ?? "gray";
        const displayRarity = item.rarity?.replace(/_/g, " ") ?? "unknown";
        return (
          <Badge color={color} className='min-w-[80px] justify-center capitalize'>
            {displayRarity}
          </Badge>
        );
      },
      title: "Rarity",
      visible: columnsVisibility.rarity,
      widthPx: 120,
    },
    {
      key: "holder",
      render: (item: AdaHandleListItem) => {
        const holderAddress = item.holder?.holder ?? "";
        return (
          <Link
            to='/stake/$stakeAddr'
            params={{ stakeAddr: holderAddress }}
            className='text-primary'
          >
            {formatString(holderAddress, "short")}
          </Link>
        );
      },
      title: "Holder",
      visible: columnsVisibility.holder,
      widthPx: 140,
    },
  ];

  return (
    <div className='flex w-full flex-col gap-3'>
      <div className='flex w-full flex-col gap-2'>
        <div className='flex w-full flex-wrap items-end justify-between gap-1'>
          {query.isLoading && totalItems === 0 ? (
            <LoadingSkeleton height='27px' width='220px' />
          ) : totalItems > 0 ? (
            <h3 className='text-text-lg font-medium'>
              Total of {totalItems.toLocaleString()} handles
            </h3>
          ) : null}
          <div className='flex items-center gap-1'>
            <TableSearchInput
              value={searchValue}
              onchange={handleSearchChange}
              placeholder='Search for a handle...'
              showSearchIcon
              wrapperClassName='hidden w-[320px] md:flex'
              showPrefixPopup={false}
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={handlesListTableOptions.map(item => ({
                label: item.name,
                isVisible: columnsVisibility[item.key],
                onClick: () =>
                  setColumnVisibility(item.key, !columnsVisibility[item.key]),
              }))}
            />
          </div>
        </div>
        <TableSearchInput
          value={searchValue}
          onchange={handleSearchChange}
          placeholder='Search for a handle...'
          showSearchIcon
          wrapperClassName='flex w-full md:hidden'
          showPrefixPopup={false}
        />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        rowHeight={50}
        minContentWidth={900}
        scrollable
        query={query}
        items={items}
        columns={columns}
      />
    </div>
  );
};
