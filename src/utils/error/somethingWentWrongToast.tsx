import Copy from "@/components/global/Copy";
import { X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  error?: unknown;
  status?: number;
  apiUrl?: string | null;
  extra?: unknown;
};

function stringifyError(e: unknown) {
  if (!e) return "unknown error";
  if (e instanceof Error) return `${e.name}: ${e.message}\n${e.stack ?? ""}`;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}

export function showSomethingWentWrongToast({
  error,
  status,
  apiUrl,
  extra,
}: Props) {
  const msg = stringifyError(error);
  const id = "router-something-went-wrong";

  toast.dismiss(id);

  toast(
    <div className='relative pr-10'>
      <button
        className='absolute right-3 top-3'
        onClick={() => toast.dismiss(id)}
      >
        <X size={15} className='stroke-text' />
      </button>

      <div className='text-base font-semibold'>something went wrong</div>

      <p className='mt-1 text-sm opacity-80'>
        Status {status ?? "n/a"}
        {apiUrl ? ` at ${apiUrl}` : ""}.
      </p>
      <p className='mt-2 text-sm'>Happened on page {window.location.href}</p>

      <pre className='mt-3 max-h-48 overflow-auto rounded bg-black/5 p-2 text-xs leading-snug'>
        {msg}
      </pre>

      <Copy
        className='absolute bottom-3 right-3'
        copyText={
          `Status: ${status ?? "n/a"} at URL: ${apiUrl ?? "n/a"} on page ${window.location.href}. ` +
          `Error: ${msg}. Extra: ${stringifyError(extra)}`
        }
      />

      <p className='mt-2 text-sm'>
        You can report this in our{" "}
        <a
          href='https://discord.gg/YuSFx7GS7y'
          target='_blank'
          className='text-primary underline'
          rel='noreferrer'
        >
          Discord group
        </a>
        .
      </p>
    </div>,
    { duration: 10000, id },
  );
}
