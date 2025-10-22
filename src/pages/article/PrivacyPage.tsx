import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const PrivacyPage = () => {
  const query = useFetchArticleDetail("en", "page", "privacy");
  const data = query.data;
  const name = data?.name;

  return (
    <>
      <Helmet>{name && <title>{name}</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {query.isLoading ? (
          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-4'>
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
