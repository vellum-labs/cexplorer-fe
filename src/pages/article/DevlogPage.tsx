import type { FC } from "react";
import parse from "html-react-parser";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useLocaleStore,
} from "@vellumlabs/cexplorer-sdk";

import { useFetchArticleDetail } from "@/services/article";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";

export const DevlogPage: FC = () => {
  const { locale } = useLocaleStore();
  const query = useFetchArticleDetail(locale, "page", "devlog");

  const devlog = (
    query.data?.data.some(item => Array.isArray(item))
      ? query.data?.data[0]
      : query.data?.data
  ) as any;

  return (
    <PageBase
      metadataTitle='devlog'
      title="What's new?"
      subTitle='Find concise summaries of all Cexplorer.io updates'
      breadcrumbItems={[
        { label: "Developers", link: "/dev" },
        { label: "Devlog" },
      ]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <Accordion type='single' collapsible className='w-full max-w-[600px]'>
          {query.isLoading ? (
            <LoadingSkeleton width='600px' height='520px' rounded='lg' />
          ) : (
            devlog?.map(item => (
              <AccordionItem
                key={item.title}
                value={item.title}
                className='border-b border-border'
              >
                <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                  <span className='text-text-md font-medium'>{item.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col pb-1.5 text-grayTextPrimary'>
                    {parse(JSON.stringify(item.msg))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </section>
    </PageBase>
  );
};
