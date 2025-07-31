import { cexAssetUrl } from "@/constants/confVariables";

export const generateImageUrl = (
  ident: string,
  size: "ico" | "sm" | "md" | "lg",
  type?: "nft" | "pool" | "drep" | "token",
): string => {
  if (!ident) {
    return "-";
  }

  if (ident.startsWith("drep1")) {
    return `${cexAssetUrl}${ident}`;
  }

  if (ident.startsWith("pool")) {
    return `${cexAssetUrl}${ident}`;
  } else if (type === "token") {
    return `${cexAssetUrl}asset/${ident}`;
  }

  const identIncludes1 =
    ident.startsWith("asset1") ||
    ident.startsWith("pool1") ||
    ident.startsWith("drep1");
  return (
    "https://i.jamonbread.io/" +
    ident[!identIncludes1 ? 1 : 6] +
    "/" +
    ident[!identIncludes1 ? 7 : 12] +
    "/" +
    ident[!identIncludes1 ? 12 : 17] +
    "/" +
    ident[!identIncludes1 ? 20 : 25] +
    "/" +
    ident[!identIncludes1 ? 22 : 27] +
    "/" +
    ident[!identIncludes1 ? 26 : 31] +
    "/" +
    `${identIncludes1 ? "" : type || "asset"}` +
    ident +
    "/" +
    size
  );
};
