import type { ScriptDetailData } from "@/types/scriptTypes";

interface Props {
  name: string;
  extra: ScriptDetailData["label"]["extra"] | undefined;
}

export const ExtraLabelBadge = ({ extra, name }: Props) => {
  if (!extra) return <span>{name}</span>;

  return (
    <>
      {extra?.link ? (
        <a
          href={extra.link}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded-full px-2 py-1'
          style={{
            backgroundColor: extra.bg || "transparent",
            color: extra.color || "text-text",
            fontWeight: extra.fw || 500,
          }}
        >
          {name}
        </a>
      ) : (
        <div
          className='rounded-full px-2 py-0.5'
          style={{
            backgroundColor: extra.bg || "transparent",
            color: extra.color || "text-text",
            fontWeight: extra.fw || 500,
          }}
        >
          {name}
        </div>
      )}
    </>
  );
};
