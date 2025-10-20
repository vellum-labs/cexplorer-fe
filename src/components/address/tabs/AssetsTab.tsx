import type { AddressAsset } from "@/types/addressTypes";
import { useEffect, type FC, type ReactNode } from "react";

import { Switch } from "@vellumlabs/cexplorer-sdk";
import Tabs from "@/components/global/Tabs";
import TableSettingsDropdown from "@/components/global/dropdowns/TableSettingsDropdown";
import TableSearchInput from "@/components/global/inputs/SearchInput";
import { AddressAssetTable } from "../AddressAssetTable";

import { useAddressDetailAssetTableStore } from "@/stores/tables/addressDetailAssetTableStore";

import { addressDetailAssetTableOptions } from "@/constants/tables/addressDetailAssetTableOptions";
import type { useFetchAddressDetail } from "@/services/address";
import type { useFetchStakeDetail } from "@/services/stake";
import type { AddressDetailAssetTableOptions } from "@/types/tableTypes";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { configJSON } from "@/constants/conf";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { useSearch } from "@tanstack/react-router";

interface AssetsTabProps {
  assets: AddressAsset[];
  addressQuery: ReturnType<
    typeof useFetchAddressDetail | typeof useFetchStakeDetail
  >;
  stakeKey?: string | undefined;
  isStake?: boolean;
}

interface EpochListOptions {
  key: keyof AddressDetailAssetTableOptions["columnsVisibility"];
  name: string;
}

export const AssetsTab: FC<AssetsTabProps> = ({
  assets,
  addressQuery,
  stakeKey,
  isStake,
}) => {
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;
  const basicOptionsKeys = ["token", "holdings", "supply"];
  let options: EpochListOptions[] = [];

  const { asset } = useSearch({
    from: isStake ? "/stake/$stakeAddr" : "/address/$address",
  });

  const [
    { debouncedTableSearch: debouncedSearch, tableSearch },
    setTableSearch,
  ] = useSearchTable();

  const {
    rows,
    columnsVisibility,
    lowBalances,
    activeAsset,
    activeDetail,
    setRows,
    setColumnVisibility,
    setLowBalances,
    setActiveAsset,
    setActiveDetail,
  } = useAddressDetailAssetTableStore();

  if (
    (activeAsset === "nfts" && nftMarket) ||
    (activeAsset !== "nfts" && tokenMarket)
  ) {
    options = addressDetailAssetTableOptions;
  } else {
    options = addressDetailAssetTableOptions.filter(item =>
      basicOptionsKeys.includes(item.key),
    );
  }

  const filteredAssets = assets
    .filter(item => {
      if (activeAsset === "tokens") {
        return item.quantity > 1;
      }

      if (activeAsset !== "nfts") {
        return item;
      }

      return item.quantity === 1;
    })
    .filter(item => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          getAssetFingerprint(item.name.toLowerCase()).includes(searchLower) ||
          (item.registry?.name &&
            typeof item.registry.name === "string" &&
            item.registry.name.toLowerCase().includes(searchLower)) ||
          (item.registry?.ticker &&
            typeof item.registry.ticker === "string" &&
            item.registry.ticker.toLowerCase().includes(searchLower)) ||
          renderAssetName({ asset: item }).toLowerCase().includes(searchLower)
        );
      }

      return item;
    })
    .sort((a, b) => {
      const calculateValue = (item: AddressAsset) => {
        const decimals = item?.registry?.decimals ?? 0;
        const quantity = item?.quantity ?? 0;
        const price = item?.market?.price ?? 0;

        if (!price) return 0;

        const adjustedQuantity = quantity / Math.pow(10, decimals);
        return adjustedQuantity * price;
      };

      const valueA = calculateValue(a);
      const valueB = calculateValue(b);

      return valueB - valueA;
    });

  const assetTabItems = [
    {
      key: "all",
      label: "All",
      visible: true,
    },
    {
      key: "tokens",
      label: "Tokens",
      visible: true,
    },
    {
      key: "nfts",
      label: "NFTs",
      visible: true,
    },
  ];

  const detailsTabItem = [
    {
      key: "address",
      label: "Address",
      visible: true,
    },
    {
      key: "stake",
      label: "Stake",
      visible: true,
    },
  ];

  useEffect(() => {
    if (asset) {
      setActiveAsset(asset);
    }
  }, [asset]);

  return (
    <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 xl:flex-nowrap xl:justify-start'>
      <div className='flex w-full flex-col gap-1.5'>
        <div className='flex flex-col gap-2'>
          <div className='flex w-full'>
            <Tabs
              withPadding={false}
              withMargin={false}
              tabParam='asset'
              items={assetTabItems}
              activeTabValue={activeAsset}
              onClick={activeTab => setActiveAsset(activeTab)}
            />
            {stakeKey && (
              <Tabs
                withPadding={false}
                withMargin={false}
                tabParam='detail'
                items={detailsTabItem}
                activeTabValue={activeDetail}
                onClick={activeTab => setActiveDetail(activeTab)}
                toRight
              />
            )}
          </div>
          <div className='flex w-full flex-wrap justify-between gap-1.5 md:flex-nowrap'>
            <div className='flex flex-col gap-1'>
              {activeAsset !== "nfts" && (
                <div className='flex gap-1'>
                  <Switch
                    onClick={() => setLowBalances(lowBalances)}
                    active={!lowBalances}
                  />
                  <span className='text-text-sm font-medium text-grayTextPrimary'>
                    Hide Low Balances
                  </span>
                </div>
              )}
              <span className='text-text-xs text-grayTextPrimary'>
                Displaying {filteredAssets.length}{" "}
                {activeAsset === "nfts" ? "NFTs" : "tokens"}
              </span>
            </div>
            <div className='flex flex-grow items-center gap-1 sm:flex-grow-0'>
              <TableSearchInput
                placeholder='Search your results...'
                value={tableSearch}
                onchange={setTableSearch}
                wrapperClassName='md:w-[320px] w-full'
                showSearchIcon
                showPrefixPopup={false}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={
                  options.map(item => {
                    return {
                      label: item.name,
                      isVisible: columnsVisibility[item.key],
                      onClick: () =>
                        setColumnVisibility(
                          item.key,
                          !columnsVisibility[item.key],
                        ),
                    };
                  }) as {
                    label: ReactNode;
                    isVisible: boolean;
                    onClick?: any;
                  }[]
                }
              />
            </div>
          </div>
        </div>
        <AddressAssetTable
          key={activeAsset}
          addressQuery={addressQuery}
          detail={activeDetail as "address" | "stake"}
          lowBalances={lowBalances}
          assets={filteredAssets}
          activeAsset={activeAsset}
        />
      </div>
    </div>
  );
};
