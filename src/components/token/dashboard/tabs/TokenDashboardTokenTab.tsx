import type { DeFiTokenTableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import TableSearchInput from "@/components/global/inputs/SearchInput";
import ExportButton from "@/components/table/ExportButton";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import GlobalTable from "@/components/table/GlobalTable";

import { Link, useSearch } from "@tanstack/react-router";
import { useFetchDeFiTokenList } from "@/services/token";
import { useEffect, useState } from "react";

import {
  formatNumberWithSuffix,
  formatString,
} from "@vellumlabs/cexplorer-sdk";
import { tokenDashboardListTableOptions } from "@/constants/tables/tokenDashboardListTableOptions";
import { useTokenDashboardListTableStore } from "@/stores/tables/tokenDashboardListTableStore";
import { currencySigns } from "@/constants/currencies";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { TitleSort } from "@/components/table/TitleSort";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";
import { calculateAdaPriceWithHistory } from "@/utils/calculateAdaPriceWithHistory";
import { adaHandlePolicy } from "@/constants/confVariables";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import AdaHandleBadge from "@/components/global/badges/AdaHandleBadge";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@/components/global/Image";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { encodeAssetName } from "@/utils/asset/encodeAssetName";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

type Volume = "1d" | "1m" | "1w" | "2w" | "3m";

export const TokenDashboardTokenTab: FC = () => {
  const { page, order, sort } = useSearch({
    from: "/token/dashboard/",
  });

  const [
    { debouncedTableSearch: debounceSearch, tableSearch },
    setTableSearch,
  ] = useSearchTable();

  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<Volume>("1d");

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    currency,
    setCurrency,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useTokenDashboardListTableStore();

  const curr = useAdaPriceWithHistory(currency as any);

  const query = useFetchDeFiTokenList(
    rows,
    (page ?? 1) * rows - rows,
    sort ?? "desc",
    order,
    debounceSearch ? debounceSearch : undefined,
  );

  const totalTokens = query.data?.pages[0]?.data?.count;
  const items = query.data?.pages.flatMap(page => page?.data?.data);

  const selectItems = [
    {
      key: "1d",
      value: "24 hours",
    },
    {
      key: "1w",
      value: "1 week",
    },
    {
      key: "2w",
      value: "2 week",
    },
    {
      key: "1m",
      value: "1 month",
    },
    {
      key: "3m",
      value: "3 month",
    },
  ];

  const columns = [
    {
      key: "order",
      standByRanking: true,
      render: () => null,
      title: <span>#</span>,
      visible: columnsVisibility.order,
      widthPx: 30,
    },
    {
      key: "token",
      render: item => {
        const assetName = item?.assetname;
        const isAdaHandle = assetName.includes(adaHandlePolicy);
        const fingerprint = getAssetFingerprint(assetName);
        const encodedNameArr = encodeAssetName(assetName).split("");

        return (
          <>
            <div className='relative flex w-full items-center gap-1'>
              <Link
                to='/asset/$fingerprint'
                params={{ fingerprint: fingerprint }}
              >
                <Image
                  type='asset'
                  height={40}
                  width={40}
                  className='aspect-square shrink-0 rounded-max'
                  src={generateImageUrl(assetName, "ico", "token")}
                  fallbackletters={[...encodedNameArr]
                    .filter(char =>
                      alphabetWithNumbers.includes(char.toLowerCase()),
                    )
                    .join("")}
                />
              </Link>
              <div
                className={`block w-full ${isAdaHandle ? "" : "overflow-hidden"} text-text-sm text-primary`}
              >
                <span className='flex w-full flex-col items-start'>
                  <Link
                    to='/asset/$fingerprint'
                    params={{ fingerprint: fingerprint }}
                    title={fingerprint}
                    key={fingerprint}
                    className={`flex w-full items-center text-text-sm text-primary`}
                  >
                    {isAdaHandle && (
                      <AdaHandleBadge variant='icon' className='h-2 w-2' />
                    )}
                    <span
                      className={`block overflow-hidden text-ellipsis whitespace-nowrap`}
                    >
                      {renderAssetName({ name: assetName })}
                    </span>

                    <Copy
                      copyText={renderAssetName({ name: assetName })}
                      className='ml-1'
                    />
                  </Link>
                  <span className='flex items-center gap-1/2'>
                    {renderAssetName({ name: assetName }) ? (
                      <p className='text-text-xs text-grayTextPrimary'>
                        {formatString(fingerprint, "long")}
                      </p>
                    ) : (
                      <Link
                        to='/asset/$fingerprint'
                        params={{ fingerprint: fingerprint }}
                        title={fingerprint}
                        key={fingerprint}
                        className='text-text-sm text-primary'
                      >
                        {formatString(fingerprint, "long")}
                      </Link>
                    )}
                    <Copy
                      size={renderAssetName({ name: assetName }) ? 10 : 13}
                      copyText={fingerprint}
                    />
                  </span>
                </span>
              </div>
            </div>
          </>
        );
      },
      title: <span>Token</span>,
      visible: columnsVisibility.token,
      widthPx: 100,
    },
    {
      key: "price",
      render: item => {
        const [ada, usd] = calculateAdaPriceWithHistory(
          item.price ? item.price * 1e6 : 0,
          curr,
        );

        return currency === "ada" ? (
          <p title={ada} className='text-right'>
            <AdaWithTooltip data={item.price} />
          </p>
        ) : (
          <p title={ada} className='text-right'>
            {currencySigns["usd"]} {formatNumberWithSuffix(usd)}
          </p>
        );
      },
      title: (
        <TitleSort titleOrder='price' order={order} sort={sort}>
          <p className='text-right'>
            <span
              className='inline-block cursor-pointer text-primary'
              onClick={e => {
                e.stopPropagation();
                setCurrency(currency === "ada" ? "usd" : "ada");
              }}
            >
              {currency === "ada" ? "ADA" : "USD"}
            </span>{" "}
            Price
          </p>
        </TitleSort>
      ),
      visible: columnsVisibility.price,
      widthPx: 80,
    },
    {
      key: "volume",
      render: item => {
        if (!item?.stat) {
          return <p className='text-right'>-</p>;
        }

        const volume = item?.stat[selectedItem]?.volume;

        if (!volume) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={volume} />
          </p>
        );
      },
      title: (
        <TitleSort titleOrder='volume' order={order} sort={sort}>
          <p className='text-right'>
            <span className='inline-block text-primary'>
              {selectedItem === "1d" ? "24h" : selectedItem}
            </span>{" "}
            Volume
          </p>
        </TitleSort>
      ),
      visible: columnsVisibility.volume,
      widthPx: 60,
    },
    {
      key: "liquidity",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item?.liquidity} />
        </p>
      ),
      title: (
        <TitleSort titleOrder='liquidity' order={order} sort={sort}>
          <p className='text-right'>Liquidity</p>
        </TitleSort>
      ),
      visible: columnsVisibility.liquidity,
      widthPx: 50,
    },
    {
      key: "age",
      render: item => <DateCell time={item.updated} />,
      title: <span>Age</span>,
      visible: columnsVisibility.age,
      widthPx: 70,
    },
    {
      key: "last_week",
      render: () => null,
      title: <span>Last 7 days</span>,
      visible: columnsVisibility.last_week,
      widthPx: 40,
    },
  ];

  useEffect(() => {
    if (totalTokens !== undefined && totalTokens !== totalItems) {
      setTotalItems(totalTokens);
    }
  }, [totalTokens, totalItems]);

  return (
    <>
      <div className='mb-1 flex w-full flex-col justify-between gap-1 min-[870px]:flex-row min-[870px]:items-center'>
        <div className='flex flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          <SortBy
            selectItems={selectItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem as any}
            labelName='Volume:'
          />

          <div className='flex w-fit justify-end min-[870px]:hidden'>
            <div className='flex items-center gap-1 min-[870px]:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={tokenDashboardListTableOptions.map(item => {
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
            placeholder='Search by asset name...'
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='min-[870px]:w-[320px] w-full '
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 min-[870px]:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={tokenDashboardListTableOptions.map(item => {
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
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={query}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof DeFiTokenTableColumns) -
            columnsOrder.indexOf(b.key as keyof DeFiTokenTableColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
