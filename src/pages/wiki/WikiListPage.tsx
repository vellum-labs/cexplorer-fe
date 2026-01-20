import {
  Accordion,
  Button,
  LoadingSkeleton,
  NoResultsFound,
  useLocaleStore,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText } from "lucide-react";

import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { WikiAccordionItem } from "@/components/wiki/WikiAccordionItem";
import { useFetchWikiList } from "@/services/article";
import LogoMark from "@/resources/images/cexLogo.svg";

export const WikiListPage = () => {
  const { t } = useAppTranslation("common");
  const { locale } = useLocaleStore();
  const query = useFetchWikiList(locale, 0, 100);
  const items = query.data?.pages.flatMap(page => page.data.data) ?? [];
  const firstRender = useRef(true);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  if (query.isLoading && firstRender.current) {
    return (
      <PageBase
        metadataOverride={{ title: t("wikiPage.metaTitle") }}
        title={t("wikiPage.title")}
        breadcrumbItems={[{ label: t("wikiPage.breadcrumb") }]}
        adsCarousel={false}
        customPage={true}
      >
        <div className='mx-auto flex w-full max-w-[900px] flex-col gap-1.5 p-mobile md:p-desktop'>
          <div className='mb-4 text-center'>
            <LoadingSkeleton height='40px' width='300px' className='mx-auto' />
            <LoadingSkeleton
              height='20px'
              width='400px'
              className='mx-auto mt-2'
            />
          </div>
          <section className='flex w-full flex-col gap-1.5'>
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton height='60px' key={index} rounded='lg' />
            ))}
          </section>
        </div>
      </PageBase>
    );
  }

  firstRender.current = false;

  return (
    <PageBase
      metadataOverride={{ title: t("wikiPage.metaTitle") }}
      title={t("wikiPage.title")}
      subTitle={t("wikiPage.subtitle")}
      breadcrumbItems={[{ label: t("wikiPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <div className='mx-auto flex w-full max-w-[900px] flex-col gap-1.5 p-mobile md:p-desktop'>
        {items.length === 0 ? (
          <NoResultsFound label={t("sdk:noResultsFound")} />
        ) : (
          <Accordion
            type='single'
            collapsible
            className='w-full'
            value={openItem}
            onValueChange={setOpenItem}
          >
            {items.map(item => (
              <WikiAccordionItem
                key={item.url}
                url={item.url}
                name={item.name}
                isOpen={openItem === item.url}
              />
            ))}
          </Accordion>
        )}

        <div className='mt-12 flex flex-col items-center gap-4 rounded-xl border border-border bg-cardBg p-2 text-center'>
          <img src={LogoMark} alt='Cexplorer logo' className='h-16 w-16' />
          <h2 className='text-2xl font-bold'>{t("wikiPage.cta.title")}</h2>
          <p className='text-grayTextPrimary'>
            {t("wikiPage.cta.description")}
          </p>
          <Link to='/article'>
            <Button
              leftIcon={<FileText size={16} />}
              label={t("wikiPage.cta.button")}
              variant='primary'
              size='md'
            />
          </Link>
        </div>
      </div>
    </PageBase>
  );
};
