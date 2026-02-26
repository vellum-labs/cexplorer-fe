import { network } from "@/constants/confVariables";

export interface UplcScriptDetail {
  scriptName: string;
  moduleName: string;
  validatorName: string;
  purposes: string[];
  rawHash: string;
  finalHash: string;
  plutusVersion: string;
  parameterizationStatus: string;
}

export interface UplcScriptResponse {
  txHash: string;
  sourceUrl: string;
  commitHash: string;
  sourcePath: string;
  compilerType: string;
  compilerVersion: string;
  status: string;
  scripts: UplcScriptDetail[];
}

function getApiBase(): string {
  if (network === "mainnet") {
    return "https://api.uplc.link";
  }
  return "https://preview-api.uplc.link";
}

export async function fetchUplcScript(
  scriptHash: string,
): Promise<UplcScriptResponse | null> {
  const base = getApiBase();
  const url = `${base}/api/v1/scripts/by-hash/${scriptHash}`;

  const res = await fetch(url);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    return null;
  }
  return res.json();
}
