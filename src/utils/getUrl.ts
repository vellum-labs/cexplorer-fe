import { apiUrl } from "@/constants/confVariables";
import type { StringifiableRecord } from "query-string";
import queryString from "query-string";

export const getUrl = (path: string, params?: StringifiableRecord) =>
  queryString.stringifyUrl({
    url: `${apiUrl}${path}`,
    query: params,
  });
