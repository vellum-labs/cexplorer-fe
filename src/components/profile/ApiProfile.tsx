import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import ReactECharts from "@/lib/ReactCharts";
import {
  useFetchUserApi,
  useFetchUserInfo,
  useMutateUserApi,
} from "@/services/user";
import type { UserApiObject } from "@/types/userTypes";
import { formatDate, formatNumber } from "@/utils/format/format";
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
import { Badge } from "../global/badges/Badge";
import Button from "../global/Button";
import Copy from "../global/Copy";
import SpinningLoader from "../global/SpinningLoader";
import { Tooltip } from "../ui/tooltip";
import { EmptyState } from "../global/EmptyState";
import ConnectWalletModal from "../wallet/ConnectWalletModal";
import { useAuthToken } from "@/hooks/useAuthToken";

export const ApiProfile = () => {
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
        toast.success("API key regenerated successfully.");
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
            primaryText='Wallet not connected.'
            secondaryText='Connect your wallet to access API dashboard and manage your API keys.'
            button={
              <Button
                label='Connect wallet'
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
          <h2>API dashboard</h2>
          <p className='text-grayTextPrimary'>
            Manage and monitor you Cexplorer API keys usage.
          </p>
        </div>
        <div className='flex gap-1 md:justify-end'>
          <Button
            label='Documentation'
            variant='tertiary'
            size='md'
            href='/api'
          />
          <Button
            label='New project'
            leftIcon={<Plus size={15} />}
            variant='primary'
            size='md'
            onClick={handleCreateKey}
            disabled={userQuery.isLoading || !!userData?.length}
          />
        </div>
      </section>
      <section className='mt-2 flex flex-wrap items-center gap-1.5 border-b border-border pb-2 text-sm md:gap-5'>
        <span className='mr-1'>Your account</span>
        <span className='flex items-center gap-1/2 text-grayTextPrimary'>
          {/* Your plan: <Badge color='gray'>{!nfts ? "Basic" : "PRO"}</Badge> */}
        </span>
        <Link
          to={
            "/profile?tab=pro" as FileRoutesByPath[keyof FileRoutesByPath]["path"]
          }
          className='gold-shimmer flex items-center gap-1/2 bg-purpleText bg-clip-text font-medium text-transparent underline hover:text-transparent'
        >
          NFTs held: <span className=''>{nfts}</span>
        </Link>
        <span className='flex items-center gap-1/2 text-grayTextPrimary'>
          API key limit: <span className='text-text'>1</span>
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
                className='rounded-md border border-border p-1'
              />
              <h2>You don't have any projects yet.</h2>
              <p className='max-w-[350px] text-center text-sm text-grayTextPrimary'>
                Start a new project to generate a new API keys, monitor your
                usage, and track your data.
              </p>
            </div>
          ) : (
            <>
              {userData?.map((apiKey, index) => (
                <div className='flex w-full flex-col gap-3 text-sm'>
                  {userData.length > 1 && <h1>#{index + 1}</h1>}
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>Plan</span>
                      <p className='text-sm font-light text-grayTextPrimary'>
                        Details about your API plan
                      </p>
                    </div>
                    <div className='flex w-full flex-col gap-1.5'>
                      <span className='flex'>
                        <span className='min-w-[150px] font-light text-grayTextPrimary'>
                          Project name
                        </span>{" "}
                        <span>{apiKey.name}</span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-light text-grayTextPrimary'>
                          My API plan
                        </span>{" "}
                        <span>
                          <Badge color='gray'>
                            {apiKey.type.slice(0, 1).toUpperCase() +
                              apiKey.type.slice(1)}
                          </Badge>
                        </span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-light text-grayTextPrimary'>
                          Limits
                        </span>{" "}
                        <span className='flex items-center gap-1/2'>
                          {apiKey.numerator}x boosted{" "}
                          <Tooltip
                            content={
                              <div className='flex w-[220px] flex-col gap-1'>
                                <p>
                                  This address holds {nfts} Cexplorer PRO NFTs.
                                </p>
                                <p>
                                  Your limits are {nfts}x the base limits in
                                  Basic API program.
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkCircledIcon />
                          </Tooltip>
                        </span>
                      </span>
                      <span className='flex'>
                        <span className='min-w-[150px] font-light text-grayTextPrimary'>
                          License
                        </span>{" "}
                        <span>
                          {userPlans && userPlans[apiKey.type]?.license}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>Limits</span>
                      <p className='text-sm font-light text-grayTextPrimary'>
                        API limits based on your plan. You can increase the
                        limits by upgrading your / by holding more Cexplorer PRO
                        NFTs.
                      </p>
                      {apiKey.type === "starter" && (
                        <Link
                          to='/api'
                          className='mt-1/2 flex items-center gap-1/2 font-medium text-primary'
                        >
                          Upgrade plan <Wand size={17} />
                        </Link>
                      )}
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                      <ProgressBar
                        value={apiKey.rqs_day}
                        max={(userTierPlan?.rq_day ?? 0) * apiKey.numerator}
                        title='Requests per day'
                      />
                      <ProgressBar
                        value={apiKey.tok_day}
                        max={(userTierPlan?.tok_day ?? 0) * apiKey.numerator}
                        title='Tokens'
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          Max requests per minute
                        </span>
                        <span className='font-light text-grayTextPrimary'>
                          {userTierPlan?.rq_min}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 border-b border-border pb-2 text-sm md:flex-row'>
                    <div className='flex flex-col gap-1 md:w-[300px]'>
                      <span className='font-medium'>API keys</span>
                      <p className='text-sm font-light text-grayTextPrimary'>
                        Your project’s API key. You can regenerate the key at
                        any time (disables the original key).
                      </p>
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <input
                          type={showKey ? "text" : "password"}
                          value={apiKey.key}
                          className='h-[42px] w-full rounded-md border border-border bg-transparent p-1 text-text'
                          readOnly
                        />
                        <button
                          onClick={() => setShowKey(!showKey)}
                          className='rounded-xl border border-border p-1'
                        >
                          {showKey ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Copy copyText={apiKey.key} />
                        <Button
                          label='Regenerate key'
                          size='md'
                          variant='tertiary'
                          leftIcon={<RotateCcw size={15} />}
                          onClick={() => handleRegenerateKey(apiKey.key)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex w-full flex-col gap-4 pb-2 text-sm lg:flex-row'>
                    <div className='flex flex-col gap-1 lg:w-[300px]'>
                      <span className='font-medium'>API usage</span>
                      <p className='text-sm font-light text-grayTextPrimary'>
                        Overview of the requests amount in time.
                      </p>
                    </div>
                    <div className='flex w-full flex-col justify-center gap-1 lg:w-[calc(100%-300px)]'>
                      <ActivityGraph data={apiKey.stat} />
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

const ActivityGraph = ({ data }: { data: UserApiObject["stat"] }) => {
  const { splitLineColor, textColor, bgColor, inactivePageIconColor } =
    useGraphColors();

  const option: ReactEChartsProps["option"] = {
    legend: {
      pageIconColor: textColor,
      pageIconInactiveColor: inactivePageIconColor,
      pageTextStyle: {
        color: textColor,
      },
      type: "scroll",
      data: ["Tokens", "Requests per day"],
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
      name: "Date",
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
        name: "Tokens",
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
        name: "Requests per day",
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
        No registered usage yet
      </div>
    );

  return <ReactECharts option={option} className='h-[350px] w-full' />;
};

const ProgressBar = ({ title, value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className='w-full text-sm'>
      <span className='font-medium'>{title}</span>
      <div className='relative my-1/2 h-2 w-full overflow-hidden rounded-[4px] bg-border'>
        <span
          className='absolute bottom-0 left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-primary'
          style={{ width: `${percentage}%` }}
        ></span>
      </div>
      <div className='flex w-full items-center justify-between text-xs text-grayTextPrimary'>
        <span>
          {value} / {formatNumber(max)}
        </span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};
