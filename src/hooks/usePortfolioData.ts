import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { fetchStakeDetail } from "@/services/stake";
import type { AddressAsset } from "@/types/addressTypes";

const calculateAssetValueInAda = (asset: AddressAsset): number => {
  const decimals = asset?.registry?.decimals ?? 0;
  const quantity = asset?.quantity ?? 0;
  const price = asset?.market?.price ?? 0;
  if (!price) return 0;
  const adjustedQuantity = quantity / Math.pow(10, decimals);
  const valueInLovelace = adjustedQuantity * price;
  return valueInLovelace / 1e6;
};

const getAssetLabel = (asset: AddressAsset): string => {
  if (asset.registry?.ticker) return `[${asset.registry.ticker}]`;
  if (asset.name) return asset.name;
  return "Unknown";
};

export interface BreakdownItem {
  name: string;
  valueAda: number;
  type: "ada" | "token" | "nft";
  assetName?: string;
}

export interface WalletData {
  walletId: string;
  adaBalance: number;
  tokenCount: number;
  nftCount: number;
  tokenValueAda: number;
  nftValueAda: number;
  totalValueAda: number;
  poolDelegation: string | null;
  drepDelegation: string | null;
  isLoading: boolean;
  isError: boolean;
}

export const usePortfolioData = () => {
  const { wallets, selectedWalletId } = usePortfolioStore();

  const queries = useQueries({
    queries: wallets.map(wallet => ({
      queryKey: ["portfolio-stake-detail", wallet.stakeAddress],
      queryFn: () => fetchStakeDetail({ view: wallet.stakeAddress }),
      enabled: !!wallet.stakeAddress,
      staleTime: 60_000,
    })),
  });

  const walletDataList: WalletData[] = wallets.map((wallet, i) => {
    const query = queries[i];
    const stakeData = query?.data?.data;

    const assets = stakeData?.asset ?? [];
    const tokens = assets.filter(a => a.quantity > 1);
    const nfts = assets.filter(a => a.quantity === 1);

    const tokenValueAda = tokens.reduce(
      (sum, a) => sum + calculateAssetValueInAda(a),
      0,
    );
    const nftValueAda = nfts.reduce(
      (sum, a) => sum + calculateAssetValueInAda(a),
      0,
    );

    const balanceFromStake =
      stakeData?.stake?.live?.amount ?? stakeData?.stake?.active?.amount ?? 0;
    const adaBalance = Number(balanceFromStake) || 0;

    return {
      walletId: wallet.id,
      adaBalance,
      tokenCount: tokens.length,
      nftCount: nfts.length,
      tokenValueAda,
      nftValueAda,
      totalValueAda: adaBalance / 1e6 + tokenValueAda + nftValueAda,
      poolDelegation: stakeData?.stake?.live?.deleg?.id ?? null,
      drepDelegation: stakeData?.vote?.vote?.live_drep ?? null,
      isLoading: query?.isLoading ?? true,
      isError: query?.isError ?? false,
    };
  });

  const selectedWalletData = selectedWalletId
    ? walletDataList.find(w => w.walletId === selectedWalletId)
    : null;

  const displayData = selectedWalletData
    ? [selectedWalletData]
    : walletDataList;

  const totals = {
    adaBalance: displayData.reduce((sum, w) => sum + w.adaBalance, 0),
    tokenCount: displayData.reduce((sum, w) => sum + w.tokenCount, 0),
    nftCount: displayData.reduce((sum, w) => sum + w.nftCount, 0),
    tokenValueAda: displayData.reduce((sum, w) => sum + w.tokenValueAda, 0),
    nftValueAda: displayData.reduce((sum, w) => sum + w.nftValueAda, 0),
    totalValueAda: displayData.reduce((sum, w) => sum + w.totalValueAda, 0),
  };

  const breakdownItems: BreakdownItem[] = useMemo(() => {
    const relevantWalletIds = selectedWalletId
      ? [selectedWalletId]
      : wallets.map(w => w.id);

    const assetMap = new Map<string, BreakdownItem>();
    let totalAdaBalance = 0;

    relevantWalletIds.forEach((walletId, walletIndex) => {
      const query = queries[wallets.findIndex(w => w.id === walletId)];
      const stakeData = query?.data?.data;
      if (!stakeData) return;

      const balance =
        Number(stakeData.stake?.live?.amount ?? stakeData.stake?.active?.amount ?? 0) / 1e6;
      totalAdaBalance += balance;

      const assets = stakeData.asset ?? [];
      for (const asset of assets) {
        const value = calculateAssetValueInAda(asset);
        if (value <= 0) continue;

        const label = getAssetLabel(asset);
        const type = asset.quantity === 1 ? "nft" : "token";
        const key = `${label}_${type}`;

        const existing = assetMap.get(key);
        if (existing) {
          existing.valueAda += value;
        } else {
          assetMap.set(key, { name: label, valueAda: value, type, assetName: asset.name });
        }
      }
    });

    const items: BreakdownItem[] = [
      { name: "ADA", valueAda: totalAdaBalance, type: "ada" },
    ];

    const sorted = Array.from(assetMap.values()).sort(
      (a, b) => b.valueAda - a.valueAda,
    );

    const TOP_COUNT = 15;
    const topItems = sorted.slice(0, TOP_COUNT);
    const restItems = sorted.slice(TOP_COUNT);

    items.push(...topItems);

    if (restItems.length > 0) {
      const othersValue = restItems.reduce((sum, i) => sum + i.valueAda, 0);
      items.push({ name: "Others", valueAda: othersValue, type: "token" });
    }

    return items;
  }, [queries, wallets, selectedWalletId]);

  const isLoading = queries.some(q => q.isLoading);
  const isError = queries.some(q => q.isError);

  const combinedAssets: AddressAsset[] = useMemo(() => {
    const relevantWalletIds = selectedWalletId
      ? [selectedWalletId]
      : wallets.map(w => w.id);

    const assetMap = new Map<string, AddressAsset>();

    relevantWalletIds.forEach(walletId => {
      const query = queries[wallets.findIndex(w => w.id === walletId)];
      const stakeData = query?.data?.data;
      if (!stakeData) return;

      const assets = stakeData.asset ?? [];
      for (const asset of assets) {
        const existing = assetMap.get(asset.name);
        if (existing) {
          existing.quantity += asset.quantity;
        } else {
          assetMap.set(asset.name, { ...asset });
        }
      }
    });

    return Array.from(assetMap.values());
  }, [queries, wallets, selectedWalletId]);

  const stakeAddresses = useMemo(() => {
    if (selectedWalletId) {
      const wallet = wallets.find(w => w.id === selectedWalletId);
      return wallet ? [wallet.stakeAddress] : [];
    }
    return wallets.map(w => w.stakeAddress);
  }, [wallets, selectedWalletId]);

  return {
    walletDataList,
    selectedWalletData,
    totals,
    breakdownItems,
    combinedAssets,
    stakeAddresses,
    isLoading,
    isError,
  };
};
