import { useFetchArticleDetail } from "@/services/article";
import { useNotFound } from "@/stores/useNotFound";
import parse from "html-react-parser";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export const ContributorsPage = () => {
  const query = useFetchArticleDetail("en", "page", "contributors");
  const data = query.data;
  const name = data?.name;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!query.data || !query.data.data || query.data.data.length === 0) {
      setNotFound(true);
    }
  }, [query.data, setNotFound]);

  return (
    <>
      <Helmet>{name && <title>{name} | Cexplorer.io</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
