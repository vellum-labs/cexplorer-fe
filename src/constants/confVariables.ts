import { configJSON } from "./conf";

export const apiUrl = configJSON.api[0].endpoint;
export const network = configJSON.network;
export const activeSlotsCoeff =
  configJSON.genesisParams[0].shelley[0].activeSlotsCoeff;
export const epochLength = configJSON.genesisParams[0].shelley[0].epochLength;
export const EPOCH_LENGTH_DAYS = epochLength / 86400;
export const epochStart =
  configJSON.genesisParams[0].shelley[0].shelleyStartEpoch;

export const slotDurationByron =
  configJSON.genesisParams[0].byron[0].slotDuration;
export const slotsPerKESPeriod =
  configJSON.genesisParams[0].shelley[0].slotsPerKESPeriod;

export const supportedWallets = configJSON.supportedWallets[0];
export const enabledWalletConnector = configJSON.enabledFeatures.some(
  feature => feature.user && feature.user.includes("web3_login"),
);

export const proPolicy = configJSON.nft;
export const supportedPools = configJSON.supportedPools;
export const donationAddress = configJSON.donationAddress;
export const adaHandlePolicy = configJSON.integration[0].adahandle[0].policy;
const protocol = `${configJSON.proto}://`;

export const cexAssetUrl = "https://ix.cexplorer.io/";
export const cexNftImageUrl = "https://im.cexplorer.io/";
export const jamUrl = "https://jamonbread.io/";

export const webUrl = `${protocol + configJSON.domain}`;
