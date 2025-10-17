import type { EpochAnalyticsResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";

import { Box } from "lucide-react";

import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkHealthGraph } from "../graphs/NetworkHealthGraph";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";

import { useFetchMiscBasic } from "@/services/misc";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { useMiscConst } from "@/hooks/useMiscConst";
import { configJSON } from "@/constants/conf";

export const NetworkHealthTab: FC = () => {
  const epochQuery = useFetchEpochAnalytics();

  const { genesisParams } = configJSON;
  const expectedBlocks =
    genesisParams[0].shelley[0].activeSlotsCoeff *
    genesisParams[0].shelley[0].epochLength;
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const previousEpoch = (epochQuery?.data?.data ?? [])[1];

  const previousTenEpoch = (epochQuery?.data?.data ?? []).slice(0, 10);
  const previousThirtyEpoch = (epochQuery?.data?.data ?? []).slice(0, 30);

  const getEpochBlkCount = (arr: EpochAnalyticsResponseData[]) =>
    arr.reduce((a, b) => (a + (b?.stat?.count_block ?? 0)) as number, 0);

  const getChainDensity = (arr: EpochAnalyticsResponseData[]) => {
    const expected = expectedBlocks * arr.length;
    const blocks = getEpochBlkCount(arr);

    return (blocks / expected) * 100;
  };

  const statCards = [
    {
      key: "chain_density_day",
      icon: <Box className='text-primary' />,
      label: "Chain density - previous epoch",
      content: `${(((previousEpoch?.stat?.count_block ?? 0) / expectedBlocks) * 100).toFixed(2)}%`,
      footer: previousEpoch?.stat?.count_block
        ? `${formatNumber(previousEpoch?.stat?.count_block)} blocks`
        : "-",
    },
    {
      key: "chain_density_epoch",
      icon: <Box className='text-primary' />,
      label: "Chain density - 10 epoch",
      content: `${getChainDensity(previousTenEpoch).toFixed(2)}%`,
      footer: `${formatNumber(getEpochBlkCount(previousTenEpoch))} blocks`,
    },
    {
      key: "chain_density_month",
      icon: <Box className='text-primary' />,
      label: "Chain density - 30 epoch",
      content: `${getChainDensity(previousThirtyEpoch).toFixed(2)}%`,
      footer: `${formatNumber(getEpochBlkCount(previousThirtyEpoch))} blocks`,
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading}
        statCards={statCards}
      />
      <NetworkHealthGraph epochQuery={epochQuery} miscConst={miscConst} />
    </section>
  );
};
