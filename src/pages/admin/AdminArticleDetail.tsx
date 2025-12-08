import { ArticleCombobox } from "@/components/article/ArticleCombobox";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { useFetchAdminArticle } from "@/services/user";
import { getUrl } from "@/utils/getUrl";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useWalletStore } from "@/stores/walletStore";
import type { ArticleCategories, ArticleUrl } from "@/types/articleTypes";
import type { AdminArticleDetailResponse } from "@/types/userTypes";
import { getRouteApi, Link, useSearch } from "@tanstack/react-router";
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
  const data = query?.data?.data as AdminArticleDetailResponse["data"];

  const needCheck = data?.need_check === 1 ? true : false;

  interface FormState {
    name: string;
    image: string;
    content: string;
    pubDate: string;
    description: string;
    keywords: string;
    categories: string[];
  }

  const [formState, setFormState] = useState<FormState>({
    name: "",
    image: "",
    content: "",
    pubDate: new Date().toISOString(),
    description: "",
    keywords: "",
    categories: [],
  });

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!token) return;
    try {
      const apiUrl = getUrl("/admin/article", {
        url,
        lang: lang || "en",
        type: "update",
      });
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          usertoken: token,
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          keywords: formState.keywords,
          data: formState.content,
          category: formState.categories,
          image: formState.image,
          pub_date: formState.pubDate,
        }),
      });

      const result = await response.json();

      if (typeof result?.data === "string") {
        toast.error(result.data);
        return;
      }

      toast.success("Page updated");
      query.refetch();
    } catch {
      toast.error("Failed to update article");
    }
  };

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  useEffect(() => {
    setFormState({
      name: data?.name || "",
      image: data?.image || "",
      content: data?.data ? data.data[0] : "",
      pubDate: data?.pub_date || new Date().toISOString(),
      description: data?.description || "",
      keywords: data?.keywords || "",
      categories: data?.category || [],
    });
  }, [data]);

  return (
    <main className='relative flex min-h-minHeight max-w-desktop flex-col gap-1 p-mobile md:p-desktop'>
      <Helmet>
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
            onchange={value => updateField("name", value)}
            value={formState.name}
          />
          <p>Description:</p>
          <TextInput
            placeholder='Description'
            onchange={value => updateField("description", value)}
            value={formState.description}
          />
          <p>Categories:</p>
          <ArticleCombobox
            categories={formState.categories as ArticleCategories[]}
            setCategories={
              ((value: ArticleCategories[]) =>
                updateField("categories", value)) as React.Dispatch<
                SetStateAction<ArticleCategories[]>
              >
            }
          />
          <p>Keywords:</p>
          <TextInput
            placeholder='Keywords'
            onchange={value => updateField("keywords", value)}
            value={formState.keywords}
          />
          <p>Image:</p>
          <TextInput
            placeholder='Image'
            onchange={value => updateField("image", value)}
            value={formState.image}
          />
          <p>Publish date:</p>
          <div className='mb-4 flex flex-col items-start gap-1/2'>
            <input
              type='datetime-local'
              value={formState.pubDate || new Date().toISOString()}
              onChange={e => updateField("pubDate", e.target.value)}
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
              value={formState.content}
              onChange={e => updateField("content", e.target.value)}
            />
            <SyntaxHighlighter
              language='html'
              style={theme === "dark" ? nord : qtcreatorLight}
              className='min-h-minHeight overflow-auto text-text'
              wrapLongLines
            >
              {formState.content}
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
