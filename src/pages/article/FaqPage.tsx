import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const FaqPage = () => {
  const query = useFetchArticleDetail("en", "page", "faq");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;
  const faq: any = query.data?.data.some(item => Array.isArray(item))
    ? query.data?.data[0]
    : query.data?.data;

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name} | Cexplorer.io</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <div className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h1>Frequently asked questions</h1>
          <p className='mt-3 font-light text-grayTextPrimary'>
            Everything you need to know about the product and billing.
          </p>
          <Accordion
            type='single'
            collapsible
            className='mt-4 w-full max-w-[600px]'
          >
            {query.isLoading ? (
              <LoadingSkeleton width='600px' height='520px' rounded='lg' />
            ) : (
              faq?.map(item => (
                <AccordionItem
                  key={item.title}
                  value={item.title}
                  className='border-b border-border'
                >
                  <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                    <span className='text-base font-medium'>{item.title}</span>
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
