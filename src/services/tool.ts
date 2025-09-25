import { handleFetch } from "@/lib/handleFetch";

export const sendDelegationInfo = (hash: string, poolId: string) => {
  const url = `/tool/tx_sent?id=${hash}&type=delegation&campaign=${poolId}`;

  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return handleFetch(url, undefined, options, true);
};
