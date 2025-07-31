export const encodeAssetName = (hex: string | number): string => {
  let str = "";
  const strHex =
    hex.toString().length > 56 ? hex.toString().slice(56) : hex.toString();
  for (let i = 0; i < strHex.length; i += 2) {
    const hexCode = strHex.substr(i, 2);
    const charCode = parseInt(hexCode, 16);
    str += String.fromCharCode(charCode);
  }
  return str;
};
