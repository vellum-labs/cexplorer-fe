import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";

interface AssetProps {
  name?: string;
  asset?: TxAsset;
}

export const renderAssetName = ({ asset, name }: AssetProps) => {
  const assetName = asset?.name || name || "";

  if (!assetName) {
    return "n/a";
  }

  if (asset?.registry?.name && asset?.registry?.ticker) {
    return `[${asset.registry.ticker}] ${asset.registry.name}`;
  }

  if (assetName.length <= 56) {
    return "n/a";
  }

  const nameOnly = assetName.slice(56);

  if (!nameOnly || nameOnly.trim().length === 0) {
    return "n/a";
  }

  const encodedName = encodeAssetName(assetName);

  if (encodedName && encodedName.trim().length > 0) {
    return encodedName;
  }

  return "n/a";
};
