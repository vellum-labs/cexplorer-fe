import type { FC } from "react";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useFetchArticleDetail } from "@/services/article";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const DevlogPage: FC = () => {
  const query = useFetchArticleDetail("en", "page", "devlog");
  const data = query.data;
  const name = data?.name;

  const devlog = (
    query.data?.data.some(item => Array.isArray(item))
      ? query.data?.data[0]
      : query.data?.data
  ) as any;

  return (
    <>
      <Helmet>{name && <title>{name}</title>}</Helmet>
      <div className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h1>What’s new?</h1>
          <p className='mt-1.5 font-regular text-grayTextPrimary'>
            Find concise summaries of all Cexplorer.io updates
          </p>
          <Accordion
            type='single'
            collapsible
            className='mt-2 w-full max-w-[600px]'
          >
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
                    <span className='text-text-md font-medium'>
                      {item.title}
                    </span>
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
        </div>
      </div>
    </>
  );
};
