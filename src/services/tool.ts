import { handleFetch } from "@/lib/handleFetch";

export const sendDelegationInfo = (
  hash: string,
  poolId: string,
  type: "delegation" | "donate" = "delegation",
  donation: number | string = 0,
) => {
  const url = `/tool/tx_sent?id=${hash}&type=${type}&campaign=${poolId}&donation=${donation}`;

  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return handleFetch(url, undefined, options, true);
};
