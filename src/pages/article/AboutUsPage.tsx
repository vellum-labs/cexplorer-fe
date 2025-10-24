import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const AboutUsPage = () => {
  const query = useFetchArticleDetail("en", "page", "about-us");
  const data = query.data;
  const name = data?.name;

  return (
    <>
      <Helmet>{name && <title>{name} | Cexplorer.io</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {query.isLoading ? (
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-2'>
              <LoadingSkeleton width='150px' height='30px' />
              <LoadingSkeleton width='800px' height='63px' />
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-center gap-2'>
                <LoadingSkeleton width='150px' height='30px' />
                <LoadingSkeleton width='450px' height='21px' />
              </div>
              <div className='grid grid-cols-3 grid-rows-2 gap-5'>
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
                <LoadingSkeleton width='360px' height='235px' rounded='lg' />
              </div>
            </div>
          </div>
        ) : (
          parse(data?.data?.map(item => item).join("") || "")
        )}
      </main>
    </>
  );
};
