import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const AdsPage = () => {
  const query = useFetchArticleDetail("en", "page", "ads");
  const data = query.data;
  const name = data?.name;

  return (
    <>
      <Helmet>{name && <title>{name} | Cexplorer.io</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {query.isLoading ? (
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-2'>
              <LoadingSkeleton width='250px' height='30px' />
              <LoadingSkeleton width='250px' height='21px' />
            </div>
            <LoadingSkeleton width='1250px' height='215px' rounded='lg' />
            <LoadingSkeleton width='1250px' height='522px' rounded='lg' />
            <LoadingSkeleton width='1250px' height='522px' rounded='lg' />
            <LoadingSkeleton width='1250px' height='522px' rounded='lg' />
          </div>
        ) : (
          parse(data?.data?.map(item => item).join("") || "")
        )}
      </main>
    </>
  );
};
