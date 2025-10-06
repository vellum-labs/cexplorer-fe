import type { FC } from "react";

import { PulsedBadge } from "@/components/ui/pulsedBadge";
import { Helmet } from "react-helmet";

import { useFetchMiscBasic } from "@/services/misc";
import { useEffect, useState } from "react";
import { useBlockList } from "@/hooks/tables/useBlockList";

import { checkInternetSpeed } from "@/utils/checkInternetSpeed";
import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import Copy from "@/components/global/Copy";
import { CircleAlert } from "lucide-react";

import metadata from "../../../conf/metadata/en-metadata.json";
import { webUrl } from "@/constants/confVariables";

export const StatusPage: FC = () => {
  const [internetSpeed, setInternetSpeed] = useState<number>();

  const { data: miscBasic } = useFetchMiscBasic(true);
  const { items } = useBlockList({ page: 1 });

  const version = import.meta.env.VITE_APP_VERSION;
  const readOnlyMode = miscBasic?.data?.instance?.readonly;
  const server = miscBasic?.data?.instance?.server;
  const blockChainSync = items
    ? (Date.now() - new Date(convertUtcToLocal(items[0].time)).getTime()) /
      1000 /
      60
    : undefined;

  useEffect(() => {
    checkInternetSpeed().then(data => setInternetSpeed(data));

    const intervalId = setInterval(() => {
      checkInternetSpeed().then(data => setInternetSpeed(data));
    }, 20000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const statuses = [
    {
      title: "Cexplorer software version",
      badgeTitle: `Version ${version ? "#" + version : "#9108"}`,
      badgeColor: undefined,
      withoutPulse: false,
    },
    {
      title: "Blockchain sync",
      badgeTitle: blockChainSync
        ? blockChainSync < 5
          ? "Synchronized"
          : `Delayed - ${Math.round(blockChainSync)} minutes`
        : "Disconnected",
      badgeColor: blockChainSync
        ? blockChainSync < 5
          ? undefined
          : "bg-yellowText"
        : "bg-redText",
      withoutPulse: false,
    },
    {
      title: "Your internet connection",
      badgeTitle:
        typeof internetSpeed !== "undefined"
          ? internetSpeed + "ms"
          : "Disconnected",
      badgeColor:
        typeof internetSpeed === "undefined"
          ? "bg-redText"
          : internetSpeed > 100
            ? "bg-yellowText"
            : internetSpeed > 500
              ? "bg-redText"
              : undefined,
      withoutPulse: false,
    },
    // {
    //   title: "Your CF ray ID",
    //   badgeTitle: `8e895ccef8e062cd-HAM`,
    //   badgeColor: undefined,
    //   withoutPulse: true,
    // },
    {
      title: "Read only mode",
      badgeTitle: readOnlyMode ? "True" : `False`,
      badgeColor: readOnlyMode ? "bg-yellowText" : undefined,
      withoutPulse: false,
    },
    {
      title: "Server",
      badgeTitle: server ?? "",
      badgeColor: undefined,
      withoutPulse: false,
    },
  ];

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{metadata.status.title}</title>
        <meta name='description' content={metadata.status.description} />
        <meta name='keywords' content={metadata.status.keywords} />
        <meta property='og:title' content={metadata.status.title} />
        <meta property='og:description' content={metadata.status.description} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <div className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h1>Status</h1>
          <p className='mt-3 font-light text-grayTextPrimary'>
            Check and share your current status for quick troubleshooting.
          </p>
          <div className='mt-10 flex w-full max-w-[800px] flex-col gap-6 rounded-lg border border-border p-3'>
            <h3>Your status</h3>
            <div className='flex w-full flex-col gap-4'>
              {statuses.map(
                ({ badgeColor, badgeTitle, title, withoutPulse }) => (
                  <div className='flex flex-col justify-between gap-1 min-[450px]:flex-row min-[450px]:items-center min-[450px]:gap-0'>
                    <span className='text-sm font-medium text-grayTextPrimary'>
                      {title}
                    </span>
                    <div className='min-w-[170px]'>
                      <PulsedBadge
                        title={badgeTitle}
                        badgeColor={badgeColor}
                        withoutPulse={withoutPulse}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className='border-t border-border pt-2'>
              <div className='flex min-h-[80px] w-full items-center gap-4 rounded-lg bg-darker px-3 py-2'>
                <div className='flex aspect-square w-[44px] items-center justify-center rounded-md bg-cardBg'>
                  <CircleAlert size={15} className='text-primary' />
                </div>
                <span className='text-sm text-grayTextPrimary'>
                  If something isn’t working as expected, please copy your
                  current status details and reach out to us on{" "}
                  <a
                    href='https://x.com/cexplorer_io'
                    target='_blank'
                    className='text-primary underline underline-offset-2'
                  >
                    Twitter
                  </a>{" "}
                  or{" "}
                  <a
                    href='https://discord.com/invite/zTaSd8wfEV'
                    target='_blank'
                    className='text-primary underline underline-offset-2'
                  >
                    Discord
                  </a>
                  . We're here to help!
                </span>
              </div>
            </div>
            <div className='flex w-full justify-end'>
              <Copy
                copyText={`Version: ${version ? "#" + version : "#9108"},Blockchain sync: ${
                  blockChainSync
                    ? blockChainSync < 5
                      ? "Synchronized"
                      : `Delayed - ${Math.round(blockChainSync)} minutes`
                    : "Disconnected"
                }, Your internet connection: ${
                  typeof internetSpeed !== "undefined"
                    ? internetSpeed + "ms"
                    : "Disconnected"
                }, Read only mode: ${readOnlyMode ? "True" : `False`}, Server: ${server ?? ""}`}
                showText='Copy status'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
