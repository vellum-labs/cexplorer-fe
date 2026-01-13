import { PageBase } from "@/components/global/pages/PageBase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

export const FaqPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataOverride={{ title: t("faqPage.metaTitle") }}
      title={t("faqPage.title")}
      subTitle={t("faqPage.subtitle")}
      breadcrumbItems={[{ label: t("faqPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <Accordion
          type='single'
          collapsible
          className='mt-2 w-full max-w-[600px]'
        >
          {faqKeys.map(key => (
            <AccordionItem
              key={key}
              value={key}
              className='border-b border-border'
            >
              <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                <span className='text-text-md font-medium'>{t(`faqPage.questions.${key}.title`)}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col pb-1.5 text-grayTextPrimary'>
                  {t(`faqPage.questions.${key}.answer`)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageBase>
  );
};
