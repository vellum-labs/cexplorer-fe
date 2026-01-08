import type { FC } from "react";
import { useState } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  LoadingSkeleton,
  SafetyLinkModal,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useFetchWikiDetail } from "@/services/article";
import { markdownComponents } from "@/constants/markdows";

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
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);
  const detailQuery = useFetchWikiDetail("en", url, isOpen);
  const data = detailQuery.data;
  const isMarkdown = data?.render === "markdown";

  return (
    <>
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
                {isMarkdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents(setClickedUrl)}
                  >
                    {data?.data[0] || ""}
                  </ReactMarkdown>
                ) : (
                  parse(data?.data[0] || "")
                )}
              </div>
              <div className='text-sm mt-4 flex items-center gap-2'>
                <span className='text-grayTextPrimary'>Link</span>
                <Link to='/wiki/$url' params={{ url }} className='text-primary'>
                  cexplorer.io/wiki/{url}
                </Link>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
      {clickedUrl && (
        <SafetyLinkModal url={clickedUrl} onClose={() => setClickedUrl(null)} />
      )}
    </>
  );
};
