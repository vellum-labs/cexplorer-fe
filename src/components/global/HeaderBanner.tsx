import type { ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { Fragment } from "react";

import { GlobalSearchProvider } from "@/context/GlobalSearchContext";
import { cn } from "@/lib/utils";
import { useFetchMiscBasic } from "@/services/misc";
import type { MiscBasicResponse } from "@/types/miscTypes";
import { GlobalSearch } from "../search/GlobalSearch";
import AdDropdown from "./dropdowns/AdDropdown";
import LoadingSkeleton from "./skeletons/LoadingSkeleton";

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
  const miscBasicQuery = useFetchMiscBasic();
  const headingAd = miscBasicQuery.data?.data.ads.find(
    ad => ad.type === "heading_featured",
  );
  const boxAds = miscBasicQuery.data?.data.ads.filter(ad => ad.type === "box");

  const sortedAds: Record<
    MiscBasicResponse["data"]["ads"][number]["data"]["section"],
    MiscBasicResponse["data"]["ads"][number]["data"][]
  > = boxAds
    ? boxAds.reduce((acc, ad) => {
        if (!acc[ad.data.section]) {
          acc[ad.data.section] = [];
        }
        acc[ad.data.section].push(ad.data);
        return acc;
      }, {})
    : {};

  return (
    <header className='mb-3 flex min-h-[110px] w-full justify-center bg-gradient-to-b from-bannerGradient to-darker'>
      <div className='flex w-full max-w-desktop flex-wrap justify-between gap-3 p-mobile md:px-desktop md:py-mobile'>
        <div className='flex flex-col py-1/2'>
          {breadcrumbItems && (
            <Breadcrumb className='w-full'>
              <BreadcrumbList className='flex items-center'>
                <BreadcrumbItem>
                  <Link className='underline underline-offset-2' to='/'>
                    Home
                  </Link>
                </BreadcrumbItem>
                {breadcrumbSeparator}
                {(breadcrumbItems || []).map(
                  ({ label, link, ident, params }, i) => (
                    <Fragment key={`${label}_${i}`}>
                      <BreadcrumbItem>
                        {link ? (
                          <Link
                            title={ident}
                            className='underline underline-offset-2'
                            to={link}
                            params={params}
                          >
                            {label}
                          </Link>
                        ) : (
                          <BreadcrumbPage title={ident}>{label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {i < breadcrumbItems.length - 1 && breadcrumbSeparator}
                    </Fragment>
                  ),
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className='flex items-center gap-1 pt-1/2 font-poppins'>
            <h1 className={cn(!subTitle && !isHomepage && "pb-4")}>{title}</h1>
            {badge && badge}
          </div>
          <div className='flex items-center gap-1'>
            {subTitle && subTitle}
            {qrCode && qrCode}
          </div>

          {headingAd && miscBasicQuery.isLoading ? (
            <LoadingSkeleton height='14px' />
          ) : (
            <>
              {headingAd && (
                <div className='flex'>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: headingAd?.data.text || "",
                    }}
                    className='text-sm text-grayTextPrimary [&>a]:text-primary'
                  ></p>
                  <Link
                    to='/ads'
                    className='ml-1/2 flex -translate-y-1 items-center justify-center rounded-full border border-border bg-background px-[6px] text-[10px] font-medium'
                  >
                    Ad
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        <div className={isHomepage ? 'flex w-full justify-center mt-1.5 mb-3' : 'flex w-full shrink basis-[500px] flex-col justify-center gap-1.5'}>
          <GlobalSearchProvider>
            <GlobalSearch isHomepage={isHomepage} />
          </GlobalSearchProvider>
          {!isHomepage && (
            <>
              {miscBasicQuery.isLoading ? (
                <div className='flex flex-wrap gap-1'>
                  <LoadingSkeleton width='130px' height='40px' rounded='lg' />
                  <LoadingSkeleton width='130px' height='40px' rounded='lg' />
                </div>
              ) : (
                <div className='flex flex-wrap gap-1'>
                  {Object.entries(sortedAds)?.map(ad => (
                    <AdDropdown
                      key={ad[0]}
                      icon={ad[1][0].icon}
                      label={ad[0]}
                      options={ad[1].map(({ title, content, link }) => ({
                        label: (
                          <a
                            href={link}
                            target='_blank'
                            className='flex flex-col gap-1'
                          >
                            <p>{title}</p>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: content,
                              }}
                            ></p>
                          </a>
                        ),
                        // onClick: () => {},
                      }))}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
