import type { useFetchGovernanceActionDetail } from "@/services/governance";
import type { FC } from "react";

import { AddressInspectorRow } from "@/components/address/AddressInspectorRow";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";
import { SafetyLinkModal } from "@/components/global/modals/SafetyLinkModal";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState } from "react";
import { markdownComponents } from "@/constants/markdows";

interface GovernanceDetailMetadataTabProps {
  query: ReturnType<typeof useFetchGovernanceActionDetail>;
}

export const GovernanceDetailMetadataTab: FC<
  GovernanceDetailMetadataTabProps
> = ({ query }) => {
  const anchor = query?.data?.data?.anchor;

  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  const rows = [
    {
      title: "Action type",
      value: query?.data?.data?.type ? (
        <div className='px-1.5'>
          <ActionTypes title={query?.data?.data?.type as ActionTypes} />
        </div>
      ) : (
        "-"
      ),
      darker: false,
    },
    {
      title: "Title",
      value: (
        <div className='overflow-wrap-anywhere max-w-full break-words p-1 font-regular text-grayTextPrimary'>
          {anchor?.offchain?.name ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents(setClickedUrl)}
            >
              {anchor?.offchain?.name}
            </ReactMarkdown>
          ) : (
            "⚠️ Invalid metadata"
          )}
        </div>
      ),
      darker: true,
    },
    {
      title: "Abstracts",
      value: (
        <div className='overflow-wrap-anywhere max-w-full break-words p-1 font-regular text-grayTextPrimary'>
          {anchor?.offchain?.abstract ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents(setClickedUrl)}
            >
              {anchor?.offchain?.abstract}
            </ReactMarkdown>
          ) : (
            "-"
          )}
        </div>
      ),
      titleStart: true,
      darker: false,
    },
    {
      title: "Rationale",
      value: (
        <div className='overflow-wrap-anywhere max-w-full break-words p-1 font-regular text-grayTextPrimary'>
          {anchor?.offchain?.rationale ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents(setClickedUrl)}
            >
              {anchor?.offchain?.rationale}
            </ReactMarkdown>
          ) : (
            "-"
          )}
        </div>
      ),
      titleStart: true,
      darker: true,
    },
  ];

  return (
    <>
      <div className='w-full rounded-m border border-border'>
        {rows.map(item => (
          <AddressInspectorRow
            key={item.title}
            title={item.title}
            darker={item.darker}
            value={item.value}
            titleStart={item.titleStart}
            isLoading={false}
          />
        ))}
      </div>
      {clickedUrl && (
        <SafetyLinkModal url={clickedUrl} onClose={() => setClickedUrl(null)} />
      )}
    </>
  );
};
