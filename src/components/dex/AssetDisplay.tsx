import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { renderAssetName } from "@/utils/asset/renderAssetName";
import { AssetTicker } from "./AssetTicker";

interface AssetDisplayProps {
  tokenName: string;
  fingerprint: string;
  fontWeight?: "normal" | "semibold";
  registry?: {
    ticker?: string;
    name?: string;
  } | null;
}

export const AssetDisplay: FC<AssetDisplayProps> = ({
  tokenName,
  fingerprint,
  fontWeight = "semibold",
  registry,
}) => {
  const renderedName = renderAssetName({ name: tokenName });
  const isAda =
    tokenName === "lovelaces" ||
    tokenName === "lovelace" ||
    tokenName?.toLowerCase().includes("lovelace") ||
    renderedName?.toLowerCase().includes("lovelace");

  const fontClass = fontWeight === "semibold" ? "font-semibold" : "font-normal";

  if (isAda) {
    return <p className={`text-sm ${fontClass} text-text`}>ADA</p>;
  }

  return (
    <Link
      to='/asset/$fingerprint'
      params={{
        fingerprint,
      }}
    >
      <p className={`${fontClass} text-primary`}>
        <AssetTicker tokenName={tokenName} registry={registry} />
      </p>
    </Link>
  );
};
