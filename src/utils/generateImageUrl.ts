import { cexAssetUrl } from "@/constants/confVariables";

const buildJamonbreadUrl = (ident: string, size: string): string => {
  if (ident.length < 32) {
    return "-";
  }
  
  const pathParts = [
    ident[6],
    ident[12],
    ident[17],
    ident[25],
    ident[27],
    ident[31],
  ];
  
  return `https://i.jamonbread.io/${pathParts.join('/')}/${ident}/${size}`;
};

export const generateImageUrl = (
  ident: string,
  size: "ico" | "sm" | "md" | "lg",
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
  
  if (ident.startsWith("asset1")) {
    return buildJamonbreadUrl(ident, size);
  }

  if (type === "cc") {
    return `${cexAssetUrl}cc/${ident}`;
  }
  
  if (type === "token") {
    return `${cexAssetUrl}asset/${ident}`;
  }

  return "-";
};
