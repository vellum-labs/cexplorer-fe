import { LoadingSkeleton, useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useFetchWikiDetail, useFetchWikiList } from "@/services/article";
import { getRouteApi, Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const WikiDetailPage = () => {
  const { t } = useAppTranslation();
  const { locale } = useLocaleStore();
  const route = getRouteApi("/wiki/$url");
  const { url } = route.useParams();

  const detailQuery = useFetchWikiDetail(locale, url);
  const listQuery = useFetchWikiList(locale, 0, 100);
  const data = detailQuery.data;
  const allOtherWikis =
    listQuery.data?.pages
      .flatMap(page => page.data.data)
      .filter(wiki => wiki.url !== url) || [];

  const otherWikis = allOtherWikis
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  if (detailQuery.isLoading) {
    return (
      <PageBase
        metadataOverride={{ title: t("wikiPage.metaTitle") }}
        title={t("wikiPage.breadcrumb")}
        breadcrumbItems={[{ label: t("wikiPage.breadcrumb") }]}
        adsCarousel={false}
        customPage={true}
      >
        <div className='mx-auto flex w-full max-w-desktop gap-6 p-mobile md:p-desktop'>
          <div className='flex-1'>
            <LoadingSkeleton height='40px' width='60%' rounded='md' />
            <div className='mt-4'>
              <LoadingSkeleton height='400px' width='100%' rounded='md' />
            </div>
          </div>
          <div className='hidden w-[300px] flex-col gap-1.5 lg:flex'>
            <LoadingSkeleton height='200px' width='100%' rounded='md' />
          </div>
        </div>
      </PageBase>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {data?.name
            ? `${parse(data.name)} | ${t("wikiPage.breadcrumb")} | Cexplorer.io`
            : t("wikiPage.metaTitle")}
        </title>
      </Helmet>
      <PageBase
        metadataOverride={{ title: t("wikiPage.metaTitle") }}
        title={t("wikiPage.breadcrumb")}
        subTitle={data?.name ? String(parse(data.name)) : undefined}
        breadcrumbItems={[
          { label: t("wikiPage.breadcrumb"), link: "/wiki" },
          { label: data?.name ? String(parse(data.name)) : "" },
        ]}
        adsCarousel={false}
        customPage={true}
      >
        <div className='mx-auto flex w-full max-w-desktop gap-3 p-mobile md:p-desktop'>
          <article className='flex-1 rounded-xl border border-border bg-cardBg p-2'>
            <h2 className='text-2xl mb-4 font-bold'>
              {parse(data?.name || "")}
            </h2>
            <div className='prose prose-sm max-w-none text-grayTextPrimary [&>p]:my-3'>
              {parse(data?.data[0] || "")}
            </div>
          </article>

          {otherWikis.length > 0 && (
            <aside className='hidden w-[300px] lg:block'>
              <div className='rounded-xl border border-border bg-cardBg p-2'>
                <h3 className='mb-3 font-semibold'>{t("wikiPage.otherTopics")}</h3>
                <div className='flex flex-col gap-2'>
                  {otherWikis.map(wiki => (
                    <Link
                      key={wiki.url}
                      to='/wiki/$url'
                      params={{ url: wiki.url }}
                      className='text-sm text-primary'
                    >
                      {wiki.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </PageBase>
    </>
  );
};
