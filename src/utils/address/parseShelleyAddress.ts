import { bech32 } from "bech32";

interface ShelleyAddress {
  network: string;
  addressType: string;
  paymentPart: string | null;
  delegationPart: string | null;
}

export const parseShelleyAddress = (address: string): ShelleyAddress | null => {
  const MAINNET_NETWORK = "addr1";
  const TESTNET_NETWORK = "addr_test1";
  const MAINNET_STAKE = "stake1";
  const TESTNET_STAKE = "stake_test1";

  if (
    !address.startsWith(MAINNET_NETWORK) &&
    !address.startsWith(TESTNET_NETWORK) &&
    !address.startsWith(MAINNET_STAKE) &&
    !address.startsWith(TESTNET_STAKE)
  ) {
    console.error("Invalid Shelley or staking address format");
    return null;
  }

  let network = "";
  let addressType = "";

  if (address.startsWith(MAINNET_NETWORK)) {
    network = "mainnet";
    addressType = "payment";
  } else if (address.startsWith(TESTNET_NETWORK)) {
    network = "testnet";
    addressType = "payment";
  } else if (address.startsWith(MAINNET_STAKE)) {
    network = "mainnet";
    addressType = "stake";
  } else if (address.startsWith(TESTNET_STAKE)) {
    network = "testnet";
    addressType = "stake";
  }

  let decoded;

  try {
    decoded = bech32.decode(address, 1000);
  } catch (error) {
    console.error("Failed to decode address:", error);
    return null;
  }

  const data = bech32.fromWords(decoded.words);
  const headerByte = data[0];

  const partType = (headerByte >> 4) & 0b1111;

  if (addressType === "stake") {
    let delegationPart: string | null = null;

    switch (partType) {
      case 14:
        delegationPart = "StakeKeyHash";
        break;
      case 15:
        delegationPart = "ScriptHash";
        break;
      default:
        console.error("Invalid stake address type");
        return null;
    }

    return {
      network,
      addressType,
      paymentPart: null,
      delegationPart,
    };
  }

  let paymentPart: string | null = null;
  let delegationPart: string | null = null;

  switch (partType) {
    case 0:
      paymentPart = "PaymentKeyHash";
      delegationPart = "StakeKeyHash";
      break;
    case 1:
      paymentPart = "ScriptHash";
      delegationPart = "StakeKeyHash";
      break;
    case 2:
      paymentPart = "PaymentKeyHash";
      delegationPart = "ScriptHash";
      break;
    case 3:
      paymentPart = "ScriptHash";
      delegationPart = "ScriptHash";
      break;
    case 4:
      paymentPart = "PaymentKeyHash";
      delegationPart = "Pointer";
      break;
    case 5:
      paymentPart = "ScriptHash";
      delegationPart = "Pointer";
      break;
    case 6:
      paymentPart = "PaymentKeyHash";
      break;
    case 7:
      paymentPart = "ScriptHash";
      break;
    default:
      paymentPart = null;
      break;
  }

  return {
    network,
    addressType,
    paymentPart,
    delegationPart,
  };
};
