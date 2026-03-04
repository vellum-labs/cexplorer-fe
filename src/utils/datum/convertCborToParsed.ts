const hexToUtf8 = (hex: string): string => {
  try {
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)),
    );
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    // Check for non-printable characters (allow common whitespace)
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) {
      return hex;
    }
    return text;
  } catch {
    return hex;
  }
};

export const convertCborToParsed = (value: any): any => {
  if (value === null || value === undefined) return value;

  if (typeof value !== "object") return value;

  if ("bytes" in value && typeof value.bytes === "string") {
    return hexToUtf8(value.bytes);
  }

  if ("int" in value) {
    return String(value.int);
  }

  if ("list" in value && Array.isArray(value.list)) {
    return value.list.map(convertCborToParsed);
  }

  if ("map" in value && Array.isArray(value.map)) {
    const result: Record<string, any> = {};
    value.map.forEach((entry: { k: any; v: any }, i: number) => {
      result[`map_${i}`] = {
        mapKey: convertCborToParsed(entry.k),
        mapValue: convertCborToParsed(entry.v),
      };
    });
    return result;
  }

  if ("constructor" in value && "fields" in value) {
    return {
      constructor: Number(value.constructor),
      fields: Array.isArray(value.fields)
        ? value.fields.map(convertCborToParsed)
        : convertCborToParsed(value.fields),
    };
  }

  if (Array.isArray(value)) {
    return value.map(convertCborToParsed);
  }

  // Generic object — recurse over keys
  const result: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    result[key] = convertCborToParsed(value[key]);
  }
  return result;
};
