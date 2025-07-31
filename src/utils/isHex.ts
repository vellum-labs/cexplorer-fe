export const isHex = (value: string): boolean =>
  /^(0x|#)?[0-9A-Fa-f]+$/.test(value);
