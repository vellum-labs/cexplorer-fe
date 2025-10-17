import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const BountyPage = () => {
  const query = useFetchArticleDetail("en", "page", "bounty");
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
        {name && <title>{name} | Cexplorer.io</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {query.isLoading ? (
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-2'>
              <LoadingSkeleton width='200px' height='30px' />
              <LoadingSkeleton width='165px' height='21px' />
            </div>
            <div className='flex flex-col items-center gap-4'>
              <LoadingSkeleton width='800px' height='511px' rounded='lg' />
              <LoadingSkeleton width='800px' height='131px' rounded='lg' />
              <LoadingSkeleton width='800px' height='131px' rounded='lg' />
            </div>
          </div>
        ) : (
          parse(data?.data?.map(item => item).join("") || "")
        )}
      </main>
    </>
  );
};
