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

export const sendPaymentInfo = async (
  hash: string,
  toAddress: string,
  amount: number | string = 0,
  donation: number | string = 0,
) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const amountLovelace = Number(amount) * 1_000_000;
  const donationLovelace = Number(donation) * 1_000_000;

  const paymentUrl = `/tool/tx_sent?id=${hash}&type=payment&campaign=${toAddress}&donation=${amountLovelace}`;
  await handleFetch(paymentUrl, undefined, options, true);

  if (donationLovelace > 0) {
    const donationUrl = `/tool/tx_sent?id=${hash}&type=donation&campaign=payment_page&donation=${donationLovelace}`;
    await handleFetch(donationUrl, undefined, options, true);
  }
};
