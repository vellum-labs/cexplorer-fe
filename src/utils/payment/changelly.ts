import { CHANGELLY_BASE_URL, CHANGELLY_MERCHANT_ID } from "@/constants/payment";

interface ChangellyParams {
  address: string;
  amount?: string;
  adaPrice?: number;
}

export const buildChangellyUrl = ({ address, amount, adaPrice }: ChangellyParams): string => {
  const params = new URLSearchParams({
    from: "usd",
    to: "ada",
    address,
    fromDefault: "usd",
    toDefault: "ada",
    merchant_id: CHANGELLY_MERCHANT_ID,
    v: "3",
    type: "no-rev-share",
    readOnlyDestinationAddress: "true",
  });
  if (amount && adaPrice) {
    const usdAmount = (Number(amount) * adaPrice).toFixed(2);
    params.set("amount", usdAmount);
  } else if (amount) {
    params.set("amount", amount);
  }
  return `${CHANGELLY_BASE_URL}?${params.toString()}`;
};

export const openChangelly = (params: ChangellyParams): void => {
  const url = buildChangellyUrl(params);
  window.open(url, "_blank");
};
