import { colors } from "@/constants/colors";
import type { ScriptDetailResponse } from "@/types/scriptTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import type { UseQueryResult } from "@tanstack/react-query";
import { FileBarChart, LineChart } from "lucide-react";
import AdsCarousel from "../global/ads/AdsCarousel";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { LabelBadge } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { OverviewCard } from "../global/cards/OverviewCard";
import { OverviewStatCard } from "../global/cards/OverviewStatCard";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TextDisplay } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "../tx/HashCell";
import { AttributeDropdown } from "../global/AttributeDropdown";
import { Copy } from "@vellumlabs/cexplorer-sdk";

interface Props {
  query: UseQueryResult<ScriptDetailResponse>;
}

export const ScriptDetailOverview = ({ query }: Props) => {
  const data = query.data?.data;

  const overviewList = data
    ? [
        data.label
          ? {
              label: "dApp",
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
              label: "Category",
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
          label: "Type",
          value: (
            <Badge color='yellow' rounded>
              {data?.type?.slice(0, 1).toUpperCase() + data?.type?.slice(1)}
            </Badge>
          ),
        },
        data.purpose?.length
          ? {
              label: "Purpose",
              value: <PurposeBadge purpose={data?.purpose[0]?.purpose} />,
            }
          : undefined,
        {
          label: "Size",
          value: (data?.serialised_size / 1000).toFixed(2) + "kB",
        },
        {
          label: "Origin transaction",
          value: <HashCell hash={data?.tx.hash || ""} />,
        },
        {
          label: "Bytes",
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
                  label='Show'
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
            title='Script Overview'
            overviewList={overviewList}
          />
          <section className='flex w-full flex-col gap-3 lg:w-[400px]'>
            <OverviewStatCard
              icon={<LineChart color={colors.primary} />}
              title='Volume total'
              value={
                data?.stat_total?.volume
                  ? formatNumber(data?.stat_total?.volume)
                  : "-"
              }
              subTitle={`Active epochs: ${
                data?.stat_total?.epochs
                  ? formatNumber(data?.stat_total?.epochs)
                  : "-"
              }`}
              className='max-h-[110px]'
            />
            <OverviewStatCard
              title='Interactions total'
              icon={<FileBarChart color={colors.primary} />}
              value={
                data?.stat_total?.interactions
                  ? formatNumber(data?.stat_total?.interactions)
                  : "-"
              }
              subTitle={`Active epochs: ${
                data?.stat_total?.epochs
                  ? formatNumber(data?.stat_total?.epochs)
                  : "-"
              }`}
              className='max-h-[140px]'
            />
            <AdsCarousel singleItem className='p-0 md:p-0' />
          </section>
        </>
      )}
    </div>
  );
};
