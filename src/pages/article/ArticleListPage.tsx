import { ArticleCard } from "@/components/article/ArticleCard";
import AdsCarousel from "@/components/global/ads/AdsCarousel";
import { HeaderBanner } from "@/components/global/HeaderBanner";
import { Image } from "@/components/global/Image";
import { NoResultsFound } from "@/components/global/NoResultsFound";
import { Pagination } from "@/components/global/Pagination";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import SortBy from "@/components/ui/sortBy";
import { articleCategories } from "@/constants/article";
import { useFetchArticleList } from "@/services/article";
import type { ArticleCategories } from "@/types/articleTypes";
import { formatDate } from "@/utils/format/format";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { Link, useSearch } from "@tanstack/react-router";
import parse from "html-react-parser";
import type { SetStateAction } from "react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { webUrl } from "@/constants/confVariables";

export const ArticleListPage = () => {
  const { page } = useSearch({ from: "/article/" });
  const currentPage = page ?? 1;
  const [category, setCategory] = useState<
    ArticleCategories | "all" | undefined
  >(undefined);
  const query = useFetchArticleList(
    "en",
    (page ?? 1) * 20 - 20,
    20,
    category !== "all" ? category : undefined,
  );
  const items = query.data?.pages.flatMap(page => page.data.data) ?? [];
  const firstArticle = items && items.length > 0 ? items[0] : undefined;
  const totalArticles = query.data?.pages[0].data.count;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalItems / 20),
  );

  const firstRender = useRef(true);

  const categoriesOptions = articleCategories.map(category => ({
    key: category,
    value: category,
  }));

  useEffect(() => {
    if (totalArticles && totalArticles !== totalItems) {
      setTotalItems(totalArticles);
    }
  }, [totalArticles]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / 20));
  }, [totalItems]);

  if (query.isLoading && firstRender.current) {
    return (
      <>
        <Helmet>
          <meta charSet='utf-8' />
          {<title>{metadata.articleList.title}</title>}
          <meta name='description' content={metadata.articleList.description} />
          <meta name='keywords' content={metadata.articleList.keywords} />
          <meta property='og:title' content={metadata.articleList.title} />
          <meta
            property='og:description'
            content={metadata.articleList.description}
          />
          <meta property='og:type' content='website' />
          <meta property='og:url' content={webUrl + location.pathname} />
        </Helmet>
        <main className='flex min-h-minHeight w-full flex-col items-center'>
          <HeaderBanner
            title='Learn About Cardano'
            breadcrumbItems={[{ label: "Articles" }]}
          />
          <div className='m-2 flex h-auto w-full max-w-desktop justify-center rounded-m p-mobile hover:text-text md:m-5 md:p-desktop'>
            <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 rounded-m border border-border bg-gradient-to-b from-bannerGradient to-darker p-3 md:flex-row'>
              <div className='flex w-full justify-end md:w-[60%]'>
                <LoadingSkeleton
                  height='300px'
                  width='100%'
                  className='md:h-[380px]'
                  rounded='md'
                />
              </div>
              <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
                <div className='mb-auto flex flex-col gap-2'>
                  <LoadingSkeleton height='40px' width='100%' rounded='md' />
                  <LoadingSkeleton height='60px' width='100%' rounded='md' />
                </div>
                <LoadingSkeleton height='60px' width='150px' rounded='md' />
                <LoadingSkeleton height='40px' width='150px' rounded='md' />
              </div>
            </div>
          </div>
          <AdsCarousel />
          <div className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop'>
            <div className='ml-auto flex items-center gap-1'>
              <span className='text-text-sm'>Category:</span>
              <LoadingSkeleton height='36px' width='120px' rounded='md' />
            </div>
            <section className='grid w-full grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-1.5'>
              {Array.from({ length: 20 }).map((_, index) => (
                <LoadingSkeleton height='430px' key={index} rounded='lg' />
              ))}
            </section>
          </div>
        </main>
      </>
    );
  }

  firstRender.current = false;

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.articleList.title}</title>}
        <meta name='description' content={metadata.articleList.description} />
        <meta name='keywords' content={metadata.articleList.keywords} />
        <meta property='og:title' content={metadata.articleList.title} />
        <meta
          property='og:description'
          content={metadata.articleList.description}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center'>
        <HeaderBanner
          title='Learn About Cardano'
          breadcrumbItems={[{ label: "Articles" }]}
        />
        <div className='m-2 flex h-auto w-full max-w-desktop justify-center rounded-m p-mobile hover:text-text md:m-5 md:p-desktop'>
          {items && items.length > 0 && (
            <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 rounded-m border border-border bg-gradient-to-b from-bannerGradient to-darker p-3 md:flex-row'>
              <div className='flex w-full justify-end md:w-[60%]'>
                <Link
                  to='/article/$url'
                  params={{
                    url: firstArticle?.url ?? "",
                  }}
                  className='w-full'
                >
                  <Image
                    src={firstArticle?.image || ""}
                    className='h-[300px] w-full rounded-m object-cover md:h-[380px]'
                    height={380}
                  />
                </Link>
              </div>
              <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
                <div className='mb-auto'>
                  <Link
                    to='/article/$url'
                    className='text-display-xs font-medium text-primary'
                    params={{
                      url: firstArticle?.url ?? "",
                    }}
                  >
                    {parse(firstArticle?.name || "")}
                  </Link>
                  <p className='text-grayTextPrimary'>
                    {parse(firstArticle?.description || "")}
                  </p>
                </div>
                <div className='flex flex-col text-text-sm'>
                  {renderArticleAuthor(firstArticle?.user_owner)}
                </div>
                <div className='flex flex-col text-text-sm'>
                  <span className='text-grayTextPrimary'>Published</span>
                  <span>
                    {firstArticle?.pub_date
                      ? formatDate(firstArticle?.pub_date)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <AdsCarousel />
        <div className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop'>
          <div className='ml-auto flex items-center gap-1'>
            <span className='text-text-sm'>Category:</span>
            <SortBy
              selectItems={[{ key: "all", value: "all" }, ...categoriesOptions]}
              selectedItem={category}
              setSelectedItem={
                setCategory as React.Dispatch<
                  SetStateAction<string | undefined>
                >
              }
              label={false}
            />
          </div>
          {items.length === 0 ? (
            <NoResultsFound />
          ) : (
            <section className='grid w-full grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-1.5'>
              {items.slice(1).map(item => (
                <ArticleCard key={item.name + item.pub_date} article={item} />
              ))}
            </section>
          )}
          {totalItems > 20 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </main>
    </>
  );
};
