import type { FooterLinks } from "@/types/footerTypes";

type Header = "company" | "resources" | "supportUs";

export const footerLinks: { [T in Header]: FooterLinks } = {
  company: [
    {
      label: "About us",
      href: "/about-us",
      target: "_self",
    },
    {
      label: "Brand assets",
      href: "/brand-assets",
      target: "_self",
    },
    {
      label: "Contact us",
      href: "/contact-us",
      target: "_self",
    },
    {
      label: "Documentation",
      href: "https://github.com/vellum-labs/cexplorer-fe",
      target: "_blank",
    },
    {
      label: "Privacy policy",
      href: "/privacy",
      target: "_self",
    },
        {
      label: "Terms & conditions",
      href: "/terms",
      target: "_self",
    },
  ],
  resources: [
    {
      label: "Advertising",
      href: "/ads",
      target: "_self",
    },
    {
      label: "API",
      href: "/api",
      target: "_self",
    },
    {
      label: "Bots",
      href: "/bots",
      target: "_self",
    },
    {
      label: "Developers",
      href: "/developers",
      target: "_self",
    },
    {
      label: "FAQ",
      href: "/faq",
      target: "_self",
    },
    {
      label: "Status",
      href: "/status",
      target: "_self",
    },
  ],
  supportUs: [
    {
      label: "Donate",
      href: "/donate",
      target: "_self",
    },
    {
      label: "Delegate to [POOLS]",
      href: "/donate",
      target: "_self",
    },
    {
      label: "Patreon",
      href: "https://www.patreon.com/ADApools",
      target: "_blank",
    },
    {
      label: "Buy me a coffee", 
      href: "https://buymeacoffee.com/vellumlabs",
      target: "_blank",
    },
    {
      label: "Report a bug",
      href: "https://github.com/vellum-labs/cexplorer-fe/issues",
      target: "_blank",
    },
    {
      label: "Suggest a feature",
      href: "https://github.com/vellum-labs/cexplorer-fe/issues",
      target: "_blank",
    },
    {
      label: "Bug bounty",
      href: "/bounty",
      target: "_self",
    },
  ],
} as const;
