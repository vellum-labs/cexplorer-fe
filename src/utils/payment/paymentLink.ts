export interface PaymentData {
  address: string;
  amount?: string;
  message?: string;
  handle?: string;
  donation?: number;
}

export const encodePaymentData = (data: PaymentData): string => {
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
};

export const decodePaymentData = (encoded: string): PaymentData | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const buildPaymentUrl = (data: PaymentData): string => {
  const encoded = encodePaymentData(data);
  return `${window.location.origin}/pay?data=${encoded}`;
};

export const buildCardanoUri = (data: PaymentData): string => {
  let uri = `web+cardano:${data.address}`;
  const params: string[] = [];
  if (data.amount) {
    params.push(`amount=${data.amount}`);
  }
  if (data.message) {
    params.push(`message=${encodeURIComponent(data.message)}`);
  }
  if (params.length > 0) {
    uri += `?${params.join("&")}`;
  }
  return uri;
};
