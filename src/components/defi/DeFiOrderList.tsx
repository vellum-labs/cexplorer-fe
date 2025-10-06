import type { FC } from "react";
import type { DeFiOrderListColumns, TableColumns } from "@/types/tableTypes";
import type { DeFiOrder } from "@/types/tokenTypes";

import { ArrowRight, Check, Ellipsis, FileText, X } from "lucide-react";

import PulseDot from "../global/PulseDot";
import ExportButton from "../table/ExportButton";
import TableSettingsDropdown from "../global/dropdowns/TableSettingsDropdown";
import GlobalTable from "../table/GlobalTable";
import DateCell from "../table/DateCell";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import TextInput from "../global/inputs/TextInput";
import Copy from "../global/Copy";
import { Tooltip } from "../ui/tooltip";
import { TimeDateIndicator } from "../global/TimeDateIndicator";

import { defiOrderListTableOptions } from "@/constants/tables/defiOrderListTableOptions";
import {
  formatNumber,
  formatNumberWithSuffix,
  formatString,
} from "@/utils/format/format";
import { ADATokenName, currencySigns } from "@/constants/currencies";

import DexhunterIcon from "@/resources/images/icons/dexhunter.svg";

import { useDeFiOrderListTableStore } from "@/stores/tables/deFiOrderListTableStore";
import { useFetchDeFiOrderList } from "@/services/token";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { useFetchMiscSearch } from "@/services/misc";
import { useLocaleStore } from "@/stores/localeStore";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

import { renderAssetName } from "@/utils/asset/renderAssetName";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { addressIcons } from "@/constants/address";
import { calculateAdaPriceWithHistory } from "@/utils/calculateAdaPriceWithHistory";
import useDebounce from "@/hooks/useDebounce";

interface DeFiOrderListProps {
  page?: number;
  storeKey?: string;
  stakeAddress?: string;
  address?: string;
  tx?: string;
  assetName?: string;
  disableSearchSync?: boolean;
  tabName?: string;
  pulseDot?: boolean;
  titleClassname?: string;
}

interface FilterType {
  type: "sell" | "buy";
  value: string | undefined;
}

