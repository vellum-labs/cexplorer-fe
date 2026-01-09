import type { FC } from "react";

import { Box, HardDrive, Maximize } from "lucide-react";

import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkBlockSizeGraph } from "../graphs/NetworkBlockSizeGraph";
import { NetworkBlockGraph } from "../graphs/NetworkBlockGraph";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const NetworkBlocksTab: FC = () => {
  const { t } = useAppTranslation("common");
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
      label: t("analytics.blocks"),
      content: formatNumber(totalblocks),
      footer: t("analytics.allTime"),
    },
    {
      key: "average_block_saturation",
      icon: <HardDrive className='text-primary' />,
      label: t("analytics.averageBlockSize"),
      content: `${(((lastEpoch?.stat?.avg_block_size ?? 0) as number) / 1024).toFixed(2)} Kb`,
      footer: t("analytics.inPreviousEpoch"),
    },
    {
      key: "maximum_block_capacity",
      icon: <Maximize className='text-primary' />,
      label: t("analytics.maximumBlockCapacity"),
      content: `${(((miscConst?.epoch_param?.max_block_size ?? 0) as number) / 1024).toFixed(2)} Kb`,
      footer: t("analytics.inEpoch"),
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
