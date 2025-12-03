import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName, formatString } from "@vellumlabs/cexplorer-sdk";

interface AssetProps {
  name?: string;
  asset?: TxAsset;
  type?: "long" | "short" | "shorter";
}

export const renderAssetName = ({ asset, name, type }: AssetProps) => {
  const assetName = asset?.name || name || "";

  const FORMAT_LIMIT = 20;

  if (!assetName) {
    return "n/a";
  }

  if (asset?.registry?.name && asset?.registry?.ticker) {
    const formatedName = `[${asset.registry.ticker}] ${asset.registry.name}`;

    return type && formatedName.length > FORMAT_LIMIT
      ? formatString(formatedName, type)
      : formatedName;
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
    return type && encodedName.length > FORMAT_LIMIT
      ? formatString(encodedName, type)
      : encodedName;
  }

  return "n/a";
};
