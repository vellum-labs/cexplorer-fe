import type { FileRoutesByPath } from "@tanstack/react-router";
import type dynamicIconImports from "lucide-react/dynamicIconImports";

export type NavigationOptionType =
  | "blockchain"
  | "staking"
  | "governance"
  | "tokens"
  | "nfts"
  | "analyticsOptions"
  | "education"
  | "settingsOptions";

export type NestedNavigationOptionType = "moreOptions" | "analyticsOptions";

export type MobileMenuScreen =
  | "settings"
  | "analytics"
  | "governance"
  | "staking"
  | "more"
  | null;

export type NavigationOptions = {
  label: React.ReactNode;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  params?: Record<string, string>;
  onClick?: any;
  nestedOptions?: NavigationOptions;
  divider?: boolean;
}[];

export type NestedNavigation = {
  [key: string]: {
    label: string;
    labelHref?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
    options: NavigationOptions;
  };
};

export type MenuItem = {
  label: string;
  icon: keyof typeof dynamicIconImports;
  items: NavigationOptions;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
};
