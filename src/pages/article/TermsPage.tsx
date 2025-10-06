import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const TermsPage = () => {
  const query = useFetchArticleDetail("en", "page", "terms");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name}</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {query.isLoading ? (
          <div className='mt-5 flex flex-col gap-10'>
            <div className='flex flex-col items-center gap-8'>
              <LoadingSkeleton width='150px' height='30px' />
              <LoadingSkeleton width='160px' height='30px' />
            </div>
            <LoadingSkeleton width='650px' height='800px' rounded='lg' />
          </div>
        ) : (
          parse(data?.data.map(item => item).join("") || "")
        )}
      </main>
    </>
  );
};
