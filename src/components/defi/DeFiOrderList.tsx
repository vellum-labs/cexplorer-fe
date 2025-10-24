import type { FC } from "react";
import type { DeFiOrderListColumns, TableColumns } from "@/types/tableTypes";
import type { DeFiOrder } from "@/types/tokenTypes";

import { Check, Ellipsis, FileText, X } from "lucide-react";

import { PulseDot } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "../table/ExportButton";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "../table/GlobalTable";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Image } from "../global/Image";
import { Link } from "@tanstack/react-router";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "../global/TimeDateIndicator";

import { defiOrderListTableOptions } from "@/constants/tables/defiOrderListTableOptions";
import {
  formatNumberWithSuffix,
  formatString,
} from "@vellumlabs/cexplorer-sdk";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";
import { ADATokenName, currencySigns } from "@/constants/currencies";

import { dexConfig } from "@/constants/dexConfig";

import { useDeFiOrderListTableStore } from "@/stores/tables/deFiOrderListTableStore";
import { useFetchDeFiOrderList } from "@/services/token";
import { useFilterTable } from "@/hooks/tables/useFilterTable";
import { useFetchMiscSearch } from "@/services/misc";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useAdaPriceWithHistory } from "@/hooks/useAdaPriceWithHistory";

import { addressIcons } from "@/constants/address";
import { AnimalName } from "@/constants/animals";
import { calculateAdaPriceWithHistory } from "@/utils/calculateAdaPriceWithHistory";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { TokenPair } from "../dex/TokenPair";
import { AssetTicker } from "../dex/AssetTicker";
import { renderAssetName } from "@/utils/asset/renderAssetName";

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
        <div className='flex items-center gap-1'>
          <Link
            to='/dex/swap/$hash'
            params={{
              hash: item?.tx_hash,
            }}
            className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-text-sm text-primary`}
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
            className={`flex w-[50px] items-center justify-center rounded-s px-[6px] py-[2px] text-text-sm font-medium text-white ${isBuying ? "bg-greenText" : "bg-redText"}`}
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
          <div className='flex w-full flex-col justify-center gap-1 p-1'>
            <div className='flex items-center gap-1.5'>
              <label className='flex items-center gap-1'>
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
                <span className='text-text-sm'>Buy</span>
              </label>
              <label className='flex items-center gap-1'>
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
                <span className='text-text-sm'>Sell</span>
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

        return (
          <TokenPair
            tokenIn={item.token_in.name}
            tokenOut={item.token_out.name}
            variant='simple'
            clickable={false}
            tokenInRegistry={item.token_in.registry}
            tokenOutRegistry={item.token_out.registry}
          />
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
        const amount = isBuying ? item?.actual_out_amount : item?.amount_in;
        const tokenName = isBuying
          ? item?.token_out?.name
          : item?.token_in?.name;
        const tokenRegistry = isBuying
          ? item?.token_out?.registry
          : item?.token_in?.registry;
        const displayName =
          tokenName === ADATokenName
            ? "ADA"
            : renderAssetName({ name: tokenName });

        return (
          <div className='flex justify-end'>
            <Tooltip
              content={
                <div className='flex items-center gap-1'>
                  <span>
                    {amount.toLocaleString()}{" "}
                    <AssetTicker
                      tokenName={tokenName}
                      registry={tokenRegistry}
                    />
                  </span>
                  <Copy
                    copyText={`${amount.toLocaleString()} ${displayName}`}
                  />
                </div>
              }
            >
              <p className='text-right'>{formatNumberWithSuffix(amount)}</p>
            </Tooltip>
          </div>
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

        const adaAmount = isAdaIn ? item.amount_in : outputAmount;
        const [ada, usd] = calculateAdaPriceWithHistory(adaAmount * 1e6, curr);

        const maxAda = 30000 * 1e6;
        const percentage = Math.min(((adaAmount * 1e6) / maxAda) * 100, 100);

        return (
          <div className='flex flex-col gap-1'>
            {currency === "ada" ? (
              <p title={ada} className='text-right'>
                <AdaWithTooltip data={adaAmount * 1e6} />
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
        if (!item?.token_in?.name || !item?.token_out?.name) {
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

        const pricePerToken = isAdaIn
          ? item.amount_in / (outputAmount || 1)
          : (outputAmount || 0) / (item.amount_in || 1);

        const [, usd] = calculateAdaPriceWithHistory(pricePerToken * 1e6, curr);

        return currency === "ada" ? (
          <div className='flex justify-end'>
            <Tooltip
              content={
                <div className='flex items-center gap-1'>
                  <span>
                    ₳ {pricePerToken.toFixed(20).replace(/\.?0+$/, "")}
                  </span>
                  <Copy
                    copyText={pricePerToken.toFixed(20).replace(/\.?0+$/, "")}
                  />
                </div>
              }
            >
              <div className='text-sm text-grayTextPrimary'>
                {formatSmallValueWithSub(pricePerToken, "₳ ", 0.01, 6, 4)}
              </div>
            </Tooltip>
          </div>
        ) : (
          <div className='flex justify-end'>
            <Tooltip
              content={
                <div className='flex items-center gap-1'>
                  <span>$ {usd.toFixed(20).replace(/\.?0+$/, "")}</span>
                  <Copy copyText={usd.toFixed(20).replace(/\.?0+$/, "")} />
                </div>
              }
            >
              <div className='text-sm text-grayTextPrimary'>
                {formatSmallValueWithSub(usd, "$ ", 0.01, 6, 4)}
              </div>
            </Tooltip>
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
          <div className='flex items-center gap-1/2'>
            <Link
              to='/dex/swap/$hash'
              params={{
                hash: item?.tx_hash,
              }}
              className='h-[20px] w-[20px] translate-y-[2px]'
            >
              <FileText size={15} className='cursor-pointer text-primary' />
            </Link>
            <p className='flex items-center gap-1/2 rounded-s border border-border px-1 text-text-sm'>
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
          <div className='flex flex-col gap-1 px-2 py-1'>
            <label className='flex items-center gap-1'>
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
              <span className='text-text-sm'>Complete</span>
            </label>
            <label className='flex items-center gap-1'>
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
              <span className='text-text-sm'>Cancelled</span>
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

        const getLevel = (balance: number): AnimalName => {
          if (balance >= 20_000_000) return AnimalName.Leviathan;
          if (balance >= 5_000_000) return AnimalName.Humpback;
          if (balance >= 1_000_000) return AnimalName.Whale;
          if (balance >= 250_000) return AnimalName.Shark;
          if (balance >= 100_000) return AnimalName.Dolphin;
          if (balance >= 25_000) return AnimalName.Tuna;
          if (balance >= 5_000) return AnimalName.Fish;
          if (balance >= 1_000) return AnimalName.Crab;
          if (balance >= 10) return AnimalName.Shrimp;
          return AnimalName.Plankton;
        };

        const level = getLevel(balanceAda);
        const Icon = addressIcons[level];

        return (
          <div className='flex items-center gap-1'>
            {item?.user?.balance && (
              <Image src={Icon} className='h-4 w-4 rounded-max' />
            )}
            <div className='flex items-center gap-1'>
              <Link
                to={"/address/$address"}
                params={{
                  address: item?.user?.address,
                }}
                className={`block overflow-hidden overflow-ellipsis whitespace-nowrap px-0 text-text-sm text-primary`}
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
      render: item => {
        if (!item?.dex) {
          return <p className='text-right'>-</p>;
        }

        const dexKey = item.dex.toUpperCase();
        const dex = dexConfig[dexKey];

        if (!dex?.icon) {
          return <p className='text-right'>-</p>;
        }

        const dexhunterDex = dexConfig["DEXHUNTER"];

        return (
          <div className='flex items-center justify-end'>
            <div className='relative'>
              <div
                className='rounded-full flex aspect-square h-6 w-6 items-center justify-center overflow-hidden border'
                style={{
                  backgroundColor: dex.bgColor,
                  borderColor: dex.borderColor,
                  borderRadius: "50%",
                }}
              >
                <Tooltip content={dex.label}>
                  <Image
                    src={dex.icon}
                    className='h-4 w-4 rounded-max'
                    alt={dex.label}
                  />
                </Tooltip>
              </div>
              {item.is_dexhunter && (
                <div
                  className='rounded-full absolute -bottom-0.5 -right-0.5 flex aspect-square h-3 w-3 items-center justify-center overflow-hidden border'
                  style={{
                    backgroundColor: dexhunterDex.bgColor,
                    borderColor: dexhunterDex.borderColor,
                    borderRadius: "50%",
                  }}
                >
                  <Tooltip content={dexhunterDex.label}>
                    <Image
                      src={dexhunterDex.icon}
                      className='h-2 w-2 rounded-max'
                      alt={dexhunterDex.label}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
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
          <div className='flex max-h-[200px] flex-col gap-1 overflow-y-auto px-2 py-1'>
            {Object.entries(dexConfig)
              .filter(([key]) => key !== "DEXHUNTER")
              .map(([key, value]) => (
                <label key={key} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='dex'
                    value={key}
                    className='accent-primary'
                    checked={filterDraft["dex"] === key}
                    onChange={e =>
                      changeDraftFilter("dex", e.currentTarget.value)
                    }
                  />
                  <span className='text-sm'>{value.label}</span>
                </label>
              ))}
          </div>
        ),
      },
      visible: columnsVisibility.platform,
      widthPx: 60,
    },
  ];

  return (
    <div className='flex w-full flex-col gap-1 rounded-m sm:gap-0'>
      <div className='flex flex-wrap items-center justify-between gap-y-1/2 pb-2'>
        <div className='flex items-center gap-1'>
          {pulseDot && <PulseDot />}
          <h2 className={titleClassname ? titleClassname : ""}>
            Global trading activity
          </h2>
        </div>
        <div className='flex items-center gap-1'>
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
        <div className='flex flex-wrap items-center gap-1/2 md:flex-nowrap'>
          {Object.entries(filter).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className='mb-1 flex w-fit items-center gap-1/2 rounded-m border border-border bg-darker px-1 py-1/4 text-text-xs text-grayTextPrimary'
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
