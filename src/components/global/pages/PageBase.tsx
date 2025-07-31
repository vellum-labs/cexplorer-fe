import type { FC, ReactNode } from "react";
import type { HeaderBannerBreadCrumbItem } from "../HeaderBanner";

import { Helmet } from "react-helmet";
import { HeaderBanner } from "../HeaderBanner";
import AdsCarousel from "../ads/AdsCarousel";

import metadata from "../../../../conf/metadata/en-metadata.json";
import { webUrl } from "@/constants/confVariables";

interface PageBaseInitProps {
  children: ReactNode;
  metadataReplace?: {
    before: string;
    after: string;
  };
  title: ReactNode;
  breadcrumbItems?: HeaderBannerBreadCrumbItem[];
  breadcrumbSeparator?: ReactNode;
  adsCarousel?: boolean;
  subTitle?: ReactNode;
  badge?: ReactNode;
  qrCode?: ReactNode;
  showHeader?: boolean;
  showMetadata?: boolean;
  isHomepage?: boolean;
}

interface PageWithSimpleMetadata extends PageBaseInitProps {
  metadataTitle: string;
  metadataOverride?: never;
}

interface PageWithCustomMetadata extends PageBaseInitProps {
  metadataTitle?: never;
  metadataOverride: {
    title: string;
    keyword: string;
    description: string;
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
}) => {
  const metadataTitleInit = metadataOverride
    ? metadataOverride?.title
    : metadataReplace
      ? metadata[metadataTitle]?.title.replace(
          metadataReplace?.before,
          metadataReplace?.after || "",
        )
      : metadata[metadataTitle]?.title;

  const metadataDescription = metadataOverride
    ? metadataOverride?.description
    : metadataReplace
      ? metadata[metadataTitle]?.description.replace(
          metadataReplace?.before,
          metadataReplace?.after || "",
        )
      : metadata[metadataTitle]?.description;

  const metadataKeyword = metadataOverride
    ? metadataOverride?.keyword
    : metadataReplace
      ? metadata[metadataTitle]?.keywords.replace(
          metadataReplace?.before,
          metadataReplace?.after || "",
        )
      : metadata[metadataTitle]?.keywords;

  return (
    <main className='flex min-h-minHeight w-full flex-col items-center'>
      {showMetadata && (
        <Helmet>
          <meta charSet='utf-8' />
          <title>{metadataTitleInit}</title>
          <meta name='description' content={metadataDescription} />
          <meta name='keywords' content={metadataKeyword} />
          <meta property='og:title' content={metadataTitleInit} />
          <meta property='og:description' content={metadataDescription} />
          <meta property='og:type' content='website' />
          <meta property='og:url' content={webUrl + location.pathname} />
        </Helmet>
      )}
      {showHeader && (
        <HeaderBanner
          title={title}
          breadcrumbItems={breadcrumbItems}
          subTitle={subTitle}
          badge={badge}
          qrCode={qrCode}
          breadcrumbSeparator={breadcrumbSeparator}
          isHomepage={isHomepage}
        />
      )}
      {adsCarousel && <AdsCarousel />}
      {children}
    </main>
  );
};
