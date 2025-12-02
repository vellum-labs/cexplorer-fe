import { configJSON } from "@/constants/conf";

export const networks = [
  {
    label: "Mainnet",
    url: "https://cexplorer.io",
    isActive: configJSON.network === "mainnet",
  },
  {
    label: "Preprod testnet",
    url: "https://preprod.cexplorer.io",
    isActive: configJSON.network === "preprod",
  },
  {
    label: "Preview testnet",
    url: "https://preview.cexplorer.io",
    isActive: configJSON.network === "preview",
  },
];
