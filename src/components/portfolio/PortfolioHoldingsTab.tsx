import { useState, useMemo, type FC } from "react";
import { Switch, Tabs, TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { AddressAssetTable } from "@/components/address/AddressAssetTable";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { configJSON } from "@/constants/conf";

export const PortfolioHoldingsTab: FC = () => {
  const { t } = useAppTranslation("common");
  const { combinedAssets, isLoading } = usePortfolioData();
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;

  const [activeAsset, setActiveAsset] = useState<string>("all");
  const [lowBalances, setLowBalances] = useState(false);
  const [tableSearch, setTableSearch] = useState("");

  const debouncedSearch = tableSearch;

  const filteredAssets = useMemo(() => {
    let result = combinedAssets;

    if (activeAsset === "tokens") {
      result = result.filter(a => a.quantity > 1);
    } else if (activeAsset === "nfts") {
      result = result.filter(a => a.quantity === 1);
    }

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      result = result.filter(a => {
        if (a.registry?.ticker?.toLowerCase().includes(search)) return true;
        if (a.registry?.name?.toLowerCase().includes(search)) return true;
        if (a.name?.toLowerCase().includes(search)) return true;
        return false;
      });
    }

    return result.sort((a, b) => {
      const valueA = (a.quantity / Math.pow(10, a.registry?.decimals ?? 0)) * (a.market?.price ?? 0);
      const valueB = (b.quantity / Math.pow(10, b.registry?.decimals ?? 0)) * (b.market?.price ?? 0);
      return valueB - valueA;
    });
  }, [combinedAssets, activeAsset, debouncedSearch]);

  const assetTabItems = [
    { key: "all", label: t("address.all"), visible: true },
    { key: "tokens", label: t("address.tokens"), visible: true },
    { key: "nfts", label: t("address.nfts"), visible: true },
  ];

  const fakeQuery = {
    isLoading,
    isError: false,
    isFetching: false,
  } as any;

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <div className='flex flex-col gap-2'>
        <Tabs
          withPadding={false}
          withMargin={false}
          tabParam='asset'
          items={assetTabItems}
          activeTabValue={activeAsset}
          onClick={(key: string) => setActiveAsset(key)}
        />
        <div className='flex w-full flex-wrap justify-between gap-1.5 md:flex-nowrap'>
          <div className='flex flex-col gap-1'>
            {activeAsset !== "nfts" && (tokenMarket || nftMarket) && (
              <div className='flex gap-1'>
                <Switch
                  onClick={() => setLowBalances(lowBalances)}
                  active={!lowBalances}
                />
                <span className='text-text-sm font-medium text-grayTextPrimary'>
                  {t("address.hideLowBalances")}
                </span>
              </div>
            )}
            <span className='text-text-xs text-grayTextPrimary'>
              {activeAsset === "nfts"
                ? t("address.displayingNfts", { count: filteredAssets.length })
                : t("address.displayingTokens", { count: filteredAssets.length })}
            </span>
          </div>
          <div className='flex flex-grow items-center gap-1 sm:flex-grow-0'>
            <TableSearchInput
              placeholder={t("phrases.searchResults")}
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='md:w-[320px] w-full'
              showSearchIcon
              showPrefixPopup={false}
            />
          </div>
        </div>
      </div>
      <AddressAssetTable
        assets={filteredAssets}
        addressQuery={fakeQuery}
        activeAsset={activeAsset}
        lowBalances={lowBalances}
      />
    </div>
  );
};
