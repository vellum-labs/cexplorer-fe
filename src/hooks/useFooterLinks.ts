import type { FooterLinks } from "@/types/footerTypes";
import { useMemo } from "react";
import { useAppTranslation } from "./useAppTranslation";

type FooterSection = "company" | "resources" | "supportUs";

export const useFooterLinks = () => {
  const { t } = useAppTranslation("navigation");

  const footerLinks = useMemo(
    (): { [T in FooterSection]: FooterLinks } => ({
      company: [
        {
          label: t("footer.aboutUs"),
          href: "/about-us",
          target: "_self",
        },
        {
          label: t("footer.brandAssets"),
          href: "/brand-assets",
          target: "_self",
        },
        {
          label: t("footer.contactUs"),
          href: "/contact-us",
          target: "_self",
        },
        {
          label: t("footer.documentation"),
          href: "https://github.com/vellum-labs/cexplorer-fe",
          target: "_blank",
        },
        {
          label: t("footer.privacyPolicy"),
          href: "/privacy",
          target: "_self",
        },
        {
          label: t("footer.termsConditions"),
          href: "/terms",
          target: "_self",
        },
      ],
      resources: [
        {
          label: t("footer.advertising"),
          href: "/ads",
          target: "_self",
        },
        {
          label: t("footer.api"),
          href: "/api",
          target: "_self",
        },
        {
          label: t("footer.bots"),
          href: "/bots",
          target: "_self",
        },
        {
          label: t("footer.developers"),
          href: "/dev",
          target: "_self",
        },
        {
          label: t("footer.faq"),
          href: "/faq",
          target: "_self",
        },
        {
          label: t("footer.status"),
          href: "/status",
          target: "_self",
        },
      ],
      supportUs: [
        {
          label: t("footer.donate"),
          href: "/donate",
          target: "_self",
        },
        {
          label: t("footer.delegateToPools"),
          href: "/donate",
          target: "_self",
        },
        {
          label: t("footer.patreon"),
          href: "https://www.patreon.com/ADApools",
          target: "_blank",
        },
        {
          label: t("footer.buyMeACoffee"),
          href: "https://buymeacoffee.com/vellumlabs",
          target: "_blank",
        },
        {
          label: t("footer.reportABug"),
          href: "https://github.com/vellum-labs/cexplorer-fe/issues",
          target: "_blank",
        },
        {
          label: t("footer.suggestAFeature"),
          href: "https://github.com/vellum-labs/cexplorer-fe/issues",
          target: "_blank",
        },
        {
          label: t("footer.bugBounty"),
          href: "/bounty",
          target: "_self",
        },
      ],
    }),
    [t]
  );

  const headers = useMemo(
    () => ({
      company: t("footer.company"),
      information: t("footer.information"),
      supportUs: t("footer.supportUs"),
    }),
    [t]
  );

  return { footerLinks, headers };
};

export default useFooterLinks;
