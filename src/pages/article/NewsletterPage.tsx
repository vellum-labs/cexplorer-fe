import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const NewsletterPage = () => {
  const query = useFetchArticleDetail("en", "page", "newsletter");
  const data = query.data;
  const name = data?.name;

  return (
    <>
      <Helmet>{name && <title>{name}</title>}</Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
