import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import enNavigation from "@/locales/en/navigation.json";
import enPages from "@/locales/en/pages.json";
import enErrors from "@/locales/en/errors.json";
import enSdk from "@/locales/en/sdk.json";
import enShared from "@/locales/en/shared.json";

import czCommon from "@/locales/cz/common.json";
import czNavigation from "@/locales/cz/navigation.json";
import czPages from "@/locales/cz/pages.json";
import czErrors from "@/locales/cz/errors.json";
import czSdk from "@/locales/cz/sdk.json";
import czShared from "@/locales/cz/shared.json";

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    pages: enPages,
    errors: enErrors,
    sdk: enSdk,
    shared: enShared,
  },
  cz: {
    common: czCommon,
    navigation: czNavigation,
    pages: czPages,
    errors: czErrors,
    sdk: czSdk,
    shared: czShared,
  },
};

const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("locale-store");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state?.locale) {
          return parsed.state.locale;
        }
      }
    } catch {}
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "navigation", "pages", "errors", "sdk", "shared"],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
