import type { JobCardano } from "@jamonbread/sdk";
import type { WalletApi } from "lucid-cardano";
import type { ResponseCore } from "./commonTypes";

export interface WalletState {
  address: string | undefined;
  stakeKey: string | undefined;
  walletType: WalletType | undefined;
  walletApi: WalletApi | undefined;
  disabledExt?: boolean;
  job: JobCardano | null;
}

export type WalletInfo = {
  name: string;
  icon: string;
  darkIcon?: string;
  unsuportedBrowsers: string[];
  hasMobileApp: boolean;
  extensionUrl: string;
};

export type WalletType =
  | "lace"
  | "flint"
  | "yoroi"
  | "eternl"
  | "nufi"
  | "nufiSnap"
  | "nufiSSO";

type CompareWalletBoolean = unknown[] | null | false | true | undefined;

interface WalletPlatforms {
  iOS: CompareWalletBoolean;
  web: CompareWalletBoolean;
  android: CompareWalletBoolean;
}

interface HardwareWalletCompatibility {
  ledger: CompareWalletBoolean;
  trezor: CompareWalletBoolean;
  keystone: CompareWalletBoolean;
}

interface WalletPartner {
  enabled: CompareWalletBoolean;
  partner: string;
}

export interface CompareWallet {
  customNode: CompareWalletBoolean;
  fiatOnramp: WalletPartner;
  opensource: CompareWalletBoolean;
  addressBook: CompareWalletBoolean;
  dAppBrowser: CompareWalletBoolean;
  internalName: string;
  otherFeatures: {
    [key: string]: string;
  };
  swapsInWallet: WalletPartner;
  governanceInfo: string;
  stakingSupport: CompareWalletBoolean;
  testnetSupport: CompareWalletBoolean;
  multipleAccounts: CompareWalletBoolean;
  governanceSupport: CompareWalletBoolean;
  supportedPlatforms: WalletPlatforms;
  multiPoolDelegation: CompareWalletBoolean;
  crossChainCompatibility: {
    enabled: CompareWalletBoolean;
    supportedChains: string[];
  };
  smartContractInteraction: CompareWalletBoolean;
  nftMarketplaceIntegration: WalletPartner;
  hardwareWalletCompatibility: HardwareWalletCompatibility;
}

interface CompareWallets {
  name: string;
  url: string;
  type: string;
  category: null | string;
  pub_date: string;
  mod_date: null | string;
  keywords: string;
  description: string;
  image: null | string;
  license: null | string;
  state: null | string;
  render: string;
  mirroring_article: null | string;
  data: CompareWallet[][];
}

export interface CompareWalletsOptions {
  columnsVisibility: {
    [key: string]: boolean;
  };
}

export type CompareWalletsResponse = ResponseCore<CompareWallets>;
