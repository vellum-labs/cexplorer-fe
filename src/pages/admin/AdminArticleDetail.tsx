import { ArticleCombobox } from "@/components/article/ArticleCombobox";
import { Badge } from "@/components/global/badges/Badge";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import SpinningLoader from "@/components/global/SpinningLoader";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { fetchAdminArticle, useFetchAdminArticle } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useThemeStore } from "@/stores/themeStore";
import { useWalletStore } from "@/stores/walletStore";
import type { ArticleCategories, ArticleUrl } from "@/types/articleTypes";
import type { AdminArticleDetailResponse } from "@/types/userTypes";
import { getRouteApi, Link, useSearch } from "@tanstack/react-router";
import parse from "html-react-parser";
import type { SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  nord,
  qtcreatorLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

export const AdminArticleDetail = () => {
  const route = getRouteApi("/admin/articles/$url");
  const { theme } = useThemeStore();
  const { url }: { url: ArticleUrl } = route.useParams();
  const { tokens } = useAuthTokensStore();
  const { address } = useWalletStore();
  const [token, setToken] = useState(tokens[address || ""]?.token);
  const { lang } = useSearch({
    from: "/admin/articles/$url",
  }) as any;
  const query = useFetchAdminArticle({
    token,
    type: "detail",
    lang: lang || "en",
    url,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const data = query.data?.data as AdminArticleDetailResponse["data"];

  const needCheck = data.need_check === 1 ? true : false;
  const [name, setName] = useState<string>(parse(data?.name || "") as string);
  const [image, setImage] = useState<string>(data?.image || "");
  const [content, setContent] = useState<string>(
    data?.data ? data.data[0] : "",
  );
  const [pubDate, setPubDate] = useState<string>(
    data?.pub_date || new Date().toISOString(),
  );
  const [description, setDescription] = useState<string>(
    data?.description || "",
  );
  const [keywords, setKeywords] = useState<string>(data?.keywords || "");
  const [categories, setCategories] = useState<string[]>(data?.category || []);

  const handleUpdate = async () => {
    if (!token) return;
    await fetchAdminArticle({
      token,
      type: "update",
      lang: lang || "en",
      url,
      body: {
        name: parse(name) as string,
        description: parse(description) as string,
        keywords,
        data: parse(content) as string,
        category: categories,
        image,
        pub_date: pubDate,
      },
    });

    toast.success("Page updated");
    query.refetch();
  };

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  useEffect(() => {
    setContent((data?.data ? data.data[0] : "") as string);
    setDescription(parse(data?.description || "") as string);
    setKeywords(data?.keywords || "");
    setCategories(data?.category || []);
    setName(parse(data?.name || "") as string);
    setImage(data?.image || "");
    setPubDate(data?.pub_date);
  }, [data]);

  return (
    <main className='relative flex min-h-minHeight max-w-desktop flex-col gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Admin article detail | Cexplorer.io</title>
      </Helmet>
      <BreadcrumbRaw className='w-full'>
        <BreadcrumbList className='flex items-center'>
          <BreadcrumbItem>
            <Link className='underline underline-offset-2' to='/'>
              Home
            </Link>
          </BreadcrumbItem>
          /
          <BreadcrumbItem>
            <Link className='underline underline-offset-2' to={"/admin"}>
              Admin
            </Link>
          </BreadcrumbItem>
          /
          <BreadcrumbItem>
            <Link
              className='underline underline-offset-2'
              to={"/admin/articles"}
            >
              Admin articles
            </Link>
          </BreadcrumbItem>
          /<BreadcrumbItem className='text-text'>{data?.name}</BreadcrumbItem>
        </BreadcrumbList>
      </BreadcrumbRaw>
      {query.isLoading ? (
        <div className='mt-4 flex w-full justify-center'>
          <SpinningLoader />
        </div>
      ) : !data && !query.isLoading ? (
        <p className='mt-4 flex w-full justify-center'>
          You don't have admin permission.
        </p>
      ) : (
        <>
          <h2>{data?.name}</h2>
          {needCheck && <Badge color='red'>Needs check</Badge>}
          <p>Name:</p>
          <TextInput
            placeholder='Name'
            onchange={value => setName(value)}
            value={name}
          />
          <p>Description:</p>
          <TextInput
            placeholder='Description'
            onchange={value => setDescription(value)}
            value={description}
          />
          <p>Categories:</p>
          <ArticleCombobox
            categories={categories as ArticleCategories[]}
            setCategories={
              setCategories as React.Dispatch<
                SetStateAction<ArticleCategories[]>
              >
            }
          />
          <p>Keywords:</p>
          <TextInput
            placeholder='Keywords'
            onchange={value => setKeywords(value)}
            value={keywords}
          />
          <p>Image:</p>
          <TextInput
            placeholder='Image'
            onchange={value => setImage(value)}
            value={image}
          />
          <p>Publish date:</p>
          <div className='mb-4 flex flex-col items-start gap-1/2'>
            <input
              type='datetime-local'
              value={pubDate || new Date().toISOString()}
              onChange={e => setPubDate(e.target.value)}
              className='mb-4 bg-background text-text'
            />
          </div>
          <p>Content:</p>
          <div
            role='button'
            onKeyDown={() => textareaRef.current?.focus()}
            onClick={() => textareaRef.current?.focus()}
            className='relative rounded-m border border-border bg-darker'
          >
            <textarea
              className='font-mono absolute inset-0 w-full resize-none overflow-hidden bg-transparent p-1 text-transparent caret-text outline-none'
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <SyntaxHighlighter
              language='html'
              style={theme === "dark" ? nord : qtcreatorLight}
              className='min-h-minHeight overflow-auto text-text'
              wrapLongLines
            >
              {content}
            </SyntaxHighlighter>
          </div>
          <Button
            label='Save'
            size='lg'
            variant='primary'
            onClick={handleUpdate}
            className='fixed bottom-4 right-10'
          />
        </>
      )}
    </main>
  );
};
