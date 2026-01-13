import type { FC } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  LoadingSkeleton,
  useLocaleStore,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import parse from "html-react-parser";

import { useFetchWikiDetail } from "@/services/article";

interface WikiAccordionItemProps {
  url: string;
  name: string;
  isOpen: boolean;
}

export const WikiAccordionItem: FC<WikiAccordionItemProps> = ({
  url,
  name,
  isOpen,
}) => {
  const { locale } = useLocaleStore();
  const detailQuery = useFetchWikiDetail(locale, url, isOpen);
  const data = detailQuery.data;

  return (
    <AccordionItem value={url} className='border-b border-border'>
      <AccordionTrigger className='AccordionTrigger w-full py-4 text-left'>
        <span className='font-semibold'>{name}</span>
      </AccordionTrigger>
      <AccordionContent>
        {detailQuery.isLoading ? (
          <div className='flex flex-col gap-2 pb-4'>
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='80%' />
          </div>
        ) : (
          <div className='pb-4'>
            <div className='prose prose-sm max-w-none text-grayTextPrimary [&>p]:my-2'>
              {parse(data?.data[0] || "")}
            </div>
            <div className='mt-4 flex items-center gap-2 text-sm'>
              <span className='text-grayTextPrimary'>Link</span>
              <Link
                to='/wiki/$url'
                params={{ url }}
                className='text-primary hover:underline'
              >
                cexplorer.io/wiki/{url}
              </Link>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
