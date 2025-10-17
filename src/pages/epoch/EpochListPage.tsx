import type { FC } from "react";
import { EpochInfo } from "@/components/epoch/EpochInfo";
import { EpochStats } from "@/components/epoch/EpochStats";
import EpochBlockchainGraph from "@/components/epoch/graphs/EpochBlockchainGraph";
import { EpochAnalyticsTabItem } from "@/components/epoch/tabs/EpochAnalyticsTabItem";
import Tabs from "@/components/global/Tabs";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { EpochsTabItem } from "../../components/epoch/tabs/EpochsTabItem";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useMiscRate } from "@/hooks/useMiscRate";
import { useFetchEpochList } from "@/services/epoch";
import { useFetchMiscBasic } from "@/services/misc";

import ReactEcharts from "echarts-for-react";

import { cn } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";

const EpochListPage: FC = () => {
  const { data, isLoading, isError } = useFetchEpochList();

  const filteredDataItems = (data?.data || []).filter(e => e);

  const { data: basicData } = useFetchMiscBasic();
  const constData = useMiscConst(basicData?.data.version.const);
  const rates = useMiscRate(basicData?.data.version.rate);

  const constDataBlockSize = constData?.epoch_stat?.epoch?.block_size ?? 0;
  const constDataBlockCount = constData?.epoch?.blk_count ?? 0;
  const constDataMaxBlockSize = constData?.epoch_param?.max_block_size ?? 0;

  const epochStats = [
    {
      title: "Blocks",
      value: constData?.epoch?.blk_count ?? 0,
    },
    {
      title: "TXs",
      value: constData?.epoch?.tx_count ?? 0,
    },
    {
      title: "Stake",
      value: <AdaWithTooltip data={constData?.epoch_stat?.stake?.epoch ?? 0} />,
    },
    {
      title: "Usage",
      value: (() => {
        const blockUsage = isNaN(
          (constDataBlockSize / (constDataBlockCount * constDataMaxBlockSize)) *
            100,
        )
          ? 0
          : (constDataBlockSize /
              (constDataBlockCount * constDataMaxBlockSize)) *
            100;

        const usagePercentage = blockUsage.toFixed(2);
        const option = {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: param => {
              const color = param.color;
              return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;"></span>${param.data.name}: ${param.data.value}%`;
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usagePercentage,
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - blockUsage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='relative left-[-15px]'>
            <ReactEcharts
              option={option}
              className='max-h-[40px] max-w-[50px]'
            />
          </div>
        );
      })(),
    },
  ];

  const epochTabItems = [
    {
      key: "epochs",
      label: "Epochs",
      content: (
        <EpochsTabItem
          epoch_number={data?.count ?? 0}
          data={filteredDataItems}
        />
      ),
      visible: true,
    },
    {
      key: "analytics",
      label: "Analytics",
      content: <EpochAnalyticsTabItem />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='epochsList'
      title='Epochs'
      breadcrumbItems={[{ label: "Epochs" }]}
    >
      <section className='flex min-h-[410px] w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='flex h-full w-full flex-wrap items-center gap-3'>
          <div className='flex h-full w-full flex-grow flex-col gap-3 xl:w-[400px] xl:flex-grow-0'>
            {isLoading || isError ? (
              <LoadingSkeleton height='177px' rounded='lg' />
            ) : (
              <EpochInfo
                number={filteredDataItems[0]?.no ?? 0}
                data={filteredDataItems || []}
              />
            )}
            {isLoading || isError ? (
              <LoadingSkeleton height='190px' rounded='lg' />
            ) : (
              <EpochStats epochStats={epochStats} />
            )}
          </div>
          <div
            className={cn(
              `flex h-[392px] w-full flex-grow items-center rounded-m ${!isLoading && "border border-border"} md:w-[833px]`,
              !isLoading && !isError && "p-1",
            )}
          >
            {isLoading || isError ? (
              <LoadingSkeleton width='100%' rounded='lg' />
            ) : (
              <EpochBlockchainGraph data={filteredDataItems} rates={rates} />
            )}
          </div>
        </div>
      </section>
      <Tabs items={epochTabItems} wrapperClassname='mt-0' />
    </PageBase>
  );
};

export default EpochListPage;
