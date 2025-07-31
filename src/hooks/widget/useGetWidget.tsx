import type { ReactNode } from "@tanstack/react-router";

import type {
  AssetListTableColumns,
  BlockListColumns,
  DrepListTableColumns,
  EpochListColumns,
  PoolsListColumns,
  TxListTableColumns,
} from "@/types/tableTypes";
import type { OverviewList } from "@/components/global/cards/OverviewCard";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import type { Dispatch, SetStateAction } from "react";
import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { UseQueryResult } from "@tanstack/react-query";

import { GraphTimePeriod } from "@/types/graphTypes";

import { WidgetDataTypes } from "@/types/widgetTypes";
import { WidgetTypes } from "@/types/widgetTypes";

import { DrepNameCell } from "@/components/drep/DrepNameCell";
import AssetCell from "@/components/asset/AssetCell";
import PoolCell from "@/components/table/PoolCell";

import { useDrepList } from "@/hooks/tables/useDrepList";
import { useTxList } from "../tables/useTxList";
import { useBlockList } from "../tables/useBlockList";
import { useAssetList } from "../tables/useAssetList";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "../useMiscConst";
import { useTxInEpoch } from "../graphs/useTxInEpoch";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { useFetchEpochList } from "@/services/epoch";
import { useEpochList } from "../tables/useEpochList";
import { useEpochBlockchain } from "../graphs/useEpochBlockchain";
import { useBlockProduction } from "../graphs/useBlockProduction";
import { useFetchBlocksList } from "@/services/blocks";
import { useLatestBlocks } from "../graphs/useLatestBlocks";
import { useBlockSizeUsed } from "../graphs/useBlockSizeUsed";
import { usePoolList } from "../tables/usePoolList";
import { useFetchPoolDetail } from "@/services/pools";
import { usePoolDetail } from "../details/usePoolDetail";
import { useFetchAssetDetail } from "@/services/assets";
import { useAssetDetail } from "../details/useAssetDetail";
import { useFetchDrepDetail } from "@/services/drep";
import { useEffect, useState } from "react";
import { useDrepDetail } from "../details/useDrepDetail";

import { activeSlotsCoeff, epochLength } from "@/constants/confVariables";
import { txListTableOptions } from "@/constants/tables/txListTableOptions";
import { tableWidgetStoreKeys } from "@/constants/widget";
import { drepListTableOptions } from "@/constants/tables/drepListTableOptions";
import { blocksListTableOptions } from "@/constants/tables/blocksListTableOptions";
import { assetListTableOptions } from "@/constants/tables/assetListTableOptions";
import { epochListTableOptions } from "@/constants/tables/epochListTableOptions";
import { poolsListTableOptions } from "@/constants/tables/poolsListTableOptions";

interface useGetTableWidget<T> {
  columns: any[];
  items: any[] | undefined;
  isLoading: boolean;
  optionalColumns: string[];
  miniTableColumnsOrder: string[];
  overrideWidth: {
    [key: string]: number;
  };
  mobileColumns: string[];
  optionalStartWidth?: number;
  columnsVisibility?: T;
  setColumnVisibility?: (columnKey: string, isVisible: boolean) => void;
  filterKeys?: string[];
  hasFilter?: boolean;
  changeFilterByKey?: (key: any, value?: string) => void;
  tableListOptions?: any[];
  optionalTableListOptions?: any[];
  mobileTableListOptions?: any[];
  totalItems?: number;
  placeholder?: string;
}

interface useGetGraphWidget {
  json?: any;
  option: ReactEChartsProps["option"];
  wrapper: boolean;
  storageKey: string;
  selectedItem?: GraphTimePeriod;
  setData?: Dispatch<SetStateAction<EpochAnalyticsResponseData[] | undefined>>;
  setSelectedItem?: Dispatch<SetStateAction<GraphTimePeriod>>;
  query?: UseQueryResult<any, any>;
  onClick?: (params: any) => void;
  isLoading: boolean;
}

