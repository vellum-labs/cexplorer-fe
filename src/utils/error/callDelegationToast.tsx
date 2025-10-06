import Copy from "@/components/global/Copy";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CallDelegationToastProps {
  errorMessage?: string;
  success?: boolean;
}

export const callDelegationToast = ({
  errorMessage,
  success = false,
}: CallDelegationToastProps) => {
  return toast(
    <div className='relative p-1.5'>
      <div className='absolute right-2 top-2 flex items-center gap-1'>
        <button onClick={() => toast.dismiss()} aria-label='Dismiss'>
          <X size={15} className='stroke-text' />
        </button>
      </div>

      <div className='absolute bottom-2 right-2'>
        <Copy
          copyText={
            success
              ? `Delegation success on page ${window.location.href}`
              : `Delegation error on page ${window.location.href}. Error: ${errorMessage}`
          }
        />
      </div>

      <p className={`font-bold ${success ? "text-green-600" : "text-red-500"}`}>
        {success ? "Delegation successful" : "Delegation failed"}
      </p>

      {!success && errorMessage && (
        <p className='mt-1'>
          <strong>Error:</strong> {errorMessage}
        </p>
      )}

      {!success && <p className='mt-1'>Page: {window.location.href}</p>}

      {!success ? (
        <p className='mt-1'>
          Please check your wallet connection and try again. If the problem
          persists, you can report this in our{" "}
          <a
            href='https://discord.gg/YuSFx7GS7y'
            target='_blank'
            className='text-primary'
          >
            Discord group
          </a>
          .
        </p>
      ) : (
        <p className='mt-1'>
          Please wait a few minutes for the changes to appear in your account.
          If they don’t show up, please check your wallet connection and try
          again. If the problem persists, you can report this in our{" "}
          <a
            href='https://discord.gg/YuSFx7GS7y'
            target='_blank'
            className='text-primary'
          >
            Discord group
          </a>
          .
        </p>
      )}
    </div>,
    {
      duration: 10000,
      id: success ? "delegate-success" : "delegate-error",
    },
  );
};
