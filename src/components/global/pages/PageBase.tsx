import type { FC, ReactNode } from "react";

import { Helmet } from "react-helmet";
import { HeaderBanner } from "../HeaderBanner";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";

import metadata from "../../../../conf/metadata/en-metadata.json";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useFetchMiscBasic } from "@/services/misc";
import { HomepageAds } from "@/components/homepage/HomepageAds";

interface PageBaseInitProps {
  children: ReactNode;
  metadataReplace?: {
    before: string;
    after: string;
  };
  title: ReactNode;
  breadcrumbItems?: {
    [key: string]: ReactNode | object;
  }[];
  breadcrumbSeparator?: ReactNode;
  adsCarousel?: boolean;
  subTitle?: ReactNode;
  badge?: ReactNode;
  qrCode?: ReactNode;
  showHeader?: boolean;
  showMetadata?: boolean;
  isHomepage?: boolean;
  homepageAd?: ReactNode;
  customPage?: boolean;
  withoutSearch?: boolean;
}

interface PageWithSimpleMetadata extends PageBaseInitProps {
  metadataTitle: string;
  metadataOverride?: never;
}

interface PageWithCustomMetadata extends PageBaseInitProps {
  metadataTitle?: never;
  metadataOverride: {
    title: string;
  };
}

type PageBaseProps = PageWithSimpleMetadata | PageWithCustomMetadata;

export const PageBase: FC<PageBaseProps> = ({
  children,
  metadataTitle,
  title,
  breadcrumbItems,
  metadataReplace,
  adsCarousel = true,
  badge,
  qrCode,
  subTitle,
  breadcrumbSeparator,
  metadataOverride,
  showHeader = true,
  showMetadata = true,
  isHomepage,
  homepageAd,
  customPage,
  withoutSearch = false,
}) => {
  const miscBasicQuery = useFetchMiscBasic();

  const miscBasicAds =
    !miscBasicQuery.isLoading &&
    miscBasicQuery?.data &&
    miscBasicQuery?.data?.data?.ads &&
    Array.isArray(miscBasicQuery?.data?.data?.ads) &&
    miscBasicQuery?.data?.data?.ads.length > 0
      ? miscBasicQuery?.data?.data?.ads
      : false;

  const HOMEPAGE_ADS_TYPE = "header_featured";

  const homepageAds = miscBasicAds
    ? miscBasicAds.filter(item => item.type === HOMEPAGE_ADS_TYPE)
    : undefined;

  const metadataTitleInit = metadataOverride
    ? metadataOverride?.title
    : metadataReplace
      ? metadata[metadataTitle]?.title.replace(
          metadataReplace?.before,
          metadataReplace?.after || "",
        )
      : metadata[metadataTitle]?.title;

  return (
    <main className='flex min-h-minHeight w-full flex-col items-center'>
      {showMetadata && (
        <Helmet>
          <title>{metadataTitleInit}</title>
        </Helmet>
      )}
      {showHeader && (
        <HeaderBanner
          title={title}
          breadcrumbItems={breadcrumbItems as any}
          subTitle={subTitle}
          badge={badge}
          qrCode={qrCode}
          breadcrumbSeparator={breadcrumbSeparator}
          isHomepage={isHomepage}
          withoutSearch={withoutSearch}
          homepageAd={
            homepageAd && homepageAds ? (
              <HomepageAds
                miscBasicAds={homepageAds.sort(() => Math.random() - 0.5)}
              />
            ) : undefined
          }
          customPage={customPage}
        />
      )}
      {adsCarousel && (
        <AdsCarousel
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
        />
      )}
      {children}
    </main>
  );
};
