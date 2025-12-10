import {
  cexAssetUrl,
  cexNftImageUrl,
  network,
} from "@/constants/confVariables";

const buildNftImageUrl = (
  fingerprint: string,
  size: "sm" | "md" | "lg" = "sm",
): string => {
  if (!fingerprint || fingerprint.length < 32) {
    return "-";
  }

  return `${cexNftImageUrl}${network}/${fingerprint}/${size}`;
};

export const generateImageUrl = (
  ident: string,
  size: "ico" | "sm" | "md" | "lg" = "sm",
  type?: "nft" | "pool" | "drep" | "token" | "cc",
): string => {
  if (!ident) {
    return "-";
  }

  if (ident.startsWith("drep")) {
    return `${cexAssetUrl}${ident}`;
  }

  if (ident.startsWith("pool")) {
    return `${cexAssetUrl}${ident}`;
  }

  if (type === "cc") {
    return `${cexAssetUrl}cc/${ident}`;
  }

  if (ident.startsWith("asset1") && type === "nft") {
    const nftSize = size === "ico" ? "sm" : size;
    return buildNftImageUrl(ident, nftSize as "sm" | "md" | "lg");
  }

  if (type === "token") {
    return `${cexAssetUrl}asset/${ident}`;
  }

  return "-";
};
