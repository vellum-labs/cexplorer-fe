import { ArticleCard } from "@/components/article/ArticleCard";
import {
  AdsCarousel,
  Badge,
  Button,
  PoolCell,
  TextInput,
} from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { NoResultsFound } from "@vellumlabs/cexplorer-sdk";
import { Pagination } from "@vellumlabs/cexplorer-sdk";
// import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import SortBy from "@/components/ui/sortBy";
import { articleCategories } from "@/constants/article";
import { useFetchArticleList } from "@/services/article";
import type { ArticleCategories } from "@/types/articleTypes";
import { formatDate } from "@vellumlabs/cexplorer-sdk";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { Link, useSearch } from "@tanstack/react-router";
import parse from "html-react-parser";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useFetchMiscBasic } from "@/services/misc";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { PageBase } from "@/components/global/pages/PageBase";
import { DrepNameCell } from "@/components/drep/DrepNameCell";

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

  const miscBasicQuery = useFetchMiscBasic();

  // const firstRender = useRef(true);

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

  // if (query.isLoading && firstRender.current) {
  //   return (
  //     <PageBase
  //       metadataOverride={{ title: "Articles | Cexplorer.io" }}
  //       title='Learn About Cardano'
  //       breadcrumbItems={[{ label: "Articles" }]}
  //       adsCarousel={false}
  //       customPage={true}
  //     >
  //       <div className='flex h-auto w-full max-w-desktop justify-center rounded-m p-mobile hover:text-text md:p-desktop'>
  //         <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 rounded-m border border-border bg-gradient-to-b from-bannerGradient to-darker p-3 md:flex-row'>
  //           <div className='flex w-full justify-end md:w-[60%]'>
  //             <LoadingSkeleton
  //               height='300px'
  //               width='100%'
  //               className='md:h-[380px]'
  //               rounded='md'
  //             />
  //           </div>
  //           <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
  //             <div className='mb-auto flex flex-col gap-2'>
  //               <LoadingSkeleton height='40px' width='100%' rounded='md' />
  //               <LoadingSkeleton height='60px' width='100%' rounded='md' />
  //             </div>
  //             <LoadingSkeleton height='60px' width='150px' rounded='md' />
  //             <LoadingSkeleton height='40px' width='150px' rounded='md' />
  //           </div>
  //         </div>
  //       </div>
  //       <AdsCarousel
  //         generateImageUrl={generateImageUrl}
  //         miscBasicQuery={miscBasicQuery}
  //       />
  //       <div className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop'>
  //         <div className='ml-auto flex items-center gap-1'>
  //           <span className='text-text-sm'>Category:</span>
  //           <LoadingSkeleton height='36px' width='120px' rounded='md' />
  //         </div>
  //         <section className='grid w-full grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-1.5'>
  //           {Array.from({ length: 20 }).map((_, index) => (
  //             <LoadingSkeleton height='430px' key={index} rounded='lg' />
  //           ))}
  //         </section>
  //       </div>
  //     </PageBase>
  //   );
  // }

  // firstRender.current = false;

  console.log("firstArticle", firstArticle);

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

        <AdsCarousel
          generateImageUrl={generateImageUrl}
          miscBasicQuery={miscBasicQuery}
          className='!px-0'
        />
      </section>
    </PageBase>
    // <PageBase
    //   metadataOverride={{ title: "Articles | Cexplorer.io" }}
    //   title='Learn About Cardano'
    //   subTitle={
    //     <p className='text-text-md text-grayTextSecondary'>
    //       Subscribe to receive new articles, educational materials, and
    //       development releases directly to your email.
    //     </p>
    //   }
    //   breadcrumbItems={[{ label: "Articles" }]}
    //   adsCarousel={false}
    // >
    //   <div className='flex h-auto w-full max-w-desktop justify-center rounded-m p-mobile hover:text-text md:p-desktop'>
    //     {items && items.length > 0 && (
    //       <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 rounded-m border border-border bg-gradient-to-b from-bannerGradient to-darker p-3 md:flex-row'>
    //         <div className='flex w-full justify-end md:w-[60%]'>
    //           <Link
    //             to='/article/$url'
    //             params={{
    //               url: firstArticle?.url ?? "",
    //             }}
    //             className='w-full'
    //           >
    //             <Image
    //               src={firstArticle?.image || ""}
    //               className='h-[300px] w-full rounded-m object-cover md:h-[380px]'
    //               height={380}
    //             />
    //           </Link>
    //         </div>
    //         <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
    //           <div className='mb-auto'>
    //             <Link
    //               to='/article/$url'
    //               className='text-display-xs font-medium text-primary'
    //               params={{
    //                 url: firstArticle?.url ?? "",
    //               }}
    //             >
    //               {parse(firstArticle?.name || "")}
    //             </Link>
    //             <p className='text-grayTextPrimary'>
    //               {parse(firstArticle?.description || "")}
    //             </p>
    //           </div>
    //           <div className='flex flex-col text-text-sm'>
    //             {renderArticleAuthor(firstArticle?.user_owner)}
    //           </div>
    //           <div className='flex flex-col text-text-sm'>
    //             <span className='text-grayTextPrimary'>Published</span>
    //             <span>
    //               {firstArticle?.pub_date
    //                 ? formatDate(firstArticle?.pub_date)
    //                 : "-"}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <AdsCarousel
    //     generateImageUrl={generateImageUrl}
    //     miscBasicQuery={miscBasicQuery}
    //   />
    //   <div className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop'>
    //     <div className='ml-auto flex items-center gap-1'>
    //       <span className='text-text-sm'>Category:</span>
    //       <SortBy
    //         selectItems={[{ key: "all", value: "all" }, ...categoriesOptions]}
    //         selectedItem={category}
    //         setSelectedItem={
    //           setCategory as React.Dispatch<SetStateAction<string | undefined>>
    //         }
    //         label={false}
    //       />
    //     </div>
    //     {items.length === 0 ? (
    //       <NoResultsFound />
    //     ) : (
    //       <section className='grid w-full grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-1.5'>
    //         {items.slice(1).map(item => (
    //           <ArticleCard key={item.name + item.pub_date} article={item} />
    //         ))}
    //       </section>
    //     )}
    //     {totalItems > 20 && (
    //       <Pagination currentPage={currentPage} totalPages={totalPages} />
    //     )}
    //   </div>
    // </PageBase>
  );
};
