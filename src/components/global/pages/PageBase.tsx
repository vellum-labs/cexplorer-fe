import type { FC, ReactNode } from "react";

import { Helmet } from "react-helmet";
import { HeaderBanner } from "../HeaderBanner";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";

import metadata from "../../../../conf/metadata/en-metadata.json";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useFetchMiscBasic } from "@/services/misc";

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
  const miscBasicQuery = useFetchMiscBasic();

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
