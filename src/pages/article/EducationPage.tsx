import { useFetchArticleDetail } from "@/services/article";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const EducationPage = () => {
  const { locale } = useLocaleStore();
  const query = useFetchArticleDetail(locale, "page", "education");
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
