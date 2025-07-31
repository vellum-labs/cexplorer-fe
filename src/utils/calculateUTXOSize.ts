function utxoSize(assetList) {
  const baseSize = 27;
  const assetHeaderSize = 6;
  const assetEntrySize = 12;

  let assetsSize = assetHeaderSize;
  for (const asset of assetList) {
    assetsSize += assetEntrySize;
    assetsSize += Math.ceil(asset.name.length / 2);
  }

  return baseSize + assetsSize;
}

export const calculateMinUtxo = assetList => {
  const coinsPerUtxoByte = 4310;
  const sizeInBytes = utxoSize(assetList);
  return sizeInBytes * coinsPerUtxoByte;
};
