import AssetFingerprint from "@emurgo/cip14-js";
import { Buffer } from "buffer";

export function getAssetFingerprint(assetName: string) {
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
