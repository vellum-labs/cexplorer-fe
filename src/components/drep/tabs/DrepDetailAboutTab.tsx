import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { SafetyLinkModal, Copy } from "@vellumlabs/cexplorer-sdk";
import { markdownComponents } from "@/constants/markdows";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepDetailAboutTabProps {
  data: Record<string, string>;
}

export const DrepDetailAboutTab: FC<DrepDetailAboutTabProps> = ({ data }) => {
  const { t } = useAppTranslation("pages");
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  const entries = Object.entries(data);

  const getFieldTitle = (key: string): string => {
    const translationKey = `dreps.detailPage.aboutFields.${key}`;
    const translated = t(translationKey);
    // If translation exists (not same as key), use it; otherwise fallback to formatted key
    if (translated !== translationKey) {
      return translated;
    }
    return key
      .split("_")
      .map((w, i) => (i === 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
      .join(" ");
  };

  return (
    <section className='flex w-full flex-col overflow-hidden rounded-xl border border-border'>
      {entries.map(([key, value], index) => {
        const title = getFieldTitle(key);

        const isAddress = value.startsWith("addr");

        return (
          <div
            key={key + "-" + index}
            className={`flex min-h-[55px] flex-col gap-3 px-4 py-3 text-left md:flex-row md:items-center ${index % 2 !== 0 ? "bg-darker" : ""} ${index !== entries.length - 1 ? "border-b border-border" : ""}`}
          >
            <span className='min-w-[150px] text-text-sm font-medium text-grayTextPrimary'>
              {title}
            </span>

            {!value || value.trim() === "" ? (
              <span className='text-text-sm text-grayTextPrimary'>-</span>
            ) : isAddress ? (
              <div className='flex w-full items-center gap-2'>
                <Link
                  to='/address/$address'
                  params={{ address: value }}
                  className='break-all text-text-sm text-primary'
                >
                  {value}
                </Link>
                <Copy copyText={value} />
              </div>
            ) : (
              <div className='w-full break-words text-text-sm'>
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
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(null)}
          warningText={t("sdk:safetyLink.warningText")}
          goBackLabel={t("sdk:safetyLink.goBackLabel")}
          visitLabel={t("sdk:safetyLink.visitLabel")}
        />
      )}
    </section>
  );
};