interface useDetailWidget {
  isLoading: boolean;
  list: [string, OverviewList][];
  title?: ReactNode;
}

interface Order {
  sort?: "asc" | "desc";
  order?: string;
}

const HOMEPAGE_SORT_KEY = "homepage_sort_list";

const DrepListWidget = (
  page?: number,
  tableSearch?: string,
): useGetTableWidget<DrepListTableColumns> => {
  const [sortByOrder, setSortByOrder] = useState<Order | undefined>(undefined);

  const updateLocalStorage = (value: Order | undefined) => {
    const storageSortList = localStorage.getItem(HOMEPAGE_SORT_KEY);

    localStorage.setItem(
      HOMEPAGE_SORT_KEY,
      JSON.stringify({
        ...(storageSortList && JSON.parse(storageSortList)),
        drep: {
          ...value,
        },
      }),
    );
  };

  const setListOrder = (order?: string) => {
    setSortByOrder(prev => {
      if (!prev) {
        updateLocalStorage({
          order,
          sort: "desc",
        });
        return {
          order,
          sort: "desc",
        };
      }

      const newState = {
        order: prev.sort === "asc" && prev.order === order ? undefined : order,
        sort:
          prev.order === order
            ? prev.sort === "desc"
              ? "asc"
              : undefined
            : "desc",
      } as any;

      updateLocalStorage(newState);
      return newState;
    });
  };

  useEffect(() => {
    const storageSortList = localStorage.getItem(HOMEPAGE_SORT_KEY);

    if (!storageSortList) {
      return;
    }

    const parsedStorageSortList = JSON.parse(storageSortList);

    if (parsedStorageSortList["drep"]) {
      setSortByOrder(parsedStorageSortList["drep"]);
    }
  }, []);

  const {
    columns,
    drepListQuery,
    columnsVisibility,
    totalItems,
    items,
    filterKeys,
    hasFilter,
    changeFilterByKey,
    setColumnVisibility,
  } = useDrepList({
    watchlist: false,
    page: page ?? 1,
    setList: setListOrder,
    sort: sortByOrder?.sort,
    order: sortByOrder?.order,
    storeKey: tableWidgetStoreKeys.drep,
    overrideRows: 20,
    overrideTableSearch: tableSearch,
    isHomepage: true,
  });

  const optionalColumns = [
    "status",
    "drep_name",
    "voting_power",
    "owner_stake",
    "voting_activity",
    "delegators",
  ];

  const mobileColumns = ["drep_name", "voting_power"];

  const unneededColumns = ["top_delegator", "selected_vote"];

  return {
    columns: columns.filter(item => !unneededColumns.includes(item?.key)),
    items,
    isLoading: drepListQuery.isLoading,
    optionalColumns,
    miniTableColumnsOrder: [],
    mobileColumns,
    hasFilter,
    overrideWidth: {
      status: 30,
      drep_name: 60,
      voting_power: 40,
      voting_activity: 40,
    },
    columnsVisibility,
    tableListOptions: drepListTableOptions,
    optionalTableListOptions: drepListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: drepListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    totalItems,
    filterKeys,
    placeholder: "Search drep ID...",
    changeFilterByKey,
    setColumnVisibility,
  };
};

const DrepDetailWidget = (detailAddr: string): useDetailWidget => {
  const drepDetailQuery = useFetchDrepDetail(detailAddr);

  const item = drepDetailQuery.data;

  const { about, governance, voting } = useDrepDetail({
    query: drepDetailQuery,
  });

  return {
    isLoading: drepDetailQuery.isLoading,
    list: Object.entries({ about, governance, voting }),
    title: item ? <DrepNameCell item={item as any} /> : <></>,
  };
};

