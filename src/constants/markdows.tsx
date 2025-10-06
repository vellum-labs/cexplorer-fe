import type { Dispatch, SetStateAction } from "react";
import type { Components } from "react-markdown";

export const markdownComponents = (
  setClickedUrl: Dispatch<SetStateAction<string | null>>,
): Components => ({
  a: ({ href, children }) => {
    let url = href ?? "#";

    if (
      url &&
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("#") &&
      !url.startsWith("mailto:")
    ) {
      url = `https://${url}`;
    }

    return (
      <a
        href={url}
        rel='nofollow'
        className='overflow-wrap-anywhere break-all text-primary underline'
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
  p: ({ children }) => (
    <p className='overflow-wrap-anywhere mb-2 break-words'>{children}</p>
  ),
  li: ({ children }) => (
    <li className='overflow-wrap-anywhere break-words'>{children}</li>
  ),
  ul: ({ children }) => <ul className='mb-4'>{children}</ul>,
  ol: ({ children }) => <ol className='mb-4'>{children}</ol>,
  h1: ({ children }) => <h1 className='mb-4 text-xl font-bold'>{children}</h1>,
  h2: ({ children }) => (
    <h2 className='mb-3 text-lg font-semibold'>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className='mb-2 text-base font-semibold'>{children}</h3>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className='my-4 block h-auto max-w-full rounded-lg'
      style={{ objectFit: "contain" }}
    />
  ),
  table: ({ children }) => (
    <div className='my-4 overflow-x-auto'>
      <table className='min-w-full border-collapse border border-border'>
        {children}
      </table>
    </div>
  ),
  td: ({ children }) => (
    <td className='break-words border border-border px-2 py-1'>{children}</td>
  ),
  th: ({ children }) => (
    <th className='border border-border bg-cardBg px-2 py-1 font-semibold'>
      {children}
    </th>
  ),
});
