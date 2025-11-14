import type { ModuleInput, ModuleOutput } from "@/addons/types";
import { SensitiveContentWarning } from "@vellumlabs/cexplorer-sdk";
import { useState } from "react";

export function render({ type, data }: ModuleInput): ModuleOutput {
  const messages: string[] = data?.md.msg ?? [];

  if (!Array.isArray(messages) || messages.length === 0) {
    return { component: null };
  }

  if (type === "embed-view") {
    return {
      component: <p className='text-primary'>CIP-20 Message</p>,
    };
  }

  if (type === "full-view") {
    const MessageContent = () => {
      const [showContent, setShowContent] = useState(() => {
        return localStorage.getItem("showSensitiveContent") === "true";
      });

      if (!showContent) {
        return (
          <SensitiveContentWarning
            onDisplay={() => setShowContent(true)}
            localStorageKey='showSensitiveContent'
            title='User-generated content'
            description='Following content is user-generated and unmoderated by the Cexplorer team.'
          />
        );
      }

      return (
        <div className='rounded-l border border-border bg-darker p-2'>
          <h3 className='mb-1 font-semibold text-text'>CIP-20 Messages</h3>
          <ul className='list-disc pl-3 text-text-sm text-grayTextPrimary'>
            {messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      );
    };

    return {
      component: <MessageContent />,
    };
  }

  return { component: null };
}
