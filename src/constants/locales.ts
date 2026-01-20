import EnFlag from "../resources/images/flags/en.png";
import CsFlag from "../resources/images/flags/cs.png";

export const locales = {
  en: {
    value: "en",
    displayValue: "EN",
    label: "English",
    image: EnFlag,
  },
  cs: {
    value: "cs",
    displayValue: "CZ",
    label: "Čeština",
    image: CsFlag,
  },
} as const;
