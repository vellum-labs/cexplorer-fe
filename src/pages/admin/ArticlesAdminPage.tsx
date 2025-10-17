import { Button } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import Modal from "@/components/global/Modal";
import SpinningLoader from "@/components/global/SpinningLoader";
import GlobalTable from "@/components/table/GlobalTable";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { useAuthToken } from "@/hooks/useAuthToken";
import { fetchAdminArticle, useFetchAdminArticle } from "@/services/user";
import type { TableColumns } from "@/types/tableTypes";
import type {
  AdminArticleCreationResponse,
  AdminArticleListResponse,
} from "@/types/userTypes";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import parse from "html-react-parser";
import { useState } from "react";

import { Helmet } from "react-helmet";

export const ArticlesAdminPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>("");
  const token = useAuthToken();

  const query = useFetchAdminArticle({
    token,
    type: "list",
  }) as UseQueryResult<AdminArticleListResponse>;

  const data = query.data?.data.data;

  const columns: TableColumns<
    AdminArticleListResponse["data"]["data"][number]
  > = [
    {
      key: "name",
      title: "Name",
      render: item => (
        <Link
          className='text-primary'
          to='/admin/articles/$url'
          search={{ lang: item.lang }}
          params={{ url: item.url }}
        >
          {parse(item?.name)}
        </Link>
      ),
      widthPx: 100,
      visible: true,
    },
    {
      key: "lang",
      title: "Langugage",
      render: item => item.lang,
      widthPx: 100,
      visible: true,
    },
    {
      key: "pub_date",
      title: "Published Date",
      render: item => item.pub_date,
      widthPx: 100,
      visible: true,
    },
  ];

  const handleCreate = async () => {
    if (!token) return;
    const data = (await fetchAdminArticle({
      token,
      type: "create",
      lang: "en",
      body: {
        name,
        lng: "en",
        type: "article",
        render: "html",
      },
    })) as AdminArticleCreationResponse;

    navigate({
      to: `/admin/articles/${data.data.url}`,
    });
  };

  return (
    <>
      {showModal && (
        <Modal
          minWidth='95%'
          maxWidth='400px'
          maxHeight='95%'
          onClose={() => setShowModal(false)}
        >
          <div className='mt-4'>
            <TextInput
              placeholder='Article name'
              value={name}
              onchange={value => setName(value)}
            />
          </div>
          <Button
            label='Create'
            variant='primary'
            size='md'
            className='ml-auto mt-3'
            onClick={handleCreate}
          />
        </Modal>
      )}
      <div className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Admin articles | Cexplorer.io</title>
        </Helmet>
        <div className='flex w-full max-w-desktop flex-col items-center justify-center'>
          <BreadcrumbRaw className='mb-2 w-full'>
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
              <BreadcrumbItem className='text-text'>
                Admin Articles
              </BreadcrumbItem>
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
              <GlobalTable
                type='default'
                scrollable
                totalItems={data?.length}
                columns={columns}
                items={data}
                query={query}
              />
              <Button
                label='Create'
                variant='primary'
                size='md'
                className='mt-4'
                onClick={() => setShowModal(true)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
