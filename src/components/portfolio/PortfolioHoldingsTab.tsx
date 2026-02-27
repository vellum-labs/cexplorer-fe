import { useState, useMemo, type FC } from "react";
import { Switch, Tabs, TableSearchInput, SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import { AddressAssetTable } from "@/components/address/AddressAssetTable";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { configJSON } from "@/constants/conf";

export const PortfolioHoldingsTab: FC = () => {
  const { t } = useAppTranslation("common");
  const { combinedAssets, isLoading } = usePortfolioData();
  const tokenMarket = configJSON.market[0].token[0].active;
  const nftMarket = configJSON.market[0].nft[0].active;

  const [activeAsset, setActiveAsset] = useState<string>("all");
  const [lowBalances, setLowBalances] = useState(false);

  const [{ debouncedTableSearch: debouncedSearch, tableSearch }, setTableSearch] =
    useSearchTable();

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
    <div>
      <Tabs
        withPadding={false}
        withMargin={false}
        items={assetTabItems}
        activeTabValue={activeAsset}
        onClick={(key: string) => setActiveAsset(key)}
      />
      <div className='flex flex-wrap items-center justify-between gap-2 py-2'>
        <div className='flex items-center gap-3'>
          {(tokenMarket || nftMarket) && (
            <Switch
              enabled={lowBalances}
              onChange={() => setLowBalances(!lowBalances)}
              label={t("address.hideLowBalances")}
            />
          )}
          <span className='flex items-center gap-1 text-text-xs text-grayTextPrimary'>
            {activeAsset === "nfts"
              ? t("address.displayingNfts", { count: filteredAssets.length })
              : t("address.displayingTokens", { count: filteredAssets.length })}
          </span>
        </div>
        <TableSearchInput
          tableSearch={tableSearch}
          setTableSearch={setTableSearch}
          placeholder={t("phrases.searchResults")}
        />
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