const TxListWidget = (
  page?: number,
  tableSearch?: string,
): useGetTableWidget<TxListTableColumns> => {
  const {
    columns,
    items,
    txListQuery,
    columnsVisibility,
    totalItems,
    setColumnVisibility,
  } = useTxList({
    page: page ?? 1,
    overrideRows: 20,
    address: undefined,
    asset: undefined,
    isDonationPage: false,
    policyId: undefined,
    script: undefined,
    stake: undefined,
    storeKey: tableWidgetStoreKeys.tx,
    overrideTableSearch: tableSearch,
  });

  const optionalColumns = ["date", "hash", "block", "size", "script_size"];
  const mobileColumns = ["date", "hash"];

  return {
    columns,
    isLoading: txListQuery.isLoading,
    items,
    optionalColumns,
    miniTableColumnsOrder: [],
    mobileColumns,
    overrideWidth: {
      date: 40,
      hash: 65,
      block: 50,
      size: 50,
    },
    columnsVisibility,
    totalItems,
    setColumnVisibility,
    tableListOptions: txListTableOptions,
    optionalTableListOptions: txListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: txListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    placeholder: "Search by tx hash...",
  };
};

const TxInEpochGraphWidget = (): useGetGraphWidget => {
  const epochQuery = useFetchEpochAnalytics();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const { json, option, selectedItem, setData, setSelectedItem } =
    useTxInEpoch(miscConst);

  return {
    json,
    option,
    selectedItem,
    setData,
    setSelectedItem,
    query: epochQuery,
    wrapper: true,
    storageKey: "network_tx_in_epoch_graph_store",
    isLoading: epochQuery.isLoading,
  };
};

const BlockListWidget = (
  page?: number,
  tableSearch?: string,
): useGetTableWidget<BlockListColumns> => {
  const {
    columns,
    items,
    columnsVisibility,
    totalItems,
    setColumnVisibility,
    blockListQuery,
  } = useBlockList({
    page: page ?? 1,
    storeKey: tableWidgetStoreKeys.block,
    overrideRows: 20,
    overrideTableSearch: tableSearch,
  });

  const optionalColumns = ["date", "block_no", "tx_count", "minted_by"];

  const mobileColumns = ["date", "block_no"];

  return {
    columns,
    isLoading: blockListQuery.isLoading,
    items,
    totalItems,
    optionalColumns,
    miniTableColumnsOrder: [],
    mobileColumns,
    overrideWidth: {
      date: 50,
      block_no: 50,
      txs: 50,
      minted_by: 150,
    },
    columnsVisibility,
    tableListOptions: blocksListTableOptions,
    optionalTableListOptions: blocksListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: blocksListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    placeholder: "Search by block height...",
    setColumnVisibility,
  };
};

const BlockProductionGraphWidget = (): useGetGraphWidget => {
  const epochQuery = useFetchEpochAnalytics();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const { json, option, selectedItem, setData, setSelectedItem } =
    useBlockProduction(miscConst);

  return {
    query: epochQuery,
    option,
    storageKey: "",
    wrapper: true,
    json,
    selectedItem,
    setData,
    setSelectedItem,
    isLoading: epochQuery.isLoading,
  };
};

const BlockSizeUsedGraphWidget = (): useGetGraphWidget => {
  const epochQuery = useFetchEpochAnalytics();
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const { json, option, selectedItem, setData, setSelectedItem } =
    useBlockSizeUsed(miscConst);

  return {
    query: epochQuery,
    option,
    storageKey: "",
    wrapper: true,
    json,
    selectedItem,
    isLoading: epochQuery.isLoading,
    setData,
    setSelectedItem,
  };
};

const LatestBlocksWidget = (): useGetGraphWidget => {
  const blocksQuery = useFetchBlocksList(100, 0, true);
  const { onEvents, option } = useLatestBlocks({
    query: blocksQuery,
    sortedVersions: [],
  });

  return {
    option,
    storageKey: "",
    wrapper: false,
    isLoading: blocksQuery.isLoading,
    onClick: onEvents,
  };
};

