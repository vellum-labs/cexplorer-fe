import type { ReactNode } from "react";

import { BreadcrumbSeparator, Header } from "@vellumlabs/cexplorer-sdk";

import type { FileRoutesByPath } from "@tanstack/react-router";
import { useLocaleStore } from "@/stores/localeStore";
import { useFetchMiscBasic, useFetchMiscSearch } from "@/services/misc";

export interface HeaderBannerBreadCrumbItem {
  label: ReactNode;
  link?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  params?: Record<string, string>;
  ident?: string;
}

interface HeaderBannerProps {
  breadcrumbItems?: HeaderBannerBreadCrumbItem[];
  breadcrumbSeparator?: ReactNode;
  title: ReactNode;
  subTitle?: ReactNode;
  badge?: ReactNode;
  qrCode?: ReactNode;
  isHomepage?: boolean;
}

export const HeaderBanner = ({
  breadcrumbItems,
  breadcrumbSeparator = <BreadcrumbSeparator />,
  title,
  subTitle,
  badge,
  qrCode,
  isHomepage,
}: HeaderBannerProps) => {
  const { locale } = useLocaleStore();
  const { data: miscBasic } = useFetchMiscBasic(true);

  return (
    <Header
      locale={locale}
      // Zmenit type
      miscBasic={miscBasic as any}
      title={title}
      useFetchMiscSearch={useFetchMiscSearch}
      badge={badge}
      breadcrumbItems={breadcrumbItems}
      breadcrumbSeparator={breadcrumbSeparator}
      isHomepage={isHomepage}
      qrCode={qrCode}
      subTitle={subTitle}
    />
  );
};
