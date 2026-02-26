import { useFetchArticleDetail } from "@/services/article";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import parse from "html-react-parser";
import { PageBase } from "@/components/global/pages/PageBase";

export const EducationPage = () => {
  const { locale } = useLocaleStore();
  const query = useFetchArticleDetail(locale, "page", "education");
  const data = query.data;
  const name = data?.name;

  return (
    <PageBase
      metadataOverride={{ title: name || "Education | Cexplorer.io" }}
      title={name || "Education"}
      breadcrumbItems={[{ label: "Education" }]}
      adsCarousel={false}
      bookmarkButton={false}
    >
      <div className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        {parse(data?.data.map(item => item).join("") || "")}
      </div>
    </PageBase>
  );
};
