import bs58 from "bs58";

export class Address {
  private static CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

  private isByron: boolean;

  readonly raw: number[];
  readonly payment: string;
  readonly stake: string;
  readonly header: number;
  readonly network: number;

  public static from(address: string): Address {
    return new Address(address);
  }

  public constructor(address: string) {
    try {
      const bechBytes = Address.bech32DecodeToBytes(address);
      this.isByron = false;
      this.raw = bechBytes;
      this.header = this.raw[0] >> 4;
      this.network = this.raw[0] & 0x0f;
      this.payment = Address.toHexString(this.raw.slice(1, 29));
      this.stake = Address.toHexString(this.raw.slice(29));
    } catch (e) {
      this.isByron = true;

      let rawBytes: Uint8Array;
      try {
        rawBytes = bs58.decode(address);
      } catch {
        throw new Error("Unable to decode as Bech32 or Base58");
      }
      this.raw = Array.from(rawBytes);

      this.header = -1;
      this.network = -1;
      this.payment = address;
      this.stake = "";
    }
  }

  public get rewardAddress(): string {
    if (this.isByron) {
      return "";
    }
    const prefix = this.network === 1 ? "stake" : "stake_test";

    const headerHex = (14 + ((this.header & 2) >> 1)).toString(16);
    const dataHex = headerHex + this.network.toString(16) + this.stake;
    return Address.encodeBech32(dataHex, prefix);
  }

  static toHexString(byteArray: number[]): string {
    return Array.from(byteArray, (byte: number) => {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  }

  static fromHexString(value: string): number[] {
    const result: number[] = [];
    let prev: string | null = null;
    for (const a of value) {
      if (prev === null) {
        prev = a;
      } else {
        result.push(parseInt("0x" + prev + a));
        prev = null;
      }
    }
    return result;
  }

  static convertBits(
    data: number[],
    fromBits: number,
    toBits: number,
    pad: boolean = true,
  ): number[] {
    let acc = 0;
    let bits = 0;
    const ret: number[] = [];
    const maxv = (1 << toBits) - 1;
    const maxAcc = (1 << (fromBits + toBits - 1)) - 1;
    for (const value of data) {
      if (value < 0 || value >> fromBits) {
        throw new Error("Unable decode hex part");
      }
      acc = ((acc << fromBits) | value) & maxAcc;
      bits += fromBits;
      while (bits >= toBits) {
        bits -= toBits;
        ret.push((acc >> bits) & maxv);
      }
    }
    if (pad) {
      if (bits) {
        ret.push((acc << (toBits - bits)) & maxv);
      }
    } else if (bits >= fromBits || (acc << (toBits - bits)) & maxv) {
      throw new Error("Unable decode hex part");
    }
    return ret;
  }

  static bech32DecodeToBytes(bech: string): number[] {
    if (
      bech.split("").some(x => x.charCodeAt(0) < 33 || x.charCodeAt(0) > 126) ||
      (bech.toLowerCase() !== bech && bech.toUpperCase() !== bech)
    ) {
      throw new Error("Unable decode hex part");
    }
    bech = bech.toLowerCase();
    const pos = bech.lastIndexOf("1");
    if (pos < 1 || pos + 7 > bech.length || bech.length > 108) {
      throw new Error("Wrong length");
    }
    if (
      !bech
        .slice(pos + 1)
        .split("")
        .every(x => this.CHARSET.includes(x))
    ) {
      throw new Error("Wrong format");
    }
    const data = bech
      .slice(pos + 1)
      .split("")
      .map(x => this.CHARSET.indexOf(x));
    const dataNoChecksum = data.slice(0, -6);
    return this.convertBits(dataNoChecksum, 5, 8, false);
  }

  static encode(prefix: string, words: number[], LIMIT = 90): string {
    const ENCODING_CONST = 1;
    if (prefix.length + 7 + words.length > LIMIT)
      throw new TypeError("Exceeds length limit");
    prefix = prefix.toLowerCase();
    let chk = this.prefixChk(prefix);
    if (typeof chk === "string") throw new Error(chk);
    let result = prefix + "1";
    for (let i = 0; i < words.length; ++i) {
      const x = words[i];
      if (x >> 5 !== 0) throw new Error("Non 5-bit word");
      chk = this.polymodStep(chk) ^ x;
      result += this.CHARSET.charAt(x);
    }
    for (let i = 0; i < 6; ++i) {
      chk = this.polymodStep(chk);
    }
    chk ^= ENCODING_CONST;
    for (let i = 0; i < 6; ++i) {
      const v = (chk >> ((5 - i) * 5)) & 0x1f;
      result += this.CHARSET.charAt(v);
    }
    return result;
  }

  static encodeBech32(dataHex: string, prefix: string): string {
    const words = this.convertBits(this.fromHexString(dataHex), 8, 5);
    return this.encode(prefix, words, 128);
  }

  static prefixChk(prefix: string) {
    let chk = 1;
    for (let i = 0; i < prefix.length; ++i) {
      const c = prefix.charCodeAt(i);
      if (c < 33 || c > 126) return "Invalid prefix (" + prefix + ")";
      chk = this.polymodStep(chk) ^ (c >> 5);
    }
    chk = this.polymodStep(chk);
    for (let i = 0; i < prefix.length; ++i) {
      const v = prefix.charCodeAt(i);
      chk = this.polymodStep(chk) ^ (v & 0x1f);
    }
    return chk;
  }

  static polymodStep(pre: number): number {
    const b = pre >> 25;
    return (
      ((pre & 0x1ffffff) << 5) ^
      (-((b >> 0) & 1) & 0x3b6a57b2) ^
      (-((b >> 1) & 1) & 0x26508e6d) ^
      (-((b >> 2) & 1) & 0x1ea119fa) ^
      (-((b >> 3) & 1) & 0x3d4233dd) ^
      (-((b >> 4) & 1) & 0x2a1462b3)
    );
  }
}

export function isValidAddressFormat(address: string | undefined): boolean {
  if (!address) return false;
  try {
    Address.from(address);
    return true;
  } catch {
    return false;
  }
}
