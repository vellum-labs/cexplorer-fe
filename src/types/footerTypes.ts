import type { FileRoutesByPath } from "@tanstack/react-router";

export type FooterLinks = {
  label: string;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"] | `https://${string}`;
  target?: "_self" | "_blank";
}[];
