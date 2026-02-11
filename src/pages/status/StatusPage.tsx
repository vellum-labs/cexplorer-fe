import type { FC } from "react";

import { PulsedBadge } from "@/components/ui/pulsedBadge";

import { useFetchMiscBasic, useFetchMiscHealth } from "@/services/misc";
import { useEffect, useState } from "react";

import { checkInternetSpeed } from "@/utils/checkInternetSpeed";
import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Check, CircleAlert, ExternalLink, X } from "lucide-react";
import { PageBase } from "@/components/global/pages/PageBase";

export const StatusPage: FC = () => {
  const [internetSpeed, setInternetSpeed] = useState<number>();

  const { data: miscBasic } = useFetchMiscBasic(true);
  const { data: miscHealth } = useFetchMiscHealth(true);

  const version = import.meta.env.VITE_APP_VERSION;
  const readOnlyMode = miscBasic?.data?.instance?.readonly;
  const server = miscBasic?.data?.instance?.server;
  const blockChainSync = miscHealth?.data?.data?.[0]?.blockchain?.time
    ? (Date.now() -
        new Date(
          convertUtcToLocal(miscHealth.data.data[0].blockchain.time),
        ).getTime()) /
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
    {
      title: "Services",
      badgeTitle: "",
      badgeColor: undefined,
      withoutPulse: false,
      isLink: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='status'
      title='Status'
      breadcrumbItems={[{ label: 'Status' }]}
      adsCarousel={false}
    >
      <div className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
          <h1>Status</h1>
          <p className='mt-1.5 font-regular text-grayTextPrimary'>
            Check and share your current status for quick troubleshooting.
          </p>
          {miscHealth?.data && (
            <div
              className={`mt-5 w-full max-w-[800px] rounded-m border p-3 ${
                miscHealth.data.is_healthy
                  ? "bg-greenText/10 border-greenText"
                  : "bg-redText/10 border-redText"
              }`}
            >
              <div className='flex items-center gap-2'>
                <div
                  className={`flex aspect-square w-[24px] items-center justify-center rounded-s ${
                    miscHealth.data.is_healthy ? "bg-greenText" : "bg-redText"
                  }`}
                >
                  {miscHealth.data.is_healthy ? (
                    <Check size={16} className='text-white' />
                  ) : (
                    <X size={16} className='text-white' />
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <span
                    className={`text-text-sm font-semibold ${
                      miscHealth.data.is_healthy
                        ? "text-greenText"
                        : "text-redText"
                    }`}
                  >
                    {miscHealth.data.is_healthy
                      ? "System is healthy"
                      : "System is experiencing issues"}
                  </span>
                  {!miscHealth.data.is_healthy &&
                    miscHealth.data.err.length > 0 && (
                      <div className='flex flex-col gap-1'>
                        {miscHealth.data.err.map((error, index) => (
                          <span
                            key={index}
                            className='text-text-sm text-redText'
                          >
                            • {error}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
          <div className='mt-5 flex w-full max-w-[800px] flex-col gap-3 rounded-m border border-border p-3'>
            <h3>Your status</h3>
            <div className='flex w-full flex-col gap-2'>
              {statuses.map(
                ({ badgeColor, badgeTitle, title, withoutPulse, isLink }) => (
                  <div className='flex flex-col justify-between gap-1/2 min-[450px]:flex-row min-[450px]:items-center min-[450px]:gap-0'>
                    <span className='text-text-sm font-medium text-grayTextPrimary'>
                      {title}
                    </span>
                    <div className='min-w-[170px]'>
                      {isLink ? (
                        <a
                          href='https://stats.uptimerobot.com/9DcoZ2jzDP'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 text-text-sm font-medium text-primary'
                        >
                          Status page
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <PulsedBadge
                          title={badgeTitle}
                          badgeColor={badgeColor}
                          withoutPulse={withoutPulse}
                        />
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className='border-t border-border pt-2'>
              <div className='flex min-h-[80px] w-full items-center gap-2 rounded-m bg-darker px-3 py-2'>
                <div className='flex aspect-square w-[44px] items-center justify-center rounded-s bg-cardBg'>
                  <CircleAlert size={15} className='text-primary' />
                </div>
                <span className='text-text-sm text-grayTextPrimary'>
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
    </PageBase>
  );
};
