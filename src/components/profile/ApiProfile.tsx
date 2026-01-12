import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import ReactECharts from "@/lib/ReactCharts";
import {
  useFetchUserApi,
  useFetchUserInfo,
  useMutateUserApi,
} from "@/services/user";
import type { UserApiObject } from "@/types/userTypes";
import { formatDate, formatNumber } from "@vellumlabs/cexplorer-sdk";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Search,
  Wand,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { EmptyState } from "@vellumlabs/cexplorer-sdk";
import { ProBadge } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "../wallet/ConnectWalletModal";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ApiProfile = () => {
  const { t } = useAppTranslation("common");
  const [showKey, setShowKey] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const token = useAuthToken();

  const { data } = useFetchUserInfo();
  const nfts = data?.data?.membership?.nfts || 0;
  const userQuery = useFetchUserApi();
  const userPlans = userQuery.data?.data?.plans;
  const userData = userQuery.data?.data?.data;
  const { mutateAsync } = useMutateUserApi();

  const handleCreateKey = async () => {
    mutateAsync({ state: "new" }).then(() => {
      userQuery.refetch();
    });
  };

  const handleRegenerateKey = async (key: string) => {
    mutateAsync({ state: "disable", key: key }).then(() => {
      mutateAsync({ state: "enable", key: key }).then(() => {
        userQuery.refetch();
        toast.success(t("profile.api.keyRegenerated"));
      });
    });
  };

  const userTierPlan = nfts > 0 ? userPlans?.basic : userPlans?.starter;

  // Show empty state when wallet is not connected
  if (!token) {
    return (
      <>
        {showConnectModal && (
          <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
        )}
        <div className='flex w-full max-w-desktop flex-col'>
          <EmptyState
            icon={<Wallet size={24} />}
            primaryText={t("profile.walletNotConnected")}
            secondaryText={t("profile.api.connectToAccess")}
            button={
              <Button
                label={t("profile.connectWallet")}
                variant='primary'
                size='md'
                onClick={() => setShowConnectModal(true)}
              />
            }
          />
        </div>
      </>
    );
  }

  return (
    <div className='flex max-w-desktop flex-col'>
      <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col'>
          <h2>{t("profile.api.dashboard")}</h2>
          <p className='text-grayTextPrimary'>
            {t("profile.api.manageAndMonitor")}
          </p>
        </div>
        <div className='flex gap-1 md:justify-end'>
          <Button
            label={t("profile.api.documentation")}
            variant='tertiary'
            size='md'
            href='/api'
          />
          <Button
            label={t("profile.api.newProject")}
            leftIcon={<Plus size={15} />}
            variant='primary'
            size='md'
            onClick={handleCreateKey}
            disabled={userQuery.isLoading || !!userData?.length}
          />
        </div>
      </section>
      <section className='mt-2 flex flex-wrap items-center gap-1.5 border-b border-border pb-2 text-text-sm md:gap-5'>
        <span className='mr-1'>{t("profile.yourAccount")}</span>
        <span className='flex items-center gap-1/2 text-grayTextPrimary'>
          {/* Your plan: <Badge color='gray'>{!nfts ? "Basic" : "PRO"}</Badge> */}
        </span>
        {!nfts ? (
          <ProBadge get />
        ) : (
          <Link
            to={
              "/profile?tab=pro" as FileRoutesByPath[keyof FileRoutesByPath]["path"]
            }
            className='gold-shimmer flex items-center gap-1/2 bg-purpleText bg-clip-text font-medium text-transparent underline hover:text-transparent'
          >
            {t("profile.nftsHeld")}: <span className=''>{nfts}</span>
          </Link>
        )}
        <span className='flex items-center gap-1/2 text-grayTextPrimary'>
          {t("profile.apiKeyLimit")}: <span className='text-text'>1</span>
        </span>
      </section>
      {userQuery.isLoading ? (
        <div className='mt-12 flex w-full justify-center'>
          <SpinningLoader />
        </div>
      ) : (
        <section className='mt-2 flex w-full justify-center'>
          {userData?.length === 0 ? (
            <div className='flex flex-col items-center gap-1'>
              <Search
                size={40}
                className='rounded-s border border-border p-1'
              />
              <h2>{t("profile.api.noProjects")}</h2>
              <p className='max-w-[350px] text-center text-text-sm text-grayTextPrimary'>
                {t("profile.api.startNewProject")}
              </p>
            </div>
          ) : (
            <>
              {userData?.map((apiKey, index) => (
                <div className='flex w-full flex-col gap-3 text-text-sm'>
                  {userData.length > 1 && <h1>#{index + 1}</h1>}
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>{t("profile.api.plan")}</span>
                      <p className='text-text-sm font-regular text-grayTextPrimary'>
                        {t("profile.api.planDetails")}
                      </p>
                    </div>
                    <div className='flex w-full flex-col gap-1.5'>
                      <span className='flex'>
                        <span className='min-w-[150px] font-regular text-grayTextPrimary'>
                          {t("profile.api.projectName")}
                        </span>{" "}
                        <span>{apiKey.name}</span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-regular text-grayTextPrimary'>
                          {t("profile.api.myApiPlan")}
                        </span>{" "}
                        <span>
                          <Badge color='gray'>
                            {apiKey.type.slice(0, 1).toUpperCase() +
                              apiKey.type.slice(1)}
                          </Badge>
                        </span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-regular text-grayTextPrimary'>
                          {t("profile.api.limits")}
                        </span>{" "}
                        <span className='flex items-center gap-1/2'>
                          {t("profile.api.boosted", { count: apiKey.numerator })}{" "}
                          <Tooltip
                            content={
                              <div className='flex w-[220px] flex-col gap-1'>
                                <p>
                                  {t("profile.api.nftsHeldTooltip", { count: nfts })}
                                </p>
                                <p>
                                  {t("profile.api.limitsBoostTooltip", { count: nfts })}
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkCircledIcon />
                          </Tooltip>
                        </span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-regular text-grayTextPrimary'>
                          {t("profile.api.license")}
                        </span>{" "}
                        <span>
                          {userPlans && userPlans[apiKey.type]?.license}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>{t("profile.api.limits")}</span>
                      <p className='text-text-sm font-regular text-grayTextPrimary'>
                        {t("profile.api.limitsDescription")}
                      </p>
                      {apiKey.type === "starter" && (
                        <Link
                          to='/api'
                          className='mt-1/2 flex items-center gap-1/2 font-medium text-primary'
                        >
                          {t("profile.api.upgradePlan")} <Wand size={17} />
                        </Link>
                      )}
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                      <ProgressBar
                        value={apiKey.rqs_day}
                        max={(userTierPlan?.rq_day ?? 0) * apiKey.numerator}
                        title={t("profile.api.requestsPerDay")}
                      />
                      <ProgressBar
                        value={apiKey.tok_day}
                        max={(userTierPlan?.tok_day ?? 0) * apiKey.numerator}
                        title={t("profile.api.tokens")}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {t("profile.api.maxRequestsPerMinute")}
                        </span>
                        <span className='font-regular text-grayTextPrimary'>
                          {userTierPlan?.rq_min}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 text-text-sm md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>{t("profile.api.apiKeys")}</span>
                      <p className='text-text-sm font-regular text-grayTextPrimary'>
                        {t("profile.api.apiKeysDescription")}
                      </p>
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <input
                          type={showKey ? "text" : "password"}
                          value={apiKey.key}
                          className='h-[42px] w-full rounded-s border border-border bg-transparent p-1 text-text'
                          readOnly
                        />
                        <button
                          onClick={() => setShowKey(!showKey)}
                          className='rounded-l border border-border p-1'
                        >
                          {showKey ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Copy copyText={apiKey.key} />
                        <Button
                          label={t("profile.api.regenerateKey")}
                          size='md'
                          variant='tertiary'
                          leftIcon={<RotateCcw size={15} />}
                          onClick={() => handleRegenerateKey(apiKey.key)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 pb-2 text-text-sm lg:flex-row'>
                    <div className='flex flex-col gap-1 lg:w-[300px]'>
                      <span className='font-medium'>{t("profile.api.apiUsage")}</span>
                      <p className='text-text-sm font-regular text-grayTextPrimary'>
                        {t("profile.api.apiUsageDescription")}
                      </p>
                    </div>
                    <div className='flex w-full flex-col justify-center gap-1 lg:w-[calc(100%-300px)]'>
                      <ActivityGraph data={apiKey.stat} t={t} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </section>
      )}
    </div>
  );
};

const ActivityGraph = ({ data, t }: { data: UserApiObject["stat"]; t: (key: string) => string }) => {
  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const tokensLabel = t("profile.api.tokens");
  const requestsPerDayLabel = t("profile.api.requestsPerDay");

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: [tokensLabel, requestsPerDayLabel],
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
    },
    grid: {
      top: 40,
      right: 10,
      bottom: 40,
      left: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data?.map(({ date }) => formatDate(date, true)),
      name: t("profile.api.date"),
      nameLocation: "middle",
      nameGap: 28,
      boundaryGap: false,
      axisLabel: {
        color: textColor,
      },
      axisLine: {
        lineStyle: {
          color: textColor,
        },
      },
    },
    yAxis: [
      {
        type: "value",
        id: "0",
        nameGap: 40,
        axisLabel: {
          color: textColor,
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      {
        type: "value",
        position: "right",
        id: "1",
        show: false,
        axisLabel: {
          color: textColor,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
      },
    ],
    series: [
      {
        type: "line",
        data: data?.map(({ tok }) => tok),
        name: tokensLabel,
        yAxisIndex: 0,
        lineStyle: {
          color: textColor,
          width: 2,
        },
        showSymbol: false,
        itemStyle: {
          color: textColor,
        },
      },
      {
        type: "line",
        data: data?.map(({ rqs }) => rqs),
        name: requestsPerDayLabel,
        yAxisIndex: 1,
        lineStyle: {
          color: "#0094D4",
          width: 2,
        },
        showSymbol: false,
        itemStyle: {
          color: "#0094D4",
        },
      },
    ],
  };

  if (!data)
    return (
      <div className='flex w-full items-center lg:justify-center'>
        {t("profile.api.noRegisteredUsage")}
      </div>
    );

  return <ReactECharts option={option} className='h-[350px] w-full' />;
};

const ProgressBar = ({ title, value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className='w-full text-text-sm'>
      <span className='font-medium'>{title}</span>
      <div className='relative my-1/2 h-2 w-full overflow-hidden rounded-[4px] bg-border'>
        <span
          className='absolute bottom-0 left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-primary'
          style={{ width: `${percentage}%` }}
        ></span>
      </div>
      <div className='flex w-full items-center justify-between text-text-xs text-grayTextPrimary'>
        <span>
          {value} / {formatNumber(max)}
        </span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};
