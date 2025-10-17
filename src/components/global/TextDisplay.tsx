import { Copy } from "@vellumlabs/cexplorer-sdk";

interface Props {
  text: string;
  className?: string;
  contents?: boolean;
  showCopy?: boolean;
}

export const TextDisplay = ({
  text,
  className,
  contents,
  showCopy = true,
}: Props) => {
  return (
    <div className={`relative ${className}`}>
      {showCopy && (
        <div
          className={`absolute bottom-2 right-2 rounded-s border border-border bg-background p-1`}
        >
          <Copy className='' copyText={text} />
        </div>
      )}
      <p
        className={`thin-scrollbar font-mono break-all text-text-xs font-medium ${contents ? "max-h-full" : "max-h-28 w-full overflow-scroll rounded-s border border-border bg-background p-1"}`}
      >
        {text}
      </p>
    </div>
  );
};
