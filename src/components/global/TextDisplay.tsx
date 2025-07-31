import Copy from "../global/Copy";

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
          className={`absolute bottom-2 right-2 rounded-md border border-border bg-background p-1`}
        >
          <Copy className='' copyText={text} />
        </div>
      )}
      <p
        className={`thin-scrollbar break-all font-mono text-xs font-medium ${contents ? "max-h-full" : "max-h-28 w-full overflow-scroll rounded-md border border-border bg-background p-2"}`}
      >
        {text}
      </p>
    </div>
  );
};
