import { colors } from "@/constants/colors";
import type { ScriptDetailResponse } from "@/types/scriptTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import type { UseQueryResult } from "@tanstack/react-query";
import { FileBarChart, LineChart } from "lucide-react";
import { AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { LabelBadge } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { OverviewStatCard } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TextDisplay } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "../tx/HashCell";
import { AttributeDropdown } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { ScriptVerifyBadge } from "../tx/ScriptVerifyBadge";

interface Props {
  query: UseQueryResult<ScriptDetailResponse>;
}

export const ScriptDetailOverview = ({ query }: Props) => {
  const { t } = useAppTranslation("common");
  const data = query.data?.data;

  const miscBasicQuery = useFetchMiscBasic();

  const overviewList = data
    ? [
        data.label
          ? {
              label: t("script.overview.dapp"),
              value: (
                <LabelBadge
                  className='text-[14px] font-regular'
                  variant='textOnly'
                  label={data.label}
                  extra={data.label.extra}
                />
              ),
            }
          : null,
        data.label?.category?.length > 0
          ? {
              label: t("script.overview.category"),
              value: (
                <div className='flex'>
                  {data.label.category.map((category, index) => (
                    <Badge
                      key={index}
                      color='blue'
                      rounded
                      className={`h-6' mr-2`}
                      style={{
                        filter: `hue-rotate(${index * 45}deg)`,
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              ),
            }
          : null,
        {
          label: t("script.overview.type"),
          value: (
            <Badge color='yellow' rounded>
              {data?.type?.slice(0, 1).toUpperCase() + data?.type?.slice(1)}
            </Badge>
          ),
        },
        data.purpose?.length
          ? {
              label: t("script.overview.purpose"),
              value: <PurposeBadge purpose={data?.purpose[0]?.purpose} />,
            }
          : undefined,
        {
          label: t("script.overview.size"),
          value: (data?.serialised_size / 1000).toFixed(2) + "kB",
        },
        {
          label: t("script.overview.originTransaction"),
          value: <HashCell hash={data?.tx.hash || ""} />,
        },
        {
          label: t("tx.verifySource"),
          value: <ScriptVerifyBadge scriptHash={data.hash} />,
        },
        {
          label: t("script.overview.bytes"),
          value: (
            <AttributeDropdown
              items={[
                {
                  label: undefined,
                  value: (
                    <TextDisplay
                      text={data?.bytecode || ""}
                      className='max-w-full'
                      contents
                      showCopy={false}
                    />
                  ),
                },
              ]}
              itemSize={280}
              className='w-[300px]'
            >
              <div className='flex w-fit items-center gap-1'>
                <Button
                  label={t("script.overview.show")}
                  variant='tertiary'
                  size='sm'
                  className='h-6'
                />
                <Copy className='' copyText={data?.bytecode || ""} />
              </div>
            </AttributeDropdown>
          ),
        },
      ]
    : null;

  return (
    <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile pb-0 lg:flex-row lg:p-desktop lg:pb-0'>
      {query.isLoading || !overviewList ? (
        <>
          <LoadingSkeleton
            height='400px'
            maxHeight='400px'
            rounded='xl'
            className='grow basis-[500px]'
          />
          <section className='flex w-full flex-col gap-3 lg:w-[400px] lg:justify-between'>
            <LoadingSkeleton height='110px' rounded='xl' className='' />
            <LoadingSkeleton height='110px' rounded='xl' className='' />
            <LoadingSkeleton height='110px' rounded='xl' className='' />
          </section>
        </>
      ) : (
        <>
          <OverviewCard
            className='max-h-[400px] min-h-[290px] basis-[500px]'
            title={t("script.overview.title")}
            overviewList={overviewList}
          />
          <section className='flex w-full flex-col gap-3 lg:w-[400px]'>
            <OverviewStatCard
              icon={<LineChart color={colors.primary} />}
              title={t("script.overview.volumeTotal")}
              value={
                data?.stat_total?.volume
                  ? formatNumber(data?.stat_total?.volume)
                  : "-"
              }
              subTitle={`${t("script.overview.activeEpochs")}: ${
                data?.stat_total?.epochs
                  ? formatNumber(data?.stat_total?.epochs)
                  : "-"
              }`}
              className='max-h-[110px]'
            />
            <OverviewStatCard
              title={t("script.overview.interactionsTotal")}
              icon={<FileBarChart color={colors.primary} />}
              value={
                data?.stat_total?.interactions
                  ? formatNumber(data?.stat_total?.interactions)
                  : "-"
              }
              subTitle={`${t("script.overview.activeEpochs")}: ${
                data?.stat_total?.epochs
                  ? formatNumber(data?.stat_total?.epochs)
                  : "-"
              }`}
              className='max-h-[140px]'
            />
            <AdsCarousel
              miscBasicQuery={miscBasicQuery}
              generateImageUrl={generateImageUrl}
              singleItem
              className='p-0 md:p-0'
            />
          </section>
        </>
      )}
    </div>
  );
};
