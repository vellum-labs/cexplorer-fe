import type { FC } from "react";

import { ArrowDown, ArrowUp, HardDrive, SquarePlus } from "lucide-react";

import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkStorageGraph } from "../graphs/NetworkStorageGraph";

import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchEpochAnalytics } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";

import { bytesPerMb } from "@/constants/memorySizes";
import { formatNumber } from "@/utils/format/format";

export const NetworkStorageTab: FC = () => {
  const epochQuery = useFetchEpochAnalytics();

  const data = epochQuery.data?.data.slice(0, epochQuery.data?.data.length - 4);
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const currStorIncrease =
    (((data ?? [])[0]?.stat?.count_block ?? 0) *
      (((data ?? [])[0]?.stat?.avg_block_size ?? 0) as number)) /
    bytesPerMb;

  const prevStorIncrease =
    (((data ?? [])[1]?.stat?.count_block ?? 0) *
      (((data ?? [])[1]?.stat?.avg_block_size ?? 0) as number)) /
    bytesPerMb;

  const totalNetworkStorage =
    (data ?? []).reduce((a, b) => {
      const countBlk = (b?.stat?.count_block ?? 0) as number;
      const avgBlkSize = (b?.stat?.avg_block_size ?? 0) as number;

      return a + countBlk * avgBlkSize;
    }, 0) / bytesPerMb;

  const statCards = [
    {
      key: "current_str_incr",
      icon: <SquarePlus className='text-primary' />,
      label: "Storage increase in current epoch",
      content: `${formatNumber(currStorIncrease.toFixed(2))} Mb`,
      footer: (() => {
        const percentageChange =
          ((currStorIncrease - prevStorIncrease) / prevStorIncrease) * 100;

        return (
          <span className='flex gap-1'>
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
            <span>vs last epoch</span>
          </span>
        );
      })(),
    },
    {
      key: "total_network_storage",
      icon: <HardDrive className='text-primary' />,
      label: "Total network storage",
      content: `${formatNumber(totalNetworkStorage.toFixed(2))} Mb`,
      footer: "Total storage needed for all records of Cardano network",
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-3'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading}
        statCards={statCards}
      />

      <NetworkStorageGraph epochQuery={epochQuery} miscConst={miscConst} />
    </section>
  );
};
