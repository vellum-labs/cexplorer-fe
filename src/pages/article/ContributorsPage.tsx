import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail } from "@/services/article";
import { useNotFound } from "@/stores/useNotFound";
import parse from "html-react-parser";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export const ContributorsPage = () => {
  const query = useFetchArticleDetail("en", "page", "contributors");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!query.data || !query.data.data || query.data.data.length === 0) {
      setNotFound(true);
    }
  }, [query.data, setNotFound]);

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
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
