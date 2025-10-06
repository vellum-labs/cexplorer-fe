import { Badge } from "@/components/global/badges/Badge";
import Button from "@/components/global/Button";
import PulseDot from "@/components/global/PulseDot";
import DateCell from "@/components/table/DateCell";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { colors } from "@/constants/colors";
import { useGraphColors } from "@/hooks/useGraphColors";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchPollList } from "@/services/misc";
import { useFetchUserInfo, useMutatePollVote } from "@/services/user";
import { useNotFound } from "@/stores/useNotFound";
import { useWalletStore } from "@/stores/walletStore";
import { formatDate } from "@/utils/format/format";
import { getRouteApi } from "@tanstack/react-router";
import EChartsReact from "echarts-for-react";
import parse from "html-react-parser";
import { Info, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageBase } from "@/components/global/pages/PageBase";

export const PollDetailPage = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const { address } = useWalletStore();
  const [isSet, setIsSet] = useState(false);
  const [progress, setProgress] = useState(0);
  const optionRef = useRef<string | null>(null);
  const { mutateAsync } = useMutatePollVote();
  const route = getRouteApi("/polls/$poll");
  const { poll } = route.useParams();
  const { data: userData } = useFetchUserInfo();
  const nfts = userData?.data.membership.nfts;
  const listQuery = useFetchPollList();
  const data = listQuery.data?.data;
  const pollDetail = data?.find(p => p.url === poll);
  const totalVoteCount = Object.values(pollDetail?.result ?? {}).reduce(
    (acc, curr) => acc + curr.power,
    0,
  );

  const renderStatusBadge = (status: "available" | "closed" | undefined) => {
    if (status === "available") {
      return (
        <Badge color='gray' className='gap-1'>
          <PulseDot />
          Live
        </Badge>
      );
    }
    return <Badge color='gray'>Closed</Badge>;
  };

  const handleVote = () => {
    if (!optionRef.current) return;

    if (!address) {
      setOpenWalletModal(true);
      return;
    }

    mutateAsync({
      option: optionRef.current,
      poll: poll,
    })
      .then(() => {
        toast.success("Vote casted successfully");
        listQuery.refetch();
      })
      .catch(error => {
        if (String(error).includes("read-only")) return;
        toast.error("Error casting vote");
      });
  };

  useEffect(() => {
    if (pollDetail?.date_start && pollDetail?.date_end) {
      const startDate = new Date(pollDetail.date_start);
      const endDate = new Date(pollDetail.date_end);
      const now = new Date();

      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedTime = now.getTime() - startDate.getTime();
      const progressPercentage = Math.min(
        (elapsedTime / totalDuration) * 100,
        100,
      );

      setProgress(progressPercentage);
    }
  }, [pollDetail]);

  if (!pollDetail && !listQuery.isLoading) {
    useNotFound.getState().setNotFound(true);
  }

  return (
    <>
      {openWalletModal && (
        <ConnectWalletModal onClose={() => setOpenWalletModal(false)} />
      )}
      <PageBase
        metadataTitle='title'
        metadataReplace={{
          before: "%poll%",
          after: poll,
        }}
        title='Poll detail'
        breadcrumbItems={[
          { label: "Polls", link: "/polls" },
          { label: pollDetail?.name },
        ]}
      >
        <div className='flex w-full max-w-desktop flex-col gap-3 px-mobile pb-3 md:flex-row md:px-desktop'>
          <section className='order-2 flex flex-col gap-1 rounded-l border border-border p-2 md:order-none'>
            <h2 className='mb-1'>{pollDetail?.name}</h2>
            <span className='text-text-sm font-regular text-grayTextSecondary'>
              Description
            </span>
            <div>{parse(pollDetail?.description ?? "")}</div>
            <div className='mt-3 flex gap-1 bg-darker p-2 text-text-sm text-grayTextPrimary'>
              <div className='flex h-7 w-7 items-center justify-center rounded-s border border-border bg-background p-1/2'>
                <Info size={20} color={colors.darkBlue} />
              </div>
              <div>
                <span className=''>
                  Your voting power:{" "}
                  <span className='font-medium'>
                    {nfts} votes ({nfts} NFTs)
                  </span>
                </span>
                <p className='mt-1'>
                  All wallets can vote, and voting power is determined by a
                  snapshot taken when voting ends—any NFTs acquired before then
                  will count.
                </p>
              </div>
            </div>
            <span className='mb-1/2 mt-3 text-text-sm font-regular text-grayTextSecondary'>
              Voting
            </span>
            <RadioGroup
              onValueChange={value => {
                optionRef.current = value;
              }}
              defaultValue='0'
              className='mb-3 flex flex-col gap-2'
            >
              {pollDetail?.options.map((option, i) => (
                <div
                  key={option}
                  className='flex cursor-pointer items-center space-x-2'
                  onClick={() => setIsSet(true)}
                >
                  <RadioGroupItem
                    disabled={
                      !!pollDetail.vote?.option || pollDetail.state === "closed"
                    }
                    value={option}
                    id={option}
                  />
                  <Label htmlFor={option}>
                    <span className='mr-1/2 text-grayTextSecondary'>
                      Option {i + 1}:
                    </span>{" "}
                    {parse(option)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {pollDetail?.vote ? (
              <p className='text-text-md'>
                <span className='text-greenText'>✓ Voted:</span>{" "}
                {pollDetail.vote.option}
              </p>
            ) : (
              <Button
                size='md'
                variant='primary'
                label={
                  pollDetail?.state === "closed" ? "Poll ended" : "Cast vote"
                }
                rightIcon={<Send size={17} />}
                onClick={handleVote}
                disabled={!isSet || pollDetail?.state === "closed"}
              />
            )}
          </section>
          <div className='flex min-w-[350px] flex-col gap-3'>
            <section className='order-1 flex w-full flex-col gap-1/2 rounded-l border border-border p-2 text-text-xs md:order-none'>
              <div className='mb-2 flex w-full items-center justify-between'>
                <h3>Status</h3> {renderStatusBadge(pollDetail?.state)}
              </div>
              <div className='flex justify-between text-text-xs'>
                <span className='text-grayTextPrimary'>Ends in</span>
                <DateCell className='text-text-xs' time={pollDetail?.date_end} />
              </div>
              <div className='h-2.5 w-full rounded-max bg-border'>
                <div
                  className='h-2.5 rounded-max bg-darkBlue'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {pollDetail?.date_start && pollDetail?.date_end && (
                <div className='flex w-full justify-between text-[10px] text-grayTextPrimary'>
                  <span>{formatDate(pollDetail?.date_start)}</span>
                  <span>{formatDate(pollDetail?.date_end)}</span>
                </div>
              )}
            </section>
            <section className='order-3 w-full rounded-l border border-border p-2 md:order-none'>
              <h3>Votes submitted</h3>
              <ResultsChart
                data={pollDetail?.result}
                totalVotes={totalVoteCount}
              />
            </section>
          </div>
        </div>
      </PageBase>
    </>
  );
};

const graphColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#57f96d",
  "#9966FF",
  "#e78625",
  "#C9CBCF",
];

const CustomLegend = ({
  data,
}: {
  data: Record<string, { power: number; count: number }> | undefined | null;
}) => {
  if (!data) return null;
  const totalVotePower = Object.values(data).reduce(
    (acc, curr) => acc + curr.power,
    0,
  );

  const totalVoteCount = Object.values(data).reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div className='mt-3 flex flex-col gap-1 text-text-sm text-grayTextSecondary'>
      <div className='flex justify-between'>
        Total voters{" "}
        <span className='text-grayTextPrimary'>{totalVoteCount}</span>
      </div>
      <div className='flex justify-between border-b border-border pb-1'>
        Total voting power{" "}
        <span className='text-grayTextPrimary'>{totalVotePower}</span>
      </div>
      {Object.entries(data).map(([key, value], index) => {
        const percentage = ((value.power / totalVotePower) * 100).toFixed(2);
        return (
          <div
            key={key}
            className='flex items-center gap-1 text-text-sm text-grayTextSecondary'
          >
            <div
              className={`h-3 w-3 rounded-full`}
              style={{
                backgroundColor: graphColors[index % graphColors.length],
              }}
            />
            <span className='w-[100px]'>{parse(key)}</span>{" "}
            <span className='text-grayTextPrimary'>{value.power} votes</span>
            <span>({percentage}%)</span>
            <span className='text-text-xs'>{value.count} voters</span>
          </div>
        );
      })}
    </div>
  );
};

const ResultsChart = ({
  data,
}: {
  data: Record<string, { power: number; count: number }> | undefined | null;
  totalVotes: number;
}) => {
  const { textColor } = useGraphColors();
  const pieData = Object.entries(data ?? {}).map(([key, value], i) => ({
    value: value.power,
    name: key,
    itemStyle: {
      color: graphColors[i % graphColors.length],
    },
  }));

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "item",
      confine: true,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "90%"],
        data: pieData,
        tooltip: {
          trigger: "item",
          confine: true,
        },
        label: {
          show: false,
          color: textColor,
        },
      },
    ],
  };

  return (
    <>
      <CustomLegend data={data} />
      <EChartsReact className='w-full' option={option} />
    </>
  );
};
