import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";

import { Helmet } from "react-helmet";

export const ConfigAdminPage: FC = () => {
  return (
    <div className='flex min-h-minHeight flex-col gap-5 p-mobile md:p-desktop'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Admin config | Cexplorer.io</title>
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
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex flex-col gap-2'>
        <p>Config options:</p>
        <ul className='list-inside list-disc pl-2'>
          <li>
            <Link to='/admin/config/sw' className='text-primary'>
              Sw text
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
