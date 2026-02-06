export const isMainnetAddress = (address: string): boolean => {
  if (!address || address.trim() === "") {
    return false;
  }

  const prefix = address.substring(0, address.lastIndexOf("1"));
  const mainnetPrefixes = ["addr", "stake"];

  return mainnetPrefixes.includes(prefix);
};

export const isTestnetAddress = (address: string): boolean => {
  if (!address || address.trim() === "") {
    return false;
  }

  const prefix = address.substring(0, address.lastIndexOf("1"));
  const testnetPrefixes = ["addr_test", "stake_test"];

  return testnetPrefixes.includes(prefix);
};
