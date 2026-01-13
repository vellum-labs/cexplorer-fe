import type { ReactNode } from "react";

import type { HeaderProps } from "@vellumlabs/cexplorer-sdk";
import { BreadcrumbSeparator, Header } from "@vellumlabs/cexplorer-sdk";

import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic, useFetchMiscSearch } from "@/services/misc";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export interface HeaderBannerProps {
  breadcrumbItems?: HeaderProps["breadcrumbItems"];
  breadcrumbSeparator?: ReactNode;
  title: ReactNode;
  subTitle?: ReactNode;
  badge?: ReactNode;
  qrCode?: ReactNode;
  icon?: ReactNode;
  isHomepage?: boolean;
  homepageAd?: ReactNode;
  customPage?: boolean;
  withoutSearch?: boolean;
}

export const HeaderBanner = ({
  breadcrumbItems,
  breadcrumbSeparator = <BreadcrumbSeparator />,
  title,
  subTitle,
  badge,
  qrCode,
  icon,
  isHomepage,
  homepageAd,
  customPage,
  withoutSearch,
}: HeaderBannerProps) => {
  const { t } = useAppTranslation("common");
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
      homepageAd={homepageAd}
      customPage={customPage}
      icon={icon}
      withoutSearch={withoutSearch}
      featuredLabel={t("sdk:header.featuredLabel")}
      adLabel={t("sdk:header.adLabel")}
      globalSearchLabels={{
        recentLabels: {
          recentlySearchedLabel: t("sdk:globalSearch.recentlySearched"),
          noRecentSearchesLabel: t("sdk:globalSearch.noRecentSearches"),
        },
        categoryLabels: {
          all: t("sdk:globalSearch.categories.all"),
          tx: t("sdk:globalSearch.categories.tx"),
          block: t("sdk:globalSearch.categories.block"),
          pool: t("sdk:globalSearch.categories.pool"),
          asset: t("sdk:globalSearch.categories.asset"),
          policy: t("sdk:globalSearch.categories.policy"),
          address: t("sdk:globalSearch.categories.address"),
          stake: t("sdk:globalSearch.categories.stake"),
          adahandle: t("sdk:globalSearch.categories.adahandle"),
          user: t("sdk:globalSearch.categories.user"),
          article: t("sdk:globalSearch.categories.article"),
          page: t("sdk:globalSearch.categories.page"),
          gov: t("sdk:globalSearch.categories.gov"),
          drep: t("sdk:globalSearch.categories.drep"),
        },
        homepagePlaceholder: t("sdk:globalSearch.homepagePlaceholder"),
        placeholder: t("sdk:globalSearch.placeholder"),
        notFoundLabel: t("sdk:globalSearch.notFoundLabel"),
      }}
    />
  );
};
