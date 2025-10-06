import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { SafetyLinkModal } from "@/components/global/modals/SafetyLinkModal";
import { markdownComponents } from "@/constants/markdows";

interface DrepDetailAboutTabProps {
  data: Record<string, string>;
}

export const DrepDetailAboutTab: FC<DrepDetailAboutTabProps> = ({ data }) => {
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  return (
    <section className='flex w-full flex-col'>
      {Object.entries(data).map(([key, value], index) => {
        const title = key
          .split("_")
          .map((w, i) => (i === 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
          .join(" ");

        const isAddress = value.startsWith("addr");

        return (
          <div
            key={key + "-" + index}
            className={`flex ${index % 2 !== 0 ? "bg-darker" : ""} flex-col gap-6 border-x border-t border-border px-3 py-[26px] text-left first:rounded-t-lg last:rounded-b-lg last:border-b md:flex-row`}
          >
            <span className='min-w-[150px] text-sm font-semibold'>{title}</span>

            {isAddress ? (
              <Link
                to='/address/$address'
                params={{ address: value }}
                className='w-full break-all text-sm text-primary'
              >
                {value}
              </Link>
            ) : (
              <div className='w-full break-words text-sm'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents(setClickedUrl)}
                >
                  {value}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      })}

      {clickedUrl && (
        <SafetyLinkModal url={clickedUrl} onClose={() => setClickedUrl(null)} />
      )}
    </section>
  );
};