export const DeFiOrderList: FC<DeFiOrderListProps> = ({
  page,
  storeKey,
  stakeAddress,
  address,
  tx,
  assetName,
  disableSearchSync = true,
  tabName,
  pulseDot = true,
  titleClassname,
}) => {
  const { locale } = useLocaleStore();

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    currency,
    setColumnVisibility,
    setColumsOrder,
    setRows,
    setCurrency,
  } = useDeFiOrderListTableStore(storeKey)();

  const {
    filterVisibility,
    filter,
    hasFilter,
    anchorRefs,
    filterDraft,
    changeDraftFilter,
    changeFilterByKey,
    toggleFilter,
  } = useFilterTable({
    storeKey,
    filterKeys: ["type", "status", "maker", "dex"],
    parseMap: {
      type: value => (value ? JSON.parse(value) : undefined),
    },
    disableSearchSync,
    tabName,
  });

  const debouncedFilterDraftValue = useDebounce(
    filterDraft["type"] ? filterDraft["type"].value : "",
  );

  const { data } = useFetchMiscSearch(
    debouncedFilterDraftValue ? debouncedFilterDraftValue : undefined,
    "asset",
    locale,
  );

  const validFilterTypeValue = Array.isArray(data?.data) && data?.data.length;

  const filterByType = (type: "buy" | "sell") =>
    filter.type
      ? JSON.parse(filter.type).type === type
        ? JSON.parse(filter.type).value
        : undefined
      : undefined;

  const query = useFetchDeFiOrderList(
    rows,
    (page ?? 1) * rows - rows,
    address ?? (filter.maker?.startsWith("stake") ? undefined : filter.maker),
    stakeAddress ??
      (filter.maker?.startsWith("stake") ? filter.maker : undefined),
    filter.status,
    filter.dex,
    tx,
    assetName,
    filterByType("buy"),
    filterByType("sell"),
  );

  const items = query.data?.pages.flatMap(page => page.data?.data);
  const totalItems = query.data?.pages[0].data?.count;

  const curr = useAdaPriceWithHistory(currency as any);

  const columns: TableColumns<DeFiOrder> = [
    {
      key: "date",
      render: item => (
        <Tooltip content={<TimeDateIndicator time={item?.submission_time} />}>
          <DateCell time={item?.submission_time} />
        </Tooltip>
      ),
      title: "Date",
      visible: columnsVisibility.date,
      widthPx: 60,
    },
    {
      key: "tx",
      render: item => (
        <div className='flex items-center gap-2'>
          <Link
            to='/dex/swap/$hash'
            params={{
              hash: item?.tx_hash,
            }}
            className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm text-primary`}
          >
            {formatString(item?.tx_hash, "short")}
          </Link>
          <Copy copyText={item?.tx_hash} />
        </div>
      ),
      title: "Transaction",
      visible: columnsVisibility.tx,
      widthPx: 70,
    },
    {
      key: "type",
      render: item => {
        if (!item?.token_in?.name || !item?.token_out?.name) {
          return "-";
        }

        const isBuying = item?.token_in?.name === ADATokenName;

        return (
          <div
            className={`flex w-[50px] items-center justify-center rounded-md px-[6px] py-[2px] text-sm font-medium text-white ${isBuying ? "bg-greenText" : "bg-redText"}`}
          >
            {isBuying ? "Buy" : "Sell"}
          </div>
        );
      },
      title: <p ref={anchorRefs?.type}>Type</p>,
      filter: {
        anchorRef: anchorRefs?.type,
        activeFunnel: !!filter.type,
        filterOpen: filterVisibility.type,
        filterButtonDisabled: (() => {
          const current = filter.type ? JSON.parse(filter.type) : undefined;
          const draft = filterDraft["type"];

          if (
            !draft?.type ||
            (filterDraft["type"].value && !validFilterTypeValue)
          )
            return true;

          if (current?.type === draft?.type) return true;

          return false;
        })(),
        onShow: e => toggleFilter(e, "type"),
        onFilter: () => {
          if (!filterDraft["type"].value) {
            filterDraft["type"].value = ADATokenName;
          }

          changeFilterByKey("type", JSON.stringify(filterDraft["type"]));
        },
        onReset: () => changeFilterByKey("type"),
        filterContent: (
          <div className='flex w-full flex-col justify-center gap-2 p-1'>
            <div className='flex items-center gap-3'>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='status'
                  value='sell'
                  className='accent-primary'
                  checked={filterDraft["type"]?.type === "sell"}
                  onChange={() =>
                    changeDraftFilter("type", prev => ({
                      type: "sell",
                      value: prev?.type === "sell" ? prev?.value : undefined,
                    }))
                  }
                />
                <span className='text-sm'>Buy</span>
              </label>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='status'
                  value='buy'
                  className='accent-primary'
                  checked={filterDraft["type"]?.type === "buy"}
                  onChange={() =>
                    changeDraftFilter("type", prev => ({
                      type: "buy",
                      value: prev?.type === "buy" ? prev?.value : undefined,
                    }))
                  }
                />
                <span className='text-sm'>Sell</span>
              </label>
            </div>
            <TextInput
              onchange={value =>
                changeDraftFilter("type", prev => ({
                  ...prev,
                  value,
                }))
              }
              placeholder={
                filterDraft["type"]?.type
                  ? filterDraft["type"].type === "sell"
                    ? "Search by token in"
                    : "Search by token out"
                  : "Choose filter type"
              }
              value={filterDraft["type"]?.value ?? ""}
              wrapperClassName='w-full'
              disabled={!filterDraft["type"]?.type}
            />
          </div>
        ),
      },
      visible: columnsVisibility.type,
      widthPx: 60,
    },
    {
      key: "pair",
      render: item => {
        if (!item?.token_in?.name || !item?.token_out?.name) {
          return "-";
        }

        const tokenInFingerPrint = getAssetFingerprint(item?.token_in?.name);
        const tokenOutFingerPrint = getAssetFingerprint(item?.token_out?.name);

        const tokenInAssetName = renderAssetName({
          name: item?.token_in?.name,
        });
        const tokenOutAssetName = renderAssetName({
          name: item?.token_out?.name,
        });

        const tokenInHasRegistry = item?.token_in?.registry;
        const tokenOutHasRegistry = item?.token_out?.registry;

        return (
          <div className='flex items-center justify-between'>
            <Link
              to='/asset/$fingerprint'
              params={{
                fingerprint: tokenInFingerPrint,
              }}
            >
              <p
                className={`min-w-[50px] ${!tokenInHasRegistry ? "italic" : ""} text-primary`}
              >
                {tokenInAssetName === "lovelace" ? "ADA" : tokenInAssetName}
              </p>
            </Link>
            <ArrowRight size={15} className='block min-w-[20px]' />
            <Link
              to='/asset/$fingerprint'
              params={{
                fingerprint: tokenOutFingerPrint,
              }}
            >
              <p
                className={`w-fit ${!tokenOutHasRegistry ? "italic" : ""} text-primary`}
              >
                {tokenOutAssetName === "lovelace" ? "ADA" : tokenOutAssetName}
              </p>
            </Link>
          </div>
        );
      },
      title: "Pair",
      visible: columnsVisibility.pair,
      widthPx: 80,
    },
    {
      key: "token_amount",
      render: item => {
        if (!item?.token_in?.name || !item?.token_out?.name) {
          return "-";
        }

        const isBuying = item?.token_in?.name === ADATokenName;

        return (
          <p className='text-right'>
            {formatNumber(isBuying ? item?.actual_out_amount : item?.amount_in)}
          </p>
        );
      },
      title: <p className='w-full text-nowrap text-right'>Token amount</p>,
      visible: columnsVisibility.token_amount,
      widthPx: 83,
    },
    {
      key: "ada_amount",
      render: item => {
        if (!item?.amount_in) {
          return <p className='text-right'>-</p>;
        }

        const isAdaIn = item?.token_in?.name === ADATokenName;

        const status = item?.status?.toLowerCase();
        let outputAmount = 0;

        switch (status) {
          case "pending":
          case "mempool":
            outputAmount = item?.expected_out_amount ?? 0;
            break;
          case "success":
          case "complete":
            outputAmount = item?.actual_out_amount ?? 0;
            break;
          default:
            outputAmount = 0;
        }

        const price = isAdaIn
          ? item.amount_in / (outputAmount || 1)
          : (outputAmount || 0) / item.amount_in;

        const [ada, usd] = calculateAdaPriceWithHistory(price * 1e6, curr);

        const maxAda = 30000 * 1e6;
        const percentage = Math.min(
          ((item?.amount_in * 1e6) / maxAda) * 100,
          100,
        );

        return (
          <div className='flex flex-col gap-2'>
            {currency === "ada" ? (
              <p title={ada} className='text-right'>
                <AdaWithTooltip data={item?.amount_in * 1e6} />
              </p>
            ) : (
              <p title={ada} className='text-right'>
                {currencySigns["usd"]} {formatNumberWithSuffix(usd)}
              </p>
            )}
            <div
              title='Order size visualisation'
              className='flex items-center justify-end'
            >
              <div className='relative h-2 w-2/3 overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                <span
                  className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{ width: `${percentage ?? 0}%` }}
                ></span>
              </div>
            </div>
          </div>
        );
      },
      title: (
        <p className='w-full text-nowrap text-right'>
          <span
            className='inline-block cursor-pointer text-primary'
            onClick={e => {
              e.stopPropagation();
              setCurrency(currency === "ada" ? "usd" : "ada");
            }}
          >
            {currency === "ada" ? "ADA" : "USD"}
          </span>{" "}
          amount
        </p>
      ),
      visible: columnsVisibility.ada_amount,
      widthPx: 80,
    },
    {
      key: "ada_price",
      render: item => {
        const adaPrice =
          item?.actual_out_amount ?? item?.expected_out_amount ?? 0;

        const [ada, usd] = calculateAdaPriceWithHistory(adaPrice * 1e6, curr);

        return currency === "ada" ? (
          <p title={ada} className='text-right'>
            <AdaWithTooltip data={adaPrice * 1e6} />
          </p>
        ) : (
          <p title={ada} className='text-right'>
            {currencySigns["usd"]} {formatNumberWithSuffix(usd)}
          </p>
        );
      },
      title: (
        <p className='w-full text-nowrap text-right'>
          <span
            className='inline-block cursor-pointer text-primary'
            onClick={e => {
              e.stopPropagation();
              setCurrency(currency === "ada" ? "usd" : "ada");
            }}
          >
            {currency === "ada" ? "ADA" : "USD"}
          </span>{" "}
          price
        </p>
      ),
      visible: columnsVisibility.ada_price,
      widthPx: 60,
    },
    {
      key: "status",
      render: item => {
        if (!item?.status) {
          return "-";
        }

        const isSuccess = item.status === "COMPLETE";
        const isCanceled = item.status === "CANCELLED";

        return (
          <div className='flex items-center gap-1'>
            <Link
              to='/dex/swap/$hash'
              params={{
                hash: item?.tx_hash,
              }}
              className='h-[20px] w-[20px] translate-y-[2px]'
            >
              <FileText size={15} className='cursor-pointer text-primary' />
            </Link>
            <p className='flex items-center gap-1 rounded-md border border-border px-1 text-sm'>
              {isSuccess ? (
                <Check className='text-greenText' size={15} />
              ) : isCanceled ? (
                <X size={15} className='text-redText' />
              ) : (
                <Ellipsis size={15} className='text-yellowText' />
              )}
              {item.status[0].toUpperCase() +
                item.status.slice(1).toLowerCase()}
            </p>
          </div>
        );
      },
      title: <p ref={anchorRefs?.status}>Status</p>,
      filter: {
        anchorRef: anchorRefs?.status,
        width: "170px",
        activeFunnel: !!filter.status,
        filterOpen: filterVisibility.status,
        filterButtonDisabled: filter.status
          ? filter.status === filterDraft["status"]
          : false,
        onShow: e => toggleFilter(e, "status"),
        onFilter: () => changeFilterByKey("status", filterDraft["status"]),
        onReset: () => changeFilterByKey("status"),
        filterContent: (
          <div className='flex flex-col gap-2 px-2 py-1'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='status'
                value='COMPLETE'
                className='accent-primary'
                checked={filterDraft["status"] === "COMPLETE"}
                onChange={e =>
                  changeDraftFilter("status", e.currentTarget.value)
                }
              />
              <span className='text-sm'>Complete</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='status'
                value='CANCELLED'
                className='accent-primary'
                checked={filterDraft["status"] === "CANCELLED"}
                onChange={e =>
                  changeDraftFilter("status", e.currentTarget.value)
                }
              />
              <span className='text-sm'>Cancelled</span>
            </label>
          </div>
        ),
      },
      visible: columnsVisibility.status,
      widthPx: 90,
    },
    {
      key: "maker",
      render: item => {
        if (!item?.user?.address) {
          return "-";
        }

        const balanceAda = (item?.user?.balance ?? 0) / 1_000_000;

        const getLevel = (balance: number) => {
          if (balance >= 20_000_000) return "leviathan";
          if (balance >= 5_000_000) return "humpback";
          if (balance >= 1_000_000) return "whale";
          if (balance >= 250_000) return "shark";
          if (balance >= 100_000) return "dolphin";
          if (balance >= 25_000) return "tuna";
          if (balance >= 5_000) return "fish";
          if (balance >= 1_000) return "crab";
          if (balance >= 10) return "shrimp";
          return "plankton";
        };

        const level = getLevel(balanceAda);
        const Icon = addressIcons[level];

        return (
          <div className='flex items-center gap-2'>
            {item?.user?.balance && (
              <Image src={Icon} className='h-4 w-4 rounded-full' />
            )}
            <div className='flex items-center gap-2'>
              <Link
                to={"/address/$address"}
                params={{
                  address: item?.user?.address,
                }}
                className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-sm text-primary`}
              >
                {formatString(item?.user?.address, "short")}
              </Link>
              <Copy copyText={item?.user?.address} />
            </div>
          </div>
        );
      },
      title: <p ref={anchorRefs?.maker}>Maker</p>,
      filter:
        stakeAddress || address
          ? undefined
          : {
              anchorRef: anchorRefs?.maker,
              activeFunnel: !!filter.maker,
              filterOpen: filterVisibility.maker,
              filterButtonDisabled:
                stakeAddress || address
                  ? true
                  : filter.maker
                    ? filterDraft["makerSearch"] === filter.maker
                    : false,
              onShow: e => toggleFilter(e, "maker"),
              onFilter: () =>
                changeFilterByKey("maker", filterDraft["makerSearch"]),
              onReset: () => changeFilterByKey("maker"),
              filterContent: (
                <div className='flex h-[60px] w-full items-center justify-center px-1'>
                  <TextInput
                    onchange={value => changeDraftFilter("makerSearch", value)}
                    placeholder='Filter by address or stake...'
                    value={filterDraft["makerSearch"] ?? ""}
                    wrapperClassName='w-full'
                    disabled={!!stakeAddress || !!address}
                  />
                </div>
              ),
            },
      visible: columnsVisibility.maker,
      widthPx: 80,
    },
    {
      key: "platform",
      render: () => {
        return (
          <a
            target='_blank'
            rel='nofollow'
            href='https://app.dexhunter.io/'
            className='flex w-full items-center justify-end'
          >
            <Image src={DexhunterIcon} className='h-6 w-6 rounded-full' />
          </a>
        );
      },
      title: <p ref={anchorRefs?.dex}>Platform</p>,
      filter: {
        anchorRef: anchorRefs?.dex,
        width: "170px",
        activeFunnel: !!filter.dex,
        filterOpen: filterVisibility.dex,
        filterButtonDisabled: filter.dex
          ? filter.dex === filterDraft["dex"]
          : false,
        onShow: e => toggleFilter(e, "dex"),
        onFilter: () => changeFilterByKey("dex", filterDraft["dex"]),
        onReset: () => changeFilterByKey("dex"),
        filterContent: (
          <div className='flex flex-col gap-2 px-2 py-1'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='dex'
                value='SUNDAESWAP'
                className='accent-primary'
                checked={filterDraft["dex"] === "SUNDAESWAP"}
                onChange={e => changeDraftFilter("dex", e.currentTarget.value)}
              />
              <span className='text-sm'>SundaeSwap</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='dex'
                value='MINSWAP'
                className='accent-primary'
                checked={filterDraft["dex"] === "MINSWAP"}
                onChange={e => changeDraftFilter("dex", e.currentTarget.value)}
              />
              <span className='text-sm'>Minswap</span>
            </label>
          </div>
        ),
      },
      visible: columnsVisibility.platform,
      widthPx: 60,
    },
  ];

  return (
    <div className='flex w-full flex-col gap-2 rounded-lg sm:gap-0'>
      <div className='flex flex-wrap items-center justify-between gap-y-1 pb-2'>
        <div className='flex items-center gap-2'>
          {pulseDot && <PulseDot />}
          <h2 className={titleClassname ? titleClassname : ""}>
            Global trading activity
          </h2>
        </div>
        <div className='flex items-center gap-2'>
          <ExportButton columns={columns} items={items} />
          <TableSettingsDropdown
            rows={rows}
            setRows={setRows}
            columnsOptions={defiOrderListTableOptions.map(item => {
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
      {hasFilter && (
        <div className='flex flex-wrap items-center gap-1 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1 rounded-lg border border-border bg-darker px-1 py-1/4 text-xs text-grayTextPrimary'
                >
                  <span>{key[0].toUpperCase() + key.slice(1)}:</span>
                  {key === "maker" && (
                    <span>{formatString(value, "long")}</span>
                  )}
                  {(key === "status" || key === "dex") && (
                    <span>
                      {value[0].toUpperCase() + value.slice(1).toLowerCase()}
                    </span>
                  )}
                  {key === "type" && (
                    <span>
                      {(JSON.parse(value) as unknown as FilterType)?.value ===
                      ADATokenName
                        ? "ADA"
                        : (JSON.parse(value) as unknown as FilterType)?.value}
                    </span>
                  )}
                  <X
                    size={13}
                    className='cursor-pointer'
                    onClick={() => changeFilterByKey(key)}
                  />
                </div>
              ),
          )}
        </div>
      )}
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={query}
        rowHeight={65}
        items={items}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof DeFiOrderListColumns) -
            columnsOrder.indexOf(b.key as keyof DeFiOrderListColumns)
          );
        })}
        onOrderChange={setColumsOrder}
      />
    </div>
  );
};
