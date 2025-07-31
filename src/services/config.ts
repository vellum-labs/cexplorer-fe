import type { ConfigSwTextResponse } from "@/types/configTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useQuery } from "@tanstack/react-query";

export const fetchSwText = (
  token: string,
  type: "list" | "update",
  body?: any,
) => {
  const url = "/admin/sw_text";
  const options = {
    method: type === "update" ? "POST" : "GET",
    params: {
      type,
    },
    headers: {
      usertoken: token,
    },
    body: body ? body : undefined,
  };

  return handleFetch<ConfigSwTextResponse>(url, undefined, options);
};

export const useFetchSwText = (token: string) =>
  useQuery({
    queryKey: ["config-sw-text", token],
    queryFn: () => fetchSwText(token, "list"),
  });
