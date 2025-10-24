import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "@/components/table/GlobalTable";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { useFetchAdminPage } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletStore } from "@/stores/walletStore";
import type { AdminPageListResponse } from "@/types/userTypes";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Helmet } from "react-helmet";

export const PagesAdminPage = () => {
  const { tokens } = useAuthTokensStore();
  const { address } = useWalletStore();
  const [token, setToken] = useState(tokens[address || ""]?.token);

  const query = useFetchAdminPage({
    token,
    type: "list",
  });
  const data = query.data?.data?.data as AdminPageListResponse["data"]["data"];

  const columns = [
    {
      key: "name",
      title: "Name",
      render: item => (
        <Link
          className='text-primary'
          to={`/admin/pages/${item?.url}`}
          search={{ lang: item.lang }}
        >
          {item?.name}
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
  ];

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  return (
    <div className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <title>Admin Pages | Cexplorer.io</title>
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
            /<BreadcrumbItem className='text-text'>Admin Pages</BreadcrumbItem>
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
          <GlobalTable
            type='default'
            scrollable
            totalItems={data?.length}
            columns={columns}
            items={data}
            query={query}
          />
        )}
      </div>
    </div>
  );
};
