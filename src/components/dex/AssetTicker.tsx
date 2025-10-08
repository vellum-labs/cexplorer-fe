import type { FC } from "react";
import { useFetchAssetDetail } from "@/services/assets";
import { getAssetFingerprint } from "@/utils/asset/getAssetFingerprint";
import { renderAssetName } from "@/utils/asset/renderAssetName";

interface AssetTickerProps {
  tokenName: string;
  showFullName?: boolean;
}

export const AssetTicker: FC<AssetTickerProps> = ({
  tokenName,
  showFullName = false,
}) => {
  const fingerprint = getAssetFingerprint(tokenName);
  const { data } = useFetchAssetDetail(fingerprint);

  const registry = data?.data?.registry;
  const ticker = registry?.ticker;
  const name = registry?.name;

  if (!ticker) return <span>{renderAssetName({ name: tokenName })}</span>;

  if (showFullName && name) return <span>{name}</span>;

  return <span>{ticker.toUpperCase()}</span>;
};
