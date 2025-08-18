import type { FC } from "react";

import Button from "@/components/global/Button";

import { routeTree } from "@/routeTree.gen";
import { createRouter, useLocation, useNavigate } from "@tanstack/react-router";

export const NotFoundPage: FC = () => {
  const router = createRouter({ routeTree });

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const routesList = Object.keys(router.routesById);

  const mostRelevantRoute = (
    pathname: string,
    routesList: string[],
  ): string | undefined => {
    if (routesList.includes(pathname)) {
      return pathname;
    }

    const pathSegments = pathname.split("/").filter(Boolean);

    if (
      pathSegments.length < 2 ||
      !routesList.includes(`/${pathSegments[0]}/`)
    ) {
      return undefined;
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
  };

  const route = mostRelevantRoute(pathname, routesList);

  if (route) {
    navigate({
      to: route,
    });
  }

  return (
    <div className='flex min-h-minHeight w-full flex-col items-center justify-center gap-4 text-xl'>
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
};
