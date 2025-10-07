import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { AssetTicker } from "./AssetTicker";

interface AssetDisplayProps {
  tokenName: string;
  fingerprint: string;
}

export const AssetDisplay: FC<AssetDisplayProps> = ({
  tokenName,
  fingerprint,
}) => {
  const renderedName = renderAssetName({ name: tokenName });
  const isAda =
    tokenName === "lovelaces" ||
    tokenName === "lovelace" ||
    tokenName?.toLowerCase().includes("lovelace") ||
    renderedName?.toLowerCase().includes("lovelace");

  if (isAda) {
    return <p className='text-sm font-semibold text-text'>ADA</p>;
  }

  return (
    <Link
      to='/asset/$fingerprint'
      params={{
        fingerprint,
      }}
    >
      <p className='font-semibold text-primary'>
        <AssetTicker tokenName={tokenName} />
      </p>
    </Link>
  );
};
