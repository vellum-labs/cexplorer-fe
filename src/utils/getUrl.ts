import { apiUrl } from "@/constants/confVariables";
import type { StringifiableRecord } from "query-string";
import queryString from "query-string";

const sanitizeParams = (params?: StringifiableRecord): StringifiableRecord | undefined => {
  if (!params) return params;

  const sanitized: StringifiableRecord = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "number" && Number.isNaN(value)) {
      sanitized[key] = 0;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const getUrl = (path: string, params?: StringifiableRecord) =>
  queryString.stringifyUrl({
    url: `${apiUrl}${path}`,
    query: sanitizeParams(params),
  });
