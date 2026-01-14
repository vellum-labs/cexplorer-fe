import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import type { Locales } from "@/types/storeTypes";

type Namespace =
  | "common"
  | "navigation"
  | "pages"
  | "errors"
  | "sdk"
  | "shared";

export const useAppTranslation = (
  namespace: Namespace | Namespace[] = "common",
) => {
  const { t } = useTranslation(namespace);
  const { locale, setLocale } = useLocaleStore();

  // Sync i18n language with locale store
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  const changeLanguage = (lang: Locales) => {
    setLocale(lang);
    i18n.changeLanguage(lang);
  };

  return {
    t,
    locale,
    changeLanguage,
    i18n,
  };
};

export default useAppTranslation;
