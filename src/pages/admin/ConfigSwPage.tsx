import type { FC } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import { Button } from "@vellumlabs/cexplorer-sdk";

import SyntaxHighlighter from "react-syntax-highlighter";
import { SwReadyModal } from "@/components/global/modals/SwReadyModal";

import {
  nord,
  qtcreatorLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthToken } from "@/hooks/useAuthToken";
import { fetchSwText, useFetchSwText } from "@/services/config";

import { toast } from "sonner";

import { Helmet } from "react-helmet";

export const ConfigSwPage: FC = () => {
  const [content, setContent] = useState<string>("{}");
  const [test, setTest] = useState<boolean>(false);

  const token = useAuthToken();

  const { data } = useFetchSwText(token);

  const { theme } = useThemeStore();

  useEffect(() => {
    if (data?.data) {
      const contentData = {
        data: {
          ...data.data.message,
        },
      };
      setContent(JSON.stringify(contentData));
    }
  }, [data?.data]);

  const handleUpdate = async () => {
    fetchSwText(token, "update", content)
      .then(() => {
        toast.success("Successfully updated!");
      })
      .catch(() => {
        toast.error("Error while saving.");
      });
  };

  return (
    <main className='relative flex min-h-minHeight max-w-desktop flex-col gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Admin sw | Cexplorer.io</title>
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
            <Link className='underline underline-offset-2' to={"/admin/config"}>
              Config
            </Link>
          </BreadcrumbItem>
          /<BreadcrumbItem className='text-text'>SW text</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        role='button'
        className='relative rounded-m border border-border bg-darker'
      >
        <textarea
          className='font-mono absolute inset-0 w-full resize-none overflow-hidden bg-transparent p-1 text-transparent caret-text outline-none'
          value={JSON.stringify(JSON.parse(content), undefined, 2)}
          onChange={e => setContent(e.target.value)}
          spellCheck={false}
        />
        <SyntaxHighlighter
          language='html'
          style={theme === "dark" ? nord : qtcreatorLight}
          className='min-h-minHeight overflow-auto text-text'
          wrapLongLines
        >
          {JSON.stringify(JSON.parse(content), undefined, 2)}
        </SyntaxHighlighter>
      </div>
      <div className='flex items-center justify-end gap-1'>
        <Button
          label='Test'
          size='lg'
          variant='tertiary'
          className='self-end'
          onClick={() => setTest(true)}
        />
        <Button
          label='Save'
          size='lg'
          variant='primary'
          className='self-end'
          onClick={handleUpdate}
        />
      </div>
      {test && (
        <SwReadyModal
          firstInstall={false}
          testMessage={JSON.parse(content)}
          onClose={() => setTest(false)}
        />
      )}
    </main>
  );
};
