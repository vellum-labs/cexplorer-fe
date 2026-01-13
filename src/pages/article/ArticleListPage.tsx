import { ArticleCard } from "@/components/article/ArticleCard";
import {
  AdsCarousel,
  Badge,
  Button,
  LoadingSkeleton,
  PoolCell,
  TextInput,
} from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { NoResultsFound } from "@vellumlabs/cexplorer-sdk";
import { Pagination } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { articleCategories } from "@/constants/article";
import { useFetchArticleList } from "@/services/article";
import type { ArticleCategories } from "@/types/articleTypes";
import { formatDate } from "@vellumlabs/cexplorer-sdk";
import { Link, useSearch } from "@tanstack/react-router";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useFetchMiscBasic } from "@/services/misc";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { PageBase } from "@/components/global/pages/PageBase";
import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ArticleListPage = () => {
  const { t } = useAppTranslation("common");
  const { page } = useSearch({ from: "/article/" });
  const currentPage = page ?? 1;
  const [category, setCategory] = useState<
    ArticleCategories | "all" | undefined
  >(undefined);

  const query = useFetchArticleList(
    "en",
    (page ?? 1) * 20 - 20,
    20,
    category !== "all" ? category?.toLowerCase() : undefined,
  );

  const items = query.data?.pages.flatMap(page => page.data.data) ?? [];
  const firstArticle = items && items.length > 0 ? items[0] : undefined;
  const totalArticles = query.data?.pages[0].data.count;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalItems / 20),
  );

  const miscBasicQuery = useFetchMiscBasic();

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

  return (
    <PageBase
      metadataOverride={{ title: "Articles | Cexplorer.io" }}
      title='Learn About Cardano'
      subTitle={
        <p className='text-text-md text-grayTextSecondary'>
          Subscribe to receive new articles, educational materials, and
          development releases directly to your email.
        </p>
      }
      breadcrumbItems={[{ label: "Articles" }]}
      adsCarousel={false}
    >
      <section className='mx-auto flex w-full max-w-desktop flex-col gap-4 px-mobile py-6 md:px-desktop'>
        <div className='flex flex-col gap-1'>
          <div className='flex w-full flex-wrap items-center gap-2'>
            <TextInput
              value=''
              onchange={() => undefined}
              disabled
              placeholder='Enter your email'
              className='sm:w-[335px]'
            />
            <Button size='md' label='Get started' variant='primary' disabled />
          </div>
          <span className='text-[14px] text-grayTextSecondary'>
            We care about your data in our privacy policy.
          </span>
        </div>
        {firstArticle &&
          (!query.isLoading ? (
            <Link
              to='/article/$url'
              params={{
                url: firstArticle?.url ?? "",
              }}
              className='rounded-m transition-all duration-300 hover:bg-cardBg hover:text-text'
            >
              <div className='flex w-full flex-col items-stretch gap-4 md:flex-row'>
                <div className='flex flex-1'>
                  <Image
                    src={firstArticle?.image || ""}
                    className='w-full rounded-m object-cover md:h-[380px]'
                    height={380}
                  />
                </div>
                <div className='flex max-w-[400px] flex-1 flex-col gap-2'>
                  <Badge rounded color='blue' className='mt-2'>
                    Partnerships
                  </Badge>
                  <h2 className='text-display-sm'>
                    {firstArticle
                      ? firstArticle?.name.length > 66
                        ? firstArticle?.name.slice(0, 66) + "..."
                        : firstArticle?.name
                      : ""}
                  </h2>
                  <p className='text-grayTextSecondary'>
                    {firstArticle
                      ? firstArticle?.description.length > 300
                        ? firstArticle?.description.slice(0, 300) + "..."
                        : firstArticle?.description
                      : ""}
                  </p>
                  <div className='flex h-full w-full flex-col justify-end gap-1'>
                    {firstArticle?.user_owner?.pool?.meta?.name ? (
                      <PoolCell poolInfo={firstArticle?.user_owner?.pool} />
                    ) : firstArticle?.user_owner?.drep?.meta?.given_name ? (
                      <DrepNameCell
                        item={{
                          data: {
                            given_name:
                              firstArticle?.user_owner?.drep?.meta?.given_name,
                            image_url:
                              firstArticle?.user_owner?.drep?.meta?.image_url,
                          },
                        }}
                      />
                    ) : (
                      ""
                    )}
                    {firstArticle?.pub_date && (
                      <span className='mb-2 text-text-sm text-grayTextSecondary'>
                        {formatDate(firstArticle?.pub_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className='flex w-full flex-col items-stretch gap-4 md:flex-row'>
              <div className='flex flex-1'>
                <LoadingSkeleton
                  className='w-full rounded-m md:h-[380px]'
                  width='100%'
                  height='380px'
                />
              </div>
              <div className='flex max-w-[400px] flex-1'>
                <LoadingSkeleton
                  className='w-full rounded-m md:h-[380px]'
                  width='100%'
                  height='380px'
                />
              </div>
            </div>
          ))}

        <AdsCarousel
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
          className='!px-0'
        />

        <div className='flex flex-wrap items-center justify-between gap-y-1'>
          <div className='flex items-center gap-1'>
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
          <TextInput
            onchange={() => undefined}
            placeholder='Search...'
            value=''
            disabled
          />
        </div>

        {!query.isLoading && items.length === 0 ? (
          <NoResultsFound label={t("sdk:noResultsFound")} />
        ) : !query.isLoading ? (
          <div className='flex w-full flex-wrap justify-between gap-y-3'>
            {items.slice(1).map(item => (
              <ArticleCard key={item.name + item.pub_date} article={item} />
            ))}
          </div>
        ) : (
          <div className='flex w-full flex-wrap justify-between gap-y-3'>
            {[...Array(19)].map(() => (
              <LoadingSkeleton
                width='430px'
                className='rounded-l'
                height='450px'
              />
            ))}
          </div>
        )}
        {totalItems > 20 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            labels={{
              ellipsisSrLabel: t("sdk:pagination.morePages"),
              nextAriaLabel: t("sdk:pagination.nextPage"),
              previousAriaLabel: t("sdk:pagination.previousPage"),
            }}
          />
        )}
      </section>
    </PageBase>
  );
};
