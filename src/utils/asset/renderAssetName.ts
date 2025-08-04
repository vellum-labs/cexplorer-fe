import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName } from "./encodeAssetName";
import { getAssetFingerprint } from "./getAssetFingerprint";

interface AssetProps {
  name?: string;
  asset?: TxAsset;
}

export const renderAssetName = ({ asset, name }: AssetProps) => {
  const assetName = asset?.name || name || "";

  if (asset?.registry?.name && asset?.registry?.ticker) {
    return `[${asset.registry.ticker}] ${asset.registry.name}`;
  }

  if (encodeAssetName(assetName)) {
    return encodeAssetName(assetName);
  }

  return getAssetFingerprint(assetName);
};
