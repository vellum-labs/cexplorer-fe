import type { FC } from "react";
import { useState, useRef } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { DollarIcon } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useFetchAssetMint } from "@/services/assets";
import { adaHandlePolicy } from "@/constants/confVariables";
import { useHandlesListTableStore } from "@/stores/tables/handlesListTableStore";
import { handlesListTableOptions } from "@/constants/tables/handlesListTableOptions";
import type { AssetMint } from "@/types/assetsTypes";
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

  const query = useFetchAssetMint(
    rows,
    offset,
    debouncedSearch || undefined,
    adaHandlePolicy,
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
      render: (item: AssetMint) =>
        item.tx?.time ? <DateCell time={item.tx.time} /> : "-",
      title: "Asset minted",
      visible: columnsVisibility.minted,
      widthPx: 150,
    },
    {
      key: "standard",
      render: (item: AssetMint) => {
        const standard = getHandleStandard(item.asset?.name ?? "");
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
      render: (item: AssetMint) => {
        const nameHex = item.asset?.name ?? "";
        const cleanedHex = nameHex.replace(/^(000de140|0014df10|000643b0)/, "");
        const handleName = encodeAssetName(cleanedHex);
        return (
          <Link
            to='/handle-dns'
            search={{ page: 1, search: undefined, tab: "validator", handle: `$${handleName}` }}
            className='flex items-center gap-1/2 text-text hover:text-primary'
          >
            <img src={DollarIcon} alt='$' className='h-[14px] w-[14px]' />
            {handleName}
          </Link>
        );
      },
      title: "Asset",
      visible: columnsVisibility.handle,
      widthPx: 200,
    },
    {
      key: "policy",
      render: (item: AssetMint) => {
        const policy = item.asset?.policy ?? "";
        return (
          <Link
            to='/policy/$policyId'
            params={{ policyId: policy }}
            className='text-primary'
          >
            {formatString(policy, "short")}
          </Link>
        );
      },
      title: "Policy ID",
      visible: columnsVisibility.policy,
      widthPx: 140,
    },
    {
      key: "quantity",
      render: (item: AssetMint) => {
        const qty = item.quantity ?? 0;
        const isPositive = qty > 0;
        return (
          <span className={isPositive ? "text-greenText" : "text-redText"}>
            {isPositive ? `+${qty}` : qty}
          </span>
        );
      },
      title: "Mint quantity",
      visible: columnsVisibility.quantity,
      widthPx: 100,
    },
    {
      key: "transaction",
      render: (item: AssetMint) => {
        const hash = item.tx?.hash ?? "";
        return (
          <Link to='/tx/$hash' params={{ hash }} className='text-primary'>
            {formatString(hash, "short")}
          </Link>
        );
      },
      title: "Transaction",
      visible: columnsVisibility.transaction,
      widthPx: 140,
    },
  ];

  return (
    <div className='flex w-full flex-col gap-3'>
      <div className='flex w-full flex-col gap-2'>
        <div className='flex w-full flex-wrap items-end justify-between gap-1'>
          {totalItems > 0 && (
            <h3 className='text-text-lg font-medium'>
              Total of {totalItems.toLocaleString()} handles
            </h3>
          )}
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
