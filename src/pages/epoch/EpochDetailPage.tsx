import { EpochLostAndCost } from "@/components/epoch/EpochLostAndCost";
import { EpochPots } from "@/components/epoch/EpochPots";
import { EpochSummary } from "@/components/epoch/EpochSummary";
import { EpochBlocks } from "@/components/epoch/tabs/EpochBlocks";
import { EpochDetailAnalytics } from "@/components/epoch/tabs/EpochDetailAnalytics";
import { EpochParameters } from "@/components/epoch/tabs/EpochParameters";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import Tabs from "@/components/global/Tabs";
import type { EpochStatsSummary } from "@/types/epochTypes";
import type { FC } from "react";

import { getRouteApi, useNavigate } from "@tanstack/react-router";

import { useMiscConst } from "@/hooks/useMiscConst";
import {
  useFetchEpochDetailParam,
  useFetchEpochDetailStats,
} from "@/services/epoch";
import { useFetchMiscBasic } from "@/services/misc";
import { PageBase } from "@/components/global/pages/PageBase";
import { addSeconds, format } from "date-fns";
import { epochLength } from "@/constants/confVariables";
import Button from "@/components/global/Button";

const EpochDetailPage: FC = () => {
  const route = getRouteApi("/epoch/$no");
  const { no } = route.useParams();

  const navigate = useNavigate();

  const {
    data: paramData,
    isLoading: isParamDataLoading,
    isError: isParamDataError,
  } = useFetchEpochDetailParam(+no);

  const {
    data: statsData,
    isLoading: isStatsDataLoading,
    isError: isStatsDataError,
  } = useFetchEpochDetailStats(+no);

  const { data: basicData, isLoading: isFetchMiscBasicLoading } =
    useFetchMiscBasic();
  const constData = useMiscConst(basicData?.data.version.const);

  const requestedEpoch = +no;
  const currentEpoch = constData?.epoch?.no ?? 0;
  const currentEpochStart = new Date(constData?.epoch?.start_time ?? 0);

  let futureStartTime: string | undefined;
  let futureEndTime: string | undefined;

  if (requestedEpoch > currentEpoch) {
    const epochsAhead = requestedEpoch - currentEpoch;

    const start = addSeconds(currentEpochStart, epochsAhead * epochLength);
    const end = addSeconds(start, epochLength);

    futureStartTime = format(start, "dd.MM.yyyy HH:mm");
    futureEndTime = format(end, "dd.MM.yyyy HH:mm");
  }

  const isLoading =
    !statsData ||
    !paramData ||
    isParamDataLoading ||
    isStatsDataLoading ||
    isFetchMiscBasicLoading ||
    isParamDataError ||
    isStatsDataError;

  const epochTabItems = [
    {
      key: "analytics",
      label: "Analytics",
      content: (
        <EpochDetailAnalytics
          stats={statsData as EpochStatsSummary}
          isLoading={isStatsDataLoading}
          isError={isStatsDataError}
        />
      ),
      visible: true,
    },
    {
      key: "blocks",
      label: "Blocks",
      content: <EpochBlocks no={+no} />,
      visible: true,
    },
    {
      key: "parameters",
      label: "Parameters",
      content: (
        <EpochParameters
          param={paramData}
          isError={isParamDataError}
          isLoading={isParamDataLoading}
        />
      ),
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='epochDetail'
      adsCarousel={false}
      metadataReplace={{
        before: "%epoch%",
        after: no,
      }}
      title='Epoch Detail'
      breadcrumbItems={[{ label: "Epochs", link: "/epoch" }, { label: no }]}
    >
      {futureStartTime && futureEndTime ? (
        <div className='flex min-h-[70vh] w-full items-center justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-center justify-center rounded-lg p-4 text-center'>
            <p className='text-sm'>
              Epoch <strong>{requestedEpoch}</strong> hasn’t started yet. It
              will start on <strong>{futureStartTime}</strong> and end on{" "}
              <strong>{futureEndTime}</strong>.
            </p>
            <p className='mt-2 text-sm'>
              The current epoch is <strong>{currentEpoch}</strong>.
            </p>
            <div className='mt-3 flex items-center gap-3'>
              <Button
                size='md'
                className='cursor-pointer px-2'
                variant='primary'
                label='Go Back'
                onClick={() => window.history.back()}
              />
              <Button
                size='md'
                className='cursor-pointer px-2'
                variant='tertiary'
                label='Current Epoch'
                onClick={() =>
                  navigate({
                    to: "/epoch/$no",
                    params: {
                      no: String(currentEpoch),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className='flex w-full justify-center'>
            <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-5 px-mobile md:px-desktop xl:flex-nowrap xl:justify-start'>
              <div className='flex grow basis-[980px] flex-wrap items-stretch gap-5'>
                {isLoading ? (
                  <>
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-8 py-4'
                    />
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-8 py-4'
                    />
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-8 py-4'
                    />
                  </>
                ) : (
                  <>
                    <EpochSummary
                      stats={statsData}
                      currentEpoch={constData?.no as number}
                    />
                    <EpochLostAndCost
                      params={paramData}
                      stats={statsData}
                      startTime={statsData.epoch?.start_time ?? ""}
                    />
                    <EpochPots stats={statsData} />
                  </>
                )}
              </div>
            </div>
          </section>
          <Tabs items={epochTabItems} />
        </>
      )}
    </PageBase>
  );
};

export default EpochDetailPage;
