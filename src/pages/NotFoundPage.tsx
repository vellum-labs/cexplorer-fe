import { useEffect, useState, type FC } from "react";

import { Button } from "@vellumlabs/cexplorer-sdk";

import { routeTree } from "@/routeTree.gen";
import { createRouter, useLocation, useNavigate } from "@tanstack/react-router";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscSearch } from "@/services/misc";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";

export const NotFoundPage: FC = () => {
  const { theme } = useThemeStore();
  const { locale } = useLocaleStore();

  const router = createRouter({ routeTree });

  const { pathname } = useLocation();
  const routesList = Object.keys(router.routesById);
  const navigate = useNavigate();

  const [route] = useState<string | undefined>(
    (() => {
      if (pathname.replace("/", "").startsWith("%24")) {
        return "address";
      }

      if (routesList.includes(pathname)) {
        return pathname;
      }

      const pathSegments = pathname.split("/").filter(Boolean);

      if (
        pathSegments.length < 2 ||
        !routesList.some(item => item.startsWith(`/${pathSegments[0]}/`))
      ) {
        return;
      }

      let finalRoute: string | undefined = undefined;

      const matchedRoutes = routesList
        .filter(item => item.includes(pathSegments[0]))
        .sort(
          (a, b) =>
            b.split("/").filter(Boolean).length -
            a.split("/").filter(Boolean).length,
        );

      for (const match of matchedRoutes) {
        const matchSplited = match.split("/").filter(Boolean);

        if (matchSplited.length <= pathSegments.length) {
          let isMatch = true;
          for (let i = 0; i < matchSplited.length; i++) {
            if (
              !matchSplited[i].startsWith("$") &&
              matchSplited[i] !== pathSegments[i]
            ) {
              isMatch = false;
              break;
            }
          }

          if (isMatch) {
            finalRoute =
              "/" + pathSegments.slice(0, matchSplited.length).join("/");
            break;
          }
        }
      }

      return finalRoute;
    })(),
  );

  const { data, isLoading } = useFetchMiscSearch(
    route === "address" ? pathname.replace("/%24", "") : undefined,
    "adahandle",
    locale,
  );

  useEffect(() => {
    if (route && route !== "address") {
      navigate({
        to: route,
      });
    }
  }, [route]);

  useEffect(() => {
    if (!isLoading && data && Array.isArray(data?.data) && data.data[0]?.url) {
      navigate({
        to: data.data[0]?.url,
      });
    }
  }, [data, isLoading]);

  return route === "address" ? (
    !isLoading &&
    (!data || !Array.isArray(data?.data) || !data.data[0]?.url) ? (
      <NotFoundInit />
    ) : (
      <div className='flex min-h-minHeight w-full flex-col items-center justify-center gap-1.5 text-text-xl'>
        <div className='flex h-fit w-full items-center justify-center'>
          <div
            className={`loader h-[60px] w-[60px] border-[6px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"} border-t-[6px]`}
          ></div>
        </div>
        <span className='text-text-md font-medium'>Finding ADAHandle...</span>
      </div>
    )
  ) : (
    <NotFoundInit />
  );
};

const NotFoundInit = () => (
  <div className='flex min-h-minHeight w-full flex-col items-center justify-center gap-2 text-text-xl'>
    <p>This page doesn't exist...</p>
    <Button
      label='Go back'
      variant='primary'
      size='md'
      href='/'
      className='hover:text-white'
    />
  </div>
);
