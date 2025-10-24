import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import { useNotFound } from "@/stores/useNotFound";
import { useEffect } from "react";

export const EducationPage = () => {
  const query = useFetchArticleDetail("en", "page", "education");
  const data = query.data;
  const name = data?.name;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!data?.data || data.data.length === 0) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

  return (
    <>
      <Helmet>{name && <title>{name}</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
