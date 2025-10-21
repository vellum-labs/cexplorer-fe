import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

export const FaqPage = () => {
  const query = useFetchArticleDetail("en", "page", "faq");
  const data = query.data;
  const name = data?.name;
  const faq: any = query.data?.data.some(item => Array.isArray(item))
    ? query.data?.data[0]
    : query.data?.data;

  return (
    <>
      <Helmet>{name && <title>{name} | Cexplorer.io</title>}</Helmet>
      <div className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h1>Frequently asked questions</h1>
          <p className='mt-1.5 font-regular text-grayTextPrimary'>
            Everything you need to know about the product and billing.
          </p>
          <Accordion
            type='single'
            collapsible
            className='mt-2 w-full max-w-[600px]'
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
