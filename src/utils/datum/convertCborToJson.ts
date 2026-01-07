export const convertCborToJson = (value: any): any => {
  switch (true) {
    case typeof value === "number" || typeof value === "bigint":
      return { int: String(value) };

    case typeof value === "string":
      return { bytes: Buffer.from(value).toString("hex") };

    case value instanceof Uint8Array || Buffer.isBuffer(value):
      return { bytes: Buffer.from(value).toString("hex") };

    case Array.isArray(value):
      return { list: value.map(convertCborToJson) };

    case value instanceof Map:
      return {
        map: Array.from(value.entries()).map(([k, v]) => ({
          k: convertCborToJson(k),
          v: convertCborToJson(v),
        })),
      };

    case typeof value === "object" && value !== null:
      if ("tag" in value && "data" in value) {
        return {
          constructor: String(value.tag - 121),
          fields: Array.isArray(value.data)
            ? value.data.map(convertCborToJson)
            : [convertCborToJson(value.data)],
        };
      }
      return value;

    default:
      return { int: String(value) };
  }
};
