import type { FC, ReactNode } from "react";

import { Helmet } from "react-helmet";
import { HeaderBanner } from "../HeaderBanner";
import {
  AdsCarousel,
  AddBookmarkModal,
  EditBookmarkModal,
  RemoveBookmarkModal,
} from "@vellumlabs/cexplorer-sdk";

import metadata from "../../../../conf/metadata/en-metadata.json";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useFetchMiscBasic } from "@/services/misc";
import { HomepageAds } from "@/components/homepage/HomepageAds";
import { useBookmark } from "@/hooks/useBookmark";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  icon?: ReactNode;
  showHeader?: boolean;
  showMetadata?: boolean;
  isHomepage?: boolean;
  homepageAd?: ReactNode;
  customPage?: boolean;
  withoutSearch?: boolean;
  bookmarkButton?: boolean;
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
  icon,
  subTitle,
  breadcrumbSeparator,
  metadataOverride,
  showHeader = true,
  showMetadata = true,
  isHomepage,
  homepageAd,
  customPage,
  withoutSearch = false,
  bookmarkButton = true,
}) => {
  const { t } = useAppTranslation();
  const miscBasicQuery = useFetchMiscBasic();
  const {
    isBookmarked,
    currentBookmark,
    modalType,
    handleBookmarkClick,
    handleAddBookmark,
    handleEditBookmark,
    handleRemoveBookmark,
    closeModal,
  } = useBookmark();

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
          icon={icon}
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
          bookmarkButton={bookmarkButton}
          onBookmarkClick={handleBookmarkClick}
          isBookmarked={isBookmarked}
        />
      )}
      {adsCarousel && (
        <AdsCarousel
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
        />
      )}
      {children}
      {modalType === "add" && (
        <AddBookmarkModal
          onClose={closeModal}
          onSave={handleAddBookmark}
          title={t("bookmark.addModal.title")}
          description={t("bookmark.addModal.description")}
          nameLabel={t("bookmark.addModal.nameLabel")}
          namePlaceholder={t("bookmark.addModal.namePlaceholder")}
          cancelLabel={t("bookmark.addModal.cancelLabel")}
          saveLabel={t("bookmark.addModal.saveLabel")}
        />
      )}
      {modalType === "edit" && currentBookmark && (
        <EditBookmarkModal
          onClose={closeModal}
          onSave={handleEditBookmark}
          currentName={currentBookmark.my_name}
          title={t("bookmark.editModal.title")}
          description={t("bookmark.editModal.description")}
          currentNameLabel={t("bookmark.editModal.currentNameLabel")}
          newNameLabel={t("bookmark.editModal.newNameLabel")}
          newNamePlaceholder={t("bookmark.editModal.newNamePlaceholder")}
          cancelLabel={t("bookmark.editModal.cancelLabel")}
          saveLabel={t("bookmark.editModal.saveLabel")}
        />
      )}
      {modalType === "remove" && currentBookmark && (
        <RemoveBookmarkModal
          onClose={closeModal}
          onRemove={handleRemoveBookmark}
          bookmarkName={currentBookmark.my_name}
          title={t("bookmark.removeModal.title")}
          description={t("bookmark.removeModal.description")}
          nameLabel={t("bookmark.removeModal.nameLabel")}
          cancelLabel={t("bookmark.removeModal.cancelLabel")}
          removeLabel={t("bookmark.removeModal.removeLabel")}
        />
      )}
    </main>
  );
};
