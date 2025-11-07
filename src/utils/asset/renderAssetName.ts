import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";

interface AssetProps {
  name?: string;
  asset?: TxAsset;
}

export const renderAssetName = ({ asset, name }: AssetProps) => {
  const assetName = asset?.name || name || "";

  if (!name) {
    return "n/a";
  }

  if (asset?.registry?.name && asset?.registry?.ticker) {
    return `[${asset.registry.ticker}] ${asset.registry.name}`;
  }

  if (encodeAssetName(assetName)) {
    return encodeAssetName(assetName);
  }

  return getAssetFingerprint(assetName);
};
