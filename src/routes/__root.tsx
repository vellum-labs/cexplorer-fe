import { useNotFound } from "@/stores/useNotFound";
import {
  createRootRoute,
  Outlet,
  useLocation,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@vellumlabs/cexplorer-sdk";
import Footer from "../components/layouts/Footer";

import { SwReadyModal } from "@/components/global/modals/SwReadyModal";

import { VersionWatcher } from "@/components/global/VersionWatcher";
import Navbar from "@/components/layouts/Navbar";
import { ErrorBoundary } from "@/pages/error/ErrorBoundary";

import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useGenerateSW } from "@/hooks/useGenerateSW";
import { useState } from "react";
import { setGlobalAbortSignal } from "@/lib/handleFetch";
import { abortControllers } from "@/lib/handleAbortController";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { useFetchMiscBasic } from "@/services/misc";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootComponent = () => {
  const { notFound, setNotFound } = useNotFound();
  const location = useLocation();

  const { location: locationState } = useRouterState();

  const { theme } = useThemeStore();
  const { updateReady, isFirstInstall } = useGenerateSW();

  const [resetKey, setResetKey] = useState<number>(0);

  const miscBasic = useFetchMiscBasic();

  const miscBasicAds =
    !miscBasic.isLoading &&
    miscBasic?.data &&
    miscBasic?.data?.data?.ads &&
    Array.isArray(miscBasic?.data?.data?.ads) &&
    miscBasic?.data?.data?.ads.length > 0
      ? miscBasic?.data?.data?.ads
      : false;

  const TOP_ADS_TYPE = "top_featured";

  const topAds = miscBasicAds
    ? miscBasicAds.filter(item => item.type === TOP_ADS_TYPE)
    : undefined;

  const randomTopAd = topAds
    ? topAds[Math.floor(Math.random() * topAds.length)]
    : undefined;

  const prevLocationRef = useRef<{
    pathname: string;
    searchStr: string;
  } | null>(null);

  useEffect(() => {
    setResetKey(k => k + 1);
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotFound(false);
    }, 200);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [location.pathname, setNotFound]);

  useEffect(() => {
    const preloader = document.getElementById("preloader");

    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
  }, []);

  useEffect(() => {
    const appleTheme = document.querySelector(
      "meta[name='theme-color']",
    ) as HTMLMetaElement;

    if (appleTheme) {
      appleTheme.content = theme === "light" ? "#ffffff" : "#252933";
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(locationState.searchStr);
    const prevSearchParams = new URLSearchParams(
      prevLocationRef.current?.searchStr || "",
    );

    const currentTab = currentSearchParams.get("tab");
    const currentSubTab = currentSearchParams.get("subTab");
    const prevTab = prevSearchParams.get("tab");
    const prevSubTab = prevSearchParams.get("subTab");

    const shouldAbort =
      locationState.pathname !== prevLocationRef.current?.pathname ||
      currentTab !== prevTab ||
      currentSubTab !== prevSubTab;

    if (shouldAbort) {
      abortControllers.abortAll();
      const controller = abortControllers.create("GLOBAL");
      setGlobalAbortSignal(controller.signal);
    }

    prevLocationRef.current = {
      pathname: locationState.pathname,
      searchStr: locationState.searchStr,
    };
  }, [locationState.pathname, locationState.searchStr]);

  return (
    <>
      <Helmet>
        <title>Cexplorer.io</title>
      </Helmet>
      {randomTopAd && (
        <div className='flex min-h-[75px] w-full items-center justify-center bg-background'>
          <div
            className='h-full w-full max-w-desktop cursor-pointer'
            onClick={() => {
              window.open(randomTopAd.data.link, "_blank");
            }}
          >
            {randomTopAd.data.img ? (
              <img
                src={randomTopAd.data.img}
                alt={randomTopAd.data.title}
                className='h-[75px] w-full'
              />
            ) : (
              <div className='flex flex-col items-center p-1'>
                <h3>{randomTopAd.data.title}</h3>
                <span>{randomTopAd.data.text}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <ErrorBoundary key={resetKey}>
        <Navbar />
        {notFound ? (
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
        ) : (
          <Outlet />
        )}
      </ErrorBoundary>
      <Footer />
      {updateReady && <SwReadyModal firstInstall={isFirstInstall} />}
      <VersionWatcher />

      {/* <TanStackRouterDevtools /> */}
      {/* <ReactQueryDevtools /> */}
    </>
  );
};

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <RootComponent />
      </>
    );
  },
  notFoundComponent: NotFoundPage,
});
