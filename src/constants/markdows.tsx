import type { Dispatch, SetStateAction } from "react";
import type { Components } from "react-markdown";

export const markdownComponents = (
  setClickedUrl: Dispatch<SetStateAction<string | null>>,
): Components => ({
  a: ({ href, children }) => {
    const url = href ?? "#";
    return (
      <a
        href={url}
        rel='nofollow'
        className='break-all text-primary underline'
        onClick={e => {
          e.preventDefault();
          setClickedUrl(url);
        }}
      >
        {children}
      </a>
    );
  },
  pre: ({ children }) => (
    <pre className='whitespace-pre-wrap break-words'>{children}</pre>
  ),
  p: ({ children }) => <p className='mb-2 break-words'>{children}</p>,
  li: ({ children }) => <li className='ml-5 list-decimal'>{children}</li>,
  ul: ({ children }) => <ul className='mb-4 ml-5 list-disc'>{children}</ul>,
  ol: ({ children }) => <ol className='mb-4 ml-5 list-decimal'>{children}</ol>,
  h1: ({ children }) => <h1 className='mb-4 text-xl font-bold'>{children}</h1>,
  h2: ({ children }) => (
    <h2 className='mb-3 text-lg font-semibold'>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className='mb-2 text-base font-semibold'>{children}</h3>
  ),
});
