import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import enNavigation from "@/locales/en/navigation.json";
import enPages from "@/locales/en/pages.json";
import enErrors from "@/locales/en/errors.json";
import enSdk from "@/locales/en/sdk.json";
import enShared from "@/locales/en/shared.json";
import enCanvas from "@/locales/en/canvas.json";

import csCommon from "@/locales/cs/common.json";
import csNavigation from "@/locales/cs/navigation.json";
import csPages from "@/locales/cs/pages.json";
import csErrors from "@/locales/cs/errors.json";
import csSdk from "@/locales/cs/sdk.json";
import csShared from "@/locales/cs/shared.json";
import csCanvas from "@/locales/cs/canvas.json";

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    pages: enPages,
    errors: enErrors,
    sdk: enSdk,
    shared: enShared,
    canvas: enCanvas,
  },
  cs: {
    common: csCommon,
    navigation: csNavigation,
    pages: csPages,
    errors: csErrors,
    sdk: csSdk,
    shared: csShared,
    canvas: csCanvas,
  },
};

const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("locale-store");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.locale) {
        return parsed.state.locale;
      }
    }
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  parseMissingKeyHandler: key => `MISSING: [${key}]`,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "navigation", "pages", "errors", "sdk", "shared", "canvas"],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
