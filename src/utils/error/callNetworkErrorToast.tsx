import Copy from "@/components/global/Copy";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  status: number;
  apiUrl: string;
  body: ReadableStream<Uint8Array> | null;
}

export const callNetworkErrorToast = ({ status, apiUrl, body }: Props) => {
  return toast(
    <div className='relative'>
      <button
        className='absolute right-3 top-3'
        onClick={() => toast.dismiss()}
      >
        <X size={15} className='stroke-text' />
      </button>
      <Copy
        className='absolute bottom-3 right-3'
        copyText={`Status: ${status} at URL: ${apiUrl} on page ${window.location.href}. Response: ${JSON.stringify(body)}`}
      />
      Status {status} at api URL {apiUrl}
      <p className='mt-2'>Happened on page {window.location.href}</p>
      <p className='mt-2'>
        You can report this in our{" "}
        <a
          href='https://discord.gg/YuSFx7GS7y'
          target='_blank'
          className='text-primary'
        >
          Discord group
        </a>
        .
      </p>
    </div>,
    {
      duration: 10000,
      id: "fetch-error",
      //   closeButton: true,
    },
  );
};