const AssetListWidget = (
  page?: number,
  tableSearch?: string,
): useGetTableWidget<
  | AssetListTableColumns
  | Omit<AssetListTableColumns, "type">
  | Omit<AssetListTableColumns, "type" | "mint_quantity">
> => {
  const {
    columns,
    items,
    totalItems,
    columnsVisibility,
    setColumnVisibility,
    assetListQuery,
  } = useAssetList({
    page: page ?? 1,
    overrideRows: 20,
    policyId: undefined,
    type: "all",
    watchlist: false,
    storeKey: tableWidgetStoreKeys.asset,
    overrideTableSearch: tableSearch,
  });

  const optionalColumns = [
    "type",
    "asset",
    "policy_id",
    "asset_minted",
    "price",
  ];

  const mobileColumns = ["asset_minted", "asset"];

  return {
    columns,
    isLoading: assetListQuery.isLoading,
    items,
    optionalColumns,
    miniTableColumnsOrder: ["asset_minted", "type", "asset", "policy_id"],
    mobileColumns,
    overrideWidth: {
      type: 20,
      asset_minted: 54,
      asset: 100,
      policy_id: 100,
    },
    totalItems,
    columnsVisibility,
    tableListOptions: assetListTableOptions,
    optionalTableListOptions: assetListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: assetListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    placeholder: "Search by asset...",
    setColumnVisibility,
  };
};

const AssetDetailWidget = (detailAddr: string): useDetailWidget => {
  const assetDetailQuery = useFetchAssetDetail(detailAddr);
  const assetSupply = assetDetailQuery.data?.data?.stat?.asset?.quantity;

  const titleData = assetDetailQuery?.data?.data;

  const type = assetSupply ? (assetSupply > 1 ? "token" : "nft") : "token";
  const isLoading = assetDetailQuery.isLoading;

  const { blockchain, overview, tokenRegistry } = useAssetDetail({
    data: assetDetailQuery,
    type,
  });

  return {
    isLoading,
    list: Object.entries({
      blockchain,
      overview,
      ...(titleData?.registry && {
        tokenRegistry,
      }),
    }),
    title: titleData ? (
      <AssetCell
        asset={{
          name: String(titleData.name),
          registry: titleData.registry,
          quantity: titleData.stat.asset.quantity,
        }}
        isNft={titleData?.stat?.asset?.quantity === 1}
      />
    ) : (
      <></>
    ),
  };
};

const EpochListWidget = (
  tableSearch?: string,
): useGetTableWidget<EpochListColumns> => {
  const { data, isLoading } = useFetchEpochList();

  const filteredDataItems = (data?.data || []).filter(e => e);

  const { columns, filteredData, columnsVisibility, setColumnVisibility } =
    useEpochList({
      data: filteredDataItems,
      epoch_number: data?.count ?? 0,
      storeKey: tableWidgetStoreKeys.epoch,
      withoutRerender: true,
    });

  const optionalColumns = [
    "epoch",
    "blocks",
    "txs",
    "output",
    "fees",
    "stake",
    "usage",
  ];
  const mobileColumns = ["epoch", "stake", "block", "txs"];

  const filterDataByTableSearch = tableSearch
    ? filteredData.filter(item => {
        if (/\D/.test(tableSearch)) {
          return true;
        }

        return String(item.no).includes(tableSearch);
      })
    : filteredData;

  return {
    columns,
    isLoading,
    items: filterDataByTableSearch,
    totalItems: filteredData.length,
    optionalColumns,
    miniTableColumnsOrder: [],
    mobileColumns,
    overrideWidth: {
      epoch: 10,
      block: 10,
      txs: 40,
      fees: 40,
      stake: 50,
      usage: 40,
    },
    columnsVisibility,
    tableListOptions: epochListTableOptions,
    optionalTableListOptions: epochListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: epochListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    placeholder: "Search by epoch number...",
    setColumnVisibility,
  };
};

