import type { FC } from "react";

import { Box, HardDrive, Maximize } from "lucide-react";

import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkBlockSizeGraph } from "../graphs/NetworkBlockSizeGraph";
import { NetworkBlockGraph } from "../graphs/NetworkBlockGraph";

import { useFetchEpochAnalytics } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { formatNumber } from "@/utils/format/format";

export const NetworkBlocksTab: FC = () => {
  const epochQuery = useFetchEpochAnalytics();

  const totalblocks = epochQuery.data?.data
    ?.map(item => item?.stat?.count_block)
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

  const lastEpoch = (epochQuery.data?.data ?? []).filter(item => item?.stat)[0];
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const statCards = [
    {
      key: "total_blocks",
      icon: <Box className='text-primary' />,
      label: "Blocks",
      content: formatNumber(totalblocks),
      footer: "All time",
    },
    {
      key: "average_block_saturation",
      icon: <HardDrive className='text-primary' />,
      label: "Average block size",
      content: `${(((lastEpoch?.stat?.avg_block_size ?? 0) as number) / 1024).toFixed(2)} Kb`,
      footer: "In previous epoch",
    },
    {
      key: "maximum_block_capacity",
      icon: <Maximize className='text-primary' />,
      label: "Maximum block capacity",
      content: `${(((miscConst?.epoch_param?.max_block_size ?? 0) as number) / 1024).toFixed(2)} Kb`,
      footer: "In epoch",
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading}
        statCards={statCards}
      />
      <NetworkBlockGraph epochQuery={epochQuery} miscConst={miscConst} />
      <NetworkBlockSizeGraph epochQuery={epochQuery} miscConst={miscConst} />
    </section>
  );
};
