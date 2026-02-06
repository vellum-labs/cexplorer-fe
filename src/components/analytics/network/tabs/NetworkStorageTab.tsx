import type { FC } from "react";

import { ArrowDown, ArrowUp, HardDrive, SquarePlus } from "lucide-react";

import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkStorageGraph } from "../graphs/NetworkStorageGraph";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useMiscConst } from "@/hooks/useMiscConst";
import {
  useFetchEpochAnalytics,
  useFetchMilestoneAnalytics,
} from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";

import { bytesPerMb } from "@/constants/memorySizes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const NetworkStorageTab: FC = () => {
  const { t } = useAppTranslation("common");
  const epochQuery = useFetchEpochAnalytics();
  const milestoneQuery = useFetchMilestoneAnalytics();

  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const milestoneData = milestoneQuery.data?.data ?? [];
  const sortedMilestoneData = [...milestoneData].sort(
    (a, b) => b.epoch_no - a.epoch_no,
  );

  const currStorIncrease =
    ((sortedMilestoneData[0]?.stat?.count_block ?? 0) *
      +(sortedMilestoneData[0]?.stat?.avg_block_size ?? 0)) /
    bytesPerMb;

  const prevStorIncrease =
    ((sortedMilestoneData[1]?.stat?.count_block ?? 0) *
      +(sortedMilestoneData[1]?.stat?.avg_block_size ?? 0)) /
    bytesPerMb;

  const totalNetworkStorage =
    milestoneData.reduce((a, b) => {
      const countBlk = b?.stat?.count_block ?? 0;
      const avgBlkSize = +(b?.stat?.avg_block_size ?? 0);

      return a + countBlk * avgBlkSize;
    }, 0) / bytesPerMb;

  const statCards = [
    {
      key: "current_str_incr",
      icon: <SquarePlus className='text-primary' />,
      label: t("analytics.storageIncreaseCurrentEpoch"),
      content: `${formatNumber(currStorIncrease.toFixed(2))} Mb`,
      footer: (() => {
        const percentageChange =
          ((currStorIncrease - prevStorIncrease) / prevStorIncrease) * 100;

        return (
          <span className='flex gap-1/2'>
            <span
              className={`flex items-center gap-1 ${Math.sign(percentageChange) > 0 ? "text-[#079455]" : "text-[#FDB022]"}`}
            >
              {Math.sign(percentageChange) > 0 ? (
                <ArrowUp size={15} />
              ) : (
                <ArrowDown size={15} />
              )}
              <span>{Math.abs(percentageChange).toFixed(2)}%</span>
            </span>
            <span>{t("analytics.vsLastEpoch")}</span>
          </span>
        );
      })(),
    },
    {
      key: "total_network_storage",
      icon: <HardDrive className='text-primary' />,
      label: t("analytics.totalNetworkStorage"),
      content: `${formatNumber(totalNetworkStorage.toFixed(2))} Mb`,
      footer: t("analytics.totalNetworkStorageDescription"),
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading || milestoneQuery.isLoading}
        statCards={statCards}
      />

      <NetworkStorageGraph epochQuery={epochQuery} miscConst={miscConst} />
    </section>
  );
};