const EpochBlockchainGraphWidget = (): useGetGraphWidget => {
  const { data, isLoading } = useFetchEpochList();

  const filteredDataItems = (data?.data || []).filter(e => e);

  const { option } = useEpochBlockchain({ data: filteredDataItems });

  return {
    option,
    storageKey: "epoch_blockchain_store",
    wrapper: false,
    isLoading,
  };
};

const PoolListWidget = (
  page?: number,
  tableSearch?: string,
): useGetTableWidget<PoolsListColumns> => {
  const [sortByOrder, setSortByOrder] = useState<Order | undefined>(undefined);

  const updateLocalStorage = (value: Order | undefined) => {
    const storageSortList = localStorage.getItem(HOMEPAGE_SORT_KEY);

    localStorage.setItem(
      HOMEPAGE_SORT_KEY,
      JSON.stringify({
        ...(storageSortList && JSON.parse(storageSortList)),
        pool: {
          ...value,
        },
      }),
    );
  };

  const setListOrder = (order?: string) => {
    setSortByOrder(prev => {
      if (!prev) {
        updateLocalStorage({
          order,
          sort: "desc",
        });
        return {
          order,
          sort: "desc",
        };
      }

      const newState = {
        order: prev.sort === "asc" && prev.order === order ? undefined : order,
        sort:
          prev.order === order
            ? prev.sort === "desc"
              ? "asc"
              : undefined
            : "desc",
      } as any;

      updateLocalStorage(newState);
      return newState;
    });
  };

  useEffect(() => {
    const storageSortList = localStorage.getItem(HOMEPAGE_SORT_KEY);

    if (!storageSortList) {
      return;
    }

    const parsedStorageSortList = JSON.parse(storageSortList);

    if (parsedStorageSortList["pool"]) {
      setSortByOrder(parsedStorageSortList["pool"]);
    }
  }, []);

  const {
    columns,
    poolsListQuery,
    columnsVisibility,
    setColumnVisibility,
    items,
    hasFilter,
    filterKeys,
    totalItems,
    changeFilterByKey,
  } = usePoolList({
    page: page ?? 1,
    sort: sortByOrder?.sort,
    order: sortByOrder?.order as any,
    watchlist: false,
    enableSort: true,
    setList: setListOrder,
    storeKey: tableWidgetStoreKeys.pool,
    cropPoolHash: true,
    overrideRows: 20,
    overrideTableSearch: tableSearch,
    isHomepage: true,
  });

  const optionalColumns = ["pool", "stake", "rewards", "luck", "fees"];
  const mobileColumns = ["pool", "stake"];

  const fullColumns = [
    "pool",
    "stake",
    "rewards",
    "luck",
    "fees",
    "blocks",
    "pledge",
  ];

  const unneededColumns = ["top_delegator", "selected_vote"];

  return {
    columns: columns
      .slice(1)
      .filter(item => !unneededColumns.includes(item?.key)),
    items,
    totalItems,
    isLoading: poolsListQuery.isLoading,
    miniTableColumnsOrder: [],
    mobileColumns,
    optionalColumns,
    overrideWidth: {
      pool: 80,
      stake: 40,
      rewards: 40,
      luck: 40,
      fees: 40,
      blocks: 60,
    },
    hasFilter,
    filterKeys,
    optionalStartWidth: 1000,
    columnsVisibility,
    tableListOptions: poolsListTableOptions.filter(item =>
      fullColumns.includes(item.key),
    ),
    optionalTableListOptions: poolsListTableOptions.filter(item =>
      optionalColumns.includes(item.key),
    ),
    mobileTableListOptions: poolsListTableOptions.filter(item =>
      mobileColumns.includes(item.key),
    ),
    placeholder: "Search by pool name...",
    setColumnVisibility,
    changeFilterByKey,
  };
};

