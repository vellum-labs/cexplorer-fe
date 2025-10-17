import { Button } from "@vellumlabs/cexplorer-sdk";
import TextInput from "@/components/global/inputs/TextInput";
import SpinningLoader from "@/components/global/SpinningLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { fetchAdminPage, useFetchAdminPage } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletStore } from "@/stores/walletStore";
import type { ArticleUrl } from "@/types/articleTypes";
import type { AdminPageDetailResponse } from "@/types/userTypes";
import { getRouteApi, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

export const AdminPageDetail = () => {
  const route = getRouteApi("/admin/pages/$url");
  const { url }: { url: ArticleUrl } = route.useParams();
  const { tokens } = useAuthTokensStore();
  const { address } = useWalletStore();
  const [token, setToken] = useState(tokens[address || ""]?.token);
  const query = useFetchAdminPage({
    token,
    type: "detail",
    lang: "en",
    url,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const data = query.data?.data as AdminPageDetailResponse["data"];
  const { lang } = useSearch({
    from: "/admin/pages/$url",
  });
  const isHTML = data?.render === "html";

  const [code, setCode] = useState<string>(
    isHTML
      ? data?.data[0]
      : JSON.stringify(
          data?.data,
          (_key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2,
        ) || "",
  );
  const [description, setDescription] = useState<string>(
    data?.description || "",
  );
  const [keywords, setKeywords] = useState<string>(data?.keywords || "");

  const handleUpdate = async () => {
    if (!token) return;

    if (!isHTML) {
      try {
        JSON.parse(code);
      } catch (e) {
        toast.error("Invalid JSON format");
        return;
      }
    }
    await fetchAdminPage({
      token,
      type: "update",
      lang: lang || "en",
      url,
      body: {
        description,
        keywords,
        data: isHTML ? [code] : JSON.parse(code),
      },
    });

    toast.success("Page updated");
    query.refetch();
  };

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  useEffect(() => {
    setCode(
      isHTML
        ? data?.data[0]
        : JSON.stringify(
            data?.data,
            (_key, value) =>
              typeof value === "bigint" ? value.toString() : value,
            2,
          ),
    );
    setDescription(data?.description || "");
    setKeywords(data?.keywords || "");
  }, [data, isHTML]);

  return (
    <main className='relative flex min-h-minHeight max-w-desktop flex-col gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Admin page detail | Cexplorer.io</title>
      </Helmet>
      <Breadcrumb className='w-full'>
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
            <Link className='underline underline-offset-2' to={"/admin/pages"}>
              Admin pages
            </Link>
          </BreadcrumbItem>
          /<BreadcrumbItem className='text-text'>{data?.name}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
          <h2> {data?.name}</h2>
          <p>Description:</p>
          <TextInput
            placeholder='Description'
            onchange={value => setDescription(value)}
            value={description}
          />
          <p>Keywords</p>
          <TextInput
            placeholder='Keywords'
            onchange={value => setKeywords(value)}
            value={keywords}
          />
          <div
            role='button'
            onKeyDown={() => textareaRef.current?.focus()}
            onClick={() => textareaRef.current?.focus()}
            className='relative rounded-m border border-border bg-darker'
          >
            <textarea
              className='font-mono min-h-[800px] w-full resize-none bg-transparent p-1 text-text caret-text outline-none'
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
            />
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
