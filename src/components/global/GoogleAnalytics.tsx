import type { FC } from "react";

import { useEffect } from "react";

import { router } from "@/main";
import { configJSON } from "@/constants/conf";

const { services } = configJSON;
const GOOGLE_TAG_ID = services[0].googleTag ?? null;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GoogleAnalytics: FC = () => {
  useEffect(() => {
    if (!GOOGLE_TAG_ID) {
      return;
    }

    const gtagLib = document.createElement("script");
    gtagLib.async = true;
    gtagLib.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
    document.head.append(gtagLib);

    const googleAnalytics = document.createElement("script");

    googleAnalytics.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GOOGLE_TAG_ID}');
      `;

    document.head.append(googleAnalytics);

    const unsub = router.subscribe("onLoad", () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: window.location.pathname + window.location.search,
        });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return null;
};
