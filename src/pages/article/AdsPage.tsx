import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail } from "@/services/article";
import { useNotFound } from "@/stores/useNotFound";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export const AdsPage = () => {
  const query = useFetchArticleDetail("en", "page", "ads");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!data?.data || data.data.length === 0) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

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
        {parse(data?.data?.map(item => item).join("") || "")}
      </main>
    </>
  );
};
