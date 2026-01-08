import EnFlag from "../resources/images/flags/en.png";
import CsFlag from "../resources/images/flags/cz.png";

export const locales = {
  en: {
    value: "en",
    label: "English",
    image: EnFlag,
  },
  cz: {
    value: "cz",
    label: "Čeština",
    image: CsFlag,
  },
} as const;
