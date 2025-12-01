import type { Dispatch, SetStateAction } from "react";
import type { Components } from "react-markdown";

export const markdownComponents = (
  setClickedUrl: Dispatch<SetStateAction<string | null>>,
): Components => ({
  span: ({ children }) => <span className='text-sm'>{children}</span>,
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
      <button
        type='button'
        className='overflow-wrap-anywhere text-sm cursor-pointer break-all border-none bg-transparent p-0 text-primary'
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          setClickedUrl(url);
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </button>
    );
  },
  pre: ({ children }) => (
    <pre className='text-sm whitespace-pre-wrap break-words'>{children}</pre>
  ),
  p: ({ children }) => (
    <p className='overflow-wrap-anywhere text-sm mb-1 break-words'>
      {children}
    </p>
  ),
  li: ({ children }) => (
    <li className='overflow-wrap-anywhere text-sm mb-1 break-words'>
      {children}
    </li>
  ),
  ul: ({ children }) => (
    <ul className='mb-2 ml-5 list-disc text-sm'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='mb-2 ml-5 list-decimal text-sm'>{children}</ol>
  ),
  h1: ({ children }) => (
    <h1 className='mb-2 text-text-xl font-bold'>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className='mb-1.5 text-text-lg font-semibold'>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className='mb-1 text-text-md font-semibold'>{children}</h3>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className='my-2 block h-auto max-w-full rounded-m'
      style={{ objectFit: "contain" }}
    />
  ),
  table: ({ children }) => (
    <div className='my-2 overflow-x-auto'>
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
  code: ({ children }) => <code className='text-sm'>{children}</code>,
  strong: ({ children }) => (
    <strong className='text-sm font-semibold'>{children}</strong>
  ),
  em: ({ children }) => <em className='text-sm'>{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className='text-sm border-l-2 border-border pl-3'>
      {children}
    </blockquote>
  ),
  div: ({ children }) => <div className='text-sm'>{children}</div>,
});