const PoolDetailWidget = (detailAddr: string): useDetailWidget => {
  const query = useFetchPoolDetail(
    detailAddr.startsWith("pool1") ? detailAddr : undefined,
    detailAddr.startsWith("pool1") ? undefined : detailAddr,
  );

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const data = query.data?.data;

  const estimatedBlocks =
    ((epochLength *
      activeSlotsCoeff *
      (1 - (miscConst?.epoch_param?.decentralisation ?? 0))) /
      (miscConst?.epoch_stat.stake.active ?? 1)) *
    (data?.active_stake ?? 1);

  const {
    aboutList: about,
    performanceList: perfomance,
    stakeAndPledgeList: stakeAndPledge,
  } = usePoolDetail({
    estimatedBlocks,
    query,
  });

  return {
    isLoading: query.isLoading,
    list: Object.entries({ about, perfomance, stakeAndPledge }),
    title: data ? (
      <PoolCell
        poolInfo={{
          id: data.pool_id,
          meta: data.pool_name,
        }}
        className='min-w-[100px] max-w-[200px]'
      />
    ) : (
      <></>
    ),
  };
};

export const useGetTableWidget = (
  type: WidgetTypes,
  dataType: WidgetDataTypes,
  page?: number,
  tableSearch?: string,
): useGetTableWidget<unknown> => {
  const isTableWidget = type === WidgetTypes.TABLE;

  if (isTableWidget) {
    switch (dataType) {
      case WidgetDataTypes.DREP:
        return DrepListWidget(page, tableSearch);
      case WidgetDataTypes.TX:
        return TxListWidget(page, tableSearch);
      case WidgetDataTypes.BLOCK:
        return BlockListWidget(page, tableSearch);
      case WidgetDataTypes.ASSET:
        return AssetListWidget(page, tableSearch);
      case WidgetDataTypes.EPOCH:
        return EpochListWidget(tableSearch);
      case WidgetDataTypes.POOL:
        return PoolListWidget(page, tableSearch);
    }
  }

  return {
    columns: [],
    isLoading: false,
    items: [],
    optionalColumns: [],
    mobileColumns: [],
    miniTableColumnsOrder: [],
    overrideWidth: {},
  };
};

export const useGetGraphWidget = (
  type: WidgetTypes,
  dataType: WidgetDataTypes,
): useGetGraphWidget => {
  const isGraphWidget = type === WidgetTypes.GRAPH;

  if (isGraphWidget) {
    switch (dataType) {
      case WidgetDataTypes.TX_IN_EPOCH:
        return TxInEpochGraphWidget();
      case WidgetDataTypes.EPOCH_BLOCKCHAIN:
        return EpochBlockchainGraphWidget();
      case WidgetDataTypes.BLOCK_PRODUCTION:
        return BlockProductionGraphWidget();
      case WidgetDataTypes.LATEST_BLOCKS:
        return LatestBlocksWidget();
      case WidgetDataTypes.BLOCK_SIZE_USED:
        return BlockSizeUsedGraphWidget();
    }
  }

  return {
    json: [],
    option: {},
    selectedItem: GraphTimePeriod.ThirtyDays,
    wrapper: false,
    storageKey: "",
    setData: () => undefined,
    setSelectedItem: () => undefined,
    isLoading: true,
  };
};

export const useGetDetailWidget = (
  type: WidgetTypes,
  dataType: WidgetDataTypes,
  detailAddr: string,
): useDetailWidget => {
  const isDetailWidget = type === WidgetTypes.DETAIL;

  if (isDetailWidget) {
    switch (dataType) {
      case WidgetDataTypes.POOL_DETAIL:
        return PoolDetailWidget(detailAddr);
      case WidgetDataTypes.ASSET_DETAIL:
        return AssetDetailWidget(detailAddr);
      case WidgetDataTypes.DREP_DETAIL:
        return DrepDetailWidget(detailAddr);
    }
  }

  return {
    isLoading: false,
    list: [],
  };
};
