import type { ReactNode } from "@tanstack/react-router";

export interface ResponseCore<T> {
  code: number;
  data: T;
  tokens: number;
  ex: number;
  debug: boolean;
}

export type SupportedCurrencies =
  | "zar"
  | "xdr"
  | "usd"
  | "try"
  | "thb"
  | "sgd"
  | "sek"
  | "ron"
  | "pln"
  | "php"
  | "nzd"
  | "nok"
  | "myr"
  | "mxn"
  | "krw"
  | "jpy"
  | "isk"
  | "inr"
  | "ils"
  | "idr"
  | "huf"
  | "hkd"
  | "gbp"
  | "eur"
  | "dkk"
  | "czk"
  | "cny"
  | "chf"
  | "cad"
  | "brl"
  | "bgn"
  | "aud";

export type TabItem = {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  extraTitle?: ReactNode;
  visible: boolean;
  title?: string;
};

export type AddressLabel = {
  ident: string;
  label: string;
};
