import type { TxAsset } from "@/types/assetsTypes";
import {
  encodeAssetName,
  formatString,
  getAssetFingerprint,
} from "@vellumlabs/cexplorer-sdk";

interface AssetProps {
  name?: string;
  asset?: TxAsset;
  type?: "long" | "short" | "shorter";
  fingerprint?: string;
}

const isSafeToDisplay = (name: string): boolean => {
  return /^[\x20-\x7E]+$/.test(name);
};

export const renderAssetName = ({
  asset,
  name,
  type,
  fingerprint: passedFingerprint,
}: AssetProps) => {
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

  const getFingerprint = () =>
    passedFingerprint || getAssetFingerprint(assetName);

  if (assetName.length <= 56) {
    return formatString(getFingerprint(), "short");
  }

  const nameOnly = assetName.slice(56);

  if (!nameOnly || nameOnly.trim().length === 0) {
    return formatString(getFingerprint(), "short");
  }

  const nameWithoutAdaHandlePrefix = nameOnly.replace(
    /^(000de140|0014df10|000643b0|000010)/,
    "",
  );
  const encodedName = encodeAssetName(nameWithoutAdaHandlePrefix || nameOnly);

  if (encodedName && encodedName.trim().length > 0) {
    if (!isSafeToDisplay(encodedName)) {
      return formatString(getFingerprint(), "short");
    }

    return type && encodedName.length > FORMAT_LIMIT
      ? formatString(encodedName, type)
      : encodedName;
  }

  return formatString(getFingerprint(), "short");
};
