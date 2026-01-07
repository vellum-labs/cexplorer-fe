import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { useFetchUserInfo } from "@/services/user";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

export const AdminPage = () => {
  const userQuery = useFetchUserInfo();
  const userData = userQuery.data?.data;

  const adminRight = userData?.power?.includes("pageAdmin");
  const articleAdmin = userData?.power?.includes("articleAdmin");
  const configAdmin = userData?.power?.includes("softConfig");

  const hasAdminRights = adminRight || articleAdmin || configAdmin;

  return (
    <main className='relative flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
      <Helmet>
        <title>Admin | Cexplorer.io</title>
      </Helmet>
      <section className='w-full max-w-desktop'>
        <BreadcrumbRaw className=''>
          <BreadcrumbList className='flex items-center'>
            <BreadcrumbItem>
              <Link className='underline underline-offset-2' to='/'>
                Home
              </Link>
            </BreadcrumbItem>
            / <BreadcrumbItem className='text-text'>Admin</BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRaw>
        {userQuery.isLoading ? (
          <div className='mt-4 flex w-full justify-center'>
            <SpinningLoader />
          </div>
        ) : !hasAdminRights && !userQuery.isLoading ? (
          <p className='mt-4 flex w-full justify-center'>
            You don't have admin permission.
          </p>
        ) : (
          <div className='mt-4 flex w-full justify-center gap-2 text-primary'>
            {adminRight && (
              <Link className='text-text-lg' to='/admin/pages'>
                Pages
              </Link>
            )}
            {articleAdmin && (
              <Link className='text-text-lg' to='/admin/articles'>
                Articles
              </Link>
            )}
            {articleAdmin && (
              <Link className='text-text-lg' to='/admin/wiki'>
                Wiki
              </Link>
            )}
            {configAdmin && (
              <Link className='text-text-lg' to='/admin/config'>
                Config
              </Link>
            )}
            {configAdmin && (
              <Link className='text-text-lg' to='/admin/groups'>
                Groups
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
};
