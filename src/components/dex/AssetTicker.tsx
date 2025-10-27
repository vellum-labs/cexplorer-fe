import type { FC } from "react";
import { useFetchAssetDetail } from "@/services/assets";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { renderAssetName } from "@/utils/asset/renderAssetName";

interface AssetTickerProps {
  tokenName: string;
  showFullName?: boolean;
  registry?: {
    ticker?: string;
    name?: string;
  } | null;
}

export const AssetTicker: FC<AssetTickerProps> = ({
  tokenName,
  showFullName = false,
  registry: providedRegistry,
}) => {
  const fingerprint = getAssetFingerprint(tokenName);
  const { data } = useFetchAssetDetail(fingerprint, {
    enabled: !providedRegistry,
  });

  const registry = providedRegistry ?? data?.data?.registry;
  const ticker = registry?.ticker;
  const name = registry?.name;

  if (!ticker) return <span>{renderAssetName({ name: tokenName })}</span>;

  if (showFullName && name) return <span>{name}</span>;

  return <span>{ticker.toUpperCase()}</span>;
};
