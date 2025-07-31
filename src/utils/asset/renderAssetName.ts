import type { TxAsset } from "@/types/assetsTypes";
import { encodeAssetName } from "./encodeAssetName";
import { getAssetFingerprint } from "./getAssetFingerprint";

interface AssetProps {
  asset: TxAsset;
  name?: never;
}

interface NameProps {
  asset?: never;
  name: string;
}

type Props = AssetProps | NameProps;

export const renderAssetName = ({ asset, name }: Props) => {
  const assetName = asset?.name || name || "";

  if (asset?.registry?.name && asset?.registry?.ticker) {
    return `[${asset.registry.ticker}] ${asset.registry.name}`;
  }

  if (encodeAssetName(assetName)) {
    return encodeAssetName(assetName);
  }

  return getAssetFingerprint(assetName);
};
