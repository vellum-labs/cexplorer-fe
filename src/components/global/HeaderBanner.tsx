import type { ReactNode } from "react";

import type { HeaderProps } from "@vellumlabs/cexplorer-sdk";
import { BreadcrumbSeparator, Header } from "@vellumlabs/cexplorer-sdk";

import { useLocaleStore } from "@/stores/localeStore";
import { useFetchMiscBasic, useFetchMiscSearch } from "@/services/misc";

interface HeaderBannerProps {
  breadcrumbItems?: HeaderProps["breadcrumbItems"];
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
  const miscBasic = useFetchMiscBasic(true);

  return (
    <Header
      locale={locale}
      miscBasic={miscBasic}
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
