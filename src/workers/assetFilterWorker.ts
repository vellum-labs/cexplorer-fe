import { AssetFilterMessageTypes } from "@/constants/worker";
import AssetFingerprint from "@emurgo/cip14-js";
import { Buffer } from "buffer";

interface AddressAsset {
  name: string;
  quantity: number;
  registry?: {
    ticker?: string;
    name?: string;
    decimals?: number;
  };
  market?: {
    price?: number;
  };
}

function getAssetFingerprint(assetName: string): string {
  const policyId = assetName.includes(".")
    ? assetName.split(".")[0]
    : assetName.slice(0, 56);
  const name = assetName.includes(".")
    ? assetName.split(".")[1]
    : assetName.slice(56);

  const assetFingerprint = AssetFingerprint.fromParts(
    Buffer.from(policyId, "hex"),
    Buffer.from(name, "hex"),
  );

  return assetFingerprint.fingerprint();
}

function encodeAssetName(hex: string | number): string {
  if (!hex) {
    return "";
  }

  let str = "";
  const strHex =
    hex.toString().length > 56 ? hex.toString().slice(56) : hex.toString();
  for (let i = 0; i < strHex.length; i += 2) {
    const hexCode = strHex.substr(i, 2);
    const charCode = parseInt(hexCode, 16);
    str += String.fromCharCode(charCode);
  }
  return str;
}

self.addEventListener("message", event => {
  const data = event.data;

  switch (data.type) {
    case AssetFilterMessageTypes.FILTER_ASSETS: {
      const { assets, activeAsset, search } = data.data as {
        assets: AddressAsset[];
        activeAsset: string;
        search: string;
      };

      const typeFiltered = assets.filter(item => {
        switch (activeAsset) {
          case "tokens":
            return item.quantity > 1;
          case "nfts":
            return item.quantity === 1;
          default:
            return true;
        }
      });

      const searchFiltered = search
        ? (() => {
            const searchLower = search.toLowerCase();
            return typeFiltered.filter(item => {
              const ticker = item.registry?.ticker;
              if (
                typeof ticker === "string" &&
                ticker.toLowerCase().includes(searchLower)
              ) {
                return true;
              }

              const registryName = item.registry?.name;
              if (
                typeof registryName === "string" &&
                registryName.toLowerCase().includes(searchLower)
              ) {
                return true;
              }

              if (item.name.toLowerCase().includes(searchLower)) {
                return true;
              }

              const fingerprint = getAssetFingerprint(item.name);
              if (fingerprint.toLowerCase().includes(searchLower)) {
                return true;
              }

              const encodedName = encodeAssetName(item.name);
              if (encodedName.toLowerCase().includes(searchLower)) {
                return true;
              }

              return false;
            });
          })()
        : typeFiltered;

      const result = searchFiltered.sort((a, b) => {
        const calculateValue = (item: AddressAsset) => {
          const decimals = item?.registry?.decimals ?? 0;
          const quantity = item?.quantity ?? 0;
          const price = item?.market?.price ?? 0;

          if (!price) return 0;

          const adjustedQuantity = quantity / Math.pow(10, decimals);
          return adjustedQuantity * price;
        };

        return calculateValue(b) - calculateValue(a);
      });

      self.postMessage({
        type: AssetFilterMessageTypes.FILTER_RESULT,
        result,
      });
      break;
    }
  }
});
