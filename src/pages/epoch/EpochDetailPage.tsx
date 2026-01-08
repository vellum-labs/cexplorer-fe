import { EpochLostAndCost } from "@/components/epoch/EpochLostAndCost";
import { EpochPots } from "@/components/epoch/EpochPots";
import { EpochSummary } from "@/components/epoch/EpochSummary";
import { EpochBlocks } from "@/components/epoch/tabs/EpochBlocks";
import { EpochDetailAnalytics } from "@/components/epoch/tabs/EpochDetailAnalytics";
import { EpochParameters } from "@/components/epoch/tabs/EpochParameters";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
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
import { Button } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const EpochDetailPage: FC = () => {
  const { t } = useAppTranslation("pages");
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
      label: t("epochs.tabs.analytics"),
      content: (
        <EpochDetailAnalytics
          stats={statsData as EpochStatsSummary}
          isLoading={isStatsDataLoading}
          isError={isStatsDataError}
          constData={constData}
        />
      ),
      visible: true,
    },
    {
      key: "blocks",
      label: t("epochs.tabs.blocks"),
      content: <EpochBlocks no={+no} />,
      visible: true,
    },
    {
      key: "parameters",
      label: t("epochs.tabs.parameters"),
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
      title={t("epochs.detail")}
      breadcrumbItems={[{ label: t("epochs.title"), link: "/epoch" }, { label: no }]}
      homepageAd
    >
      {futureStartTime && futureEndTime ? (
        <div className='flex min-h-[70vh] w-full items-center justify-center'>
          <div className='flex w-full max-w-desktop flex-col items-center justify-center rounded-m p-2 text-center'>
            <p className='text-text-sm'>
              Epoch <strong>{requestedEpoch}</strong> hasn’t started yet. It
              will start on <strong>{futureStartTime}</strong> and end on{" "}
              <strong>{futureEndTime}</strong>.
            </p>
            <p className='mt-1 text-text-sm'>
              The current epoch is <strong>{currentEpoch}</strong>.
            </p>
            <div className='mt-1.5 flex items-center gap-1.5'>
              <Button
                size='md'
                className='cursor-pointer px-1'
                variant='primary'
                label='Go Back'
                onClick={() => window.history.back()}
              />
              <Button
                size='md'
                className='cursor-pointer px-1'
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
            <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile md:px-desktop xl:flex-nowrap xl:justify-start'>
              <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
                {isLoading ? (
                  <>
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-4 py-2'
                    />
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-4 py-2'
                    />
                    <LoadingSkeleton
                      height='227px'
                      rounded='xl'
                      className='grow basis-[300px] px-4 py-2'
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
                    <EpochPots stats={statsData} constData={constData} />
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
