import type { FC } from "react";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@vellumlabs/cexplorer-sdk";

import { useFetchArticleDetail } from "@/services/article";
import { webUrl } from "@/constants/confVariables";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const DevlogPage: FC = () => {
  const query = useFetchArticleDetail("en", "page", "devlog");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const devlog = (
    query.data?.data.some(item => Array.isArray(item))
      ? query.data?.data[0]
      : query.data?.data
  ) as any;

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name}</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
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
