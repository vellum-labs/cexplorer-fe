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
import { useFetchAdminArticle, useUpdateAdminArticle } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useWalletStore } from "@/stores/walletStore";
import type { ArticleCategories, ArticleUrl } from "@/types/articleTypes";
import type { AdminArticleDetailResponse } from "@/types/userTypes";
import { Link } from "@tanstack/react-router";
import type { SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useFormDraft } from "@/hooks/useFormDraft";
import {
  nord,
  qtcreatorLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import {
  ADMIN_CONTENT_CONFIG,
  PRIMARY_FIELDS,
  SECONDARY_FIELDS,
  type ContentType,
} from "@/constants/adminContent";

type RenderMode = "html" | "markdown";

interface FormState {
  name: string;
  image: string;
  content: string;
  pubDate: string;
  description: string;
  keywords: string;
  categories: string[];
  render: RenderMode;
}

interface AdminContentDetailProps {
  type: ContentType;
  url: ArticleUrl;
  lang: "en";
}

export const AdminContentDetail = ({
  type,
  url,
  lang,
}: AdminContentDetailProps) => {
  const config = ADMIN_CONTENT_CONFIG[type];
  const { theme } = useThemeStore();
  const { tokens } = useAuthTokensStore();
  const { address } = useWalletStore();
  const [token, setToken] = useState(tokens[address || ""]?.token);

  const query = useFetchAdminArticle({
    token,
    type: "detail",
    lang: lang || "en",
    url,
    category: config.category,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const data = query?.data?.data as AdminArticleDetailResponse["data"];

  const needCheck = data?.need_check === 1 ? true : false;

  const [formState, setFormState] = useState<FormState>({
    name: "",
    image: "",
    content: "",
    pubDate: new Date().toISOString(),
    description: "",
    keywords: "",
    categories: [],
    render: "html",
  });

  const serverData = useMemo<FormState | undefined>(() => {
    if (!data) return undefined;
    return {
      name: data.name || "",
      image: data.image || "",
      content: data.data ? data.data[0] : "",
      pubDate: data.pub_date || new Date().toISOString(),
      description: data.description || "",
      keywords: data.keywords || "",
      categories: data.category || [],
      render: (data.render as RenderMode) || "html",
    };
  }, [data]);

  const { clearDraft, hasDraft, discardDraft } = useFormDraft(
    `${config.draftPrefix}_${url}_${lang || "en"}`,
    formState,
    setFormState,
    serverData,
  );

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const updateMutation = useUpdateAdminArticle({
    token,
    url,
    lang: lang || "en",
    category: config.category,
    onSuccess: () => {
      clearDraft();
      toast.success(config.successMessage);
      query.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || config.errorMessage);
    },
  });

  const handleUpdate = () => {
    if (!token) return;

    updateMutation.mutate({
      name: formState.name,
      description: formState.description,
      keywords: formState.keywords,
      data: formState.content,
      category: formState.categories,
      image: formState.image,
      pub_date: formState.pubDate,
      render: formState.render,
    });
  };

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  return (
    <main className='relative flex min-h-minHeight max-w-desktop flex-col gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <title>{config.pageTitle}</title>
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
              to={config.breadcrumbLink}
            >
              {config.breadcrumbLabel}
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
          <div className='flex items-center gap-2'>
            <h2>{data?.name}</h2>
            {needCheck && <Badge color='red'>Needs check</Badge>}
            {hasDraft() && (
              <button type='button' onClick={discardDraft}>
                <Badge color='yellow'>Unsaved draft (click to discard)</Badge>
              </button>
            )}
          </div>

          {PRIMARY_FIELDS.map(({ label, field, placeholder }) => (
            <div key={field}>
              <p>{label}:</p>
              <TextInput
                placeholder={placeholder}
                onchange={value => updateField(field, value)}
                value={formState[field]}
              />
            </div>
          ))}

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

          {SECONDARY_FIELDS.map(({ label, field, placeholder }) => (
            <div key={field}>
              <p>{label}:</p>
              <TextInput
                placeholder={placeholder}
                onchange={value => updateField(field, value)}
                value={formState[field]}
              />
            </div>
          ))}

          <p>Publish date:</p>
          <div className='mb-4 flex flex-col items-start gap-1/2'>
            <input
              type='datetime-local'
              value={formState.pubDate || new Date().toISOString()}
              onChange={e => updateField("pubDate", e.target.value)}
              className='mb-4 bg-background text-text'
            />
          </div>

          <p>Render mode:</p>
          <div className='mb-2 flex gap-2'>
            <button
              type='button'
              onClick={() => updateField("render", "html")}
              className={`rounded-m px-3 py-1 text-text-sm ${
                formState.render === "html"
                  ? "bg-primary text-white"
                  : "bg-darker text-text"
              }`}
            >
              HTML
            </button>
            <button
              type='button'
              onClick={() => updateField("render", "markdown")}
              className={`rounded-m px-3 py-1 text-text-sm ${
                formState.render === "markdown"
                  ? "bg-primary text-white"
                  : "bg-darker text-text"
              }`}
            >
              Markdown
            </button>
          </div>

          <p>Content:</p>
          <div
            role='button'
            onKeyDown={() => textareaRef.current?.focus()}
            onClick={() => textareaRef.current?.focus()}
            className='relative rounded-m border border-border bg-darker'
          >
            <textarea
              className='absolute inset-0 w-full resize-none overflow-hidden bg-transparent text-transparent caret-text outline-none'
              ref={textareaRef}
              value={formState.content}
              onChange={e => updateField("content", e.target.value)}
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: "14px",
                lineHeight: "1.5",
                padding: "8px",
                letterSpacing: "normal",
                wordSpacing: "normal",
              }}
            />
            <SyntaxHighlighter
              language={formState.render === "markdown" ? "markdown" : "html"}
              style={theme === "dark" ? nord : qtcreatorLight}
              className='min-h-minHeight overflow-auto text-text'
              wrapLongLines
              customStyle={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: "14px",
                lineHeight: "1.5",
                margin: 0,
                padding: "8px",
                letterSpacing: "normal",
                wordSpacing: "normal",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: "14px",
                  lineHeight: "1.5",
                  letterSpacing: "normal",
                  wordSpacing: "normal",
                },
              }}
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
