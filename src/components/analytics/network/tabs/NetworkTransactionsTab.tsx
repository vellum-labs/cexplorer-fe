import type { AnalyticsRateResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";

import { ArrowLeftRight, Database, Zap } from "lucide-react";

import { AnalyticsGraph } from "../../AnalyticsGraph";
import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkTxInEpochGraph } from "../graphs/NetworkTxInEpochGraph";
import { NetworkTxInTimeGraph } from "../graphs/NetworkTxInTimeGraph";
import { NetworkTransactionsTable } from "../tables/NetworkTransactionsTable";

import {
  useFetchAnalyticsRate,
  useFetchEpochAnalytics,
} from "@/services/analytics";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { formatNumber } from "@/utils/format/format";
import { lovelaceToAda } from "@/utils/lovelaceToAda";

export const NetworkTransactionTab: FC = () => {
  const epochQuery = useFetchEpochAnalytics();
  const rateQuery = useFetchAnalyticsRate();

  const epochs = (epochQuery.data?.data ?? []).filter(item => item?.stat);
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const allTimeDates = rateQuery.data?.data;
  const threeMonthDates = (allTimeDates ?? [])?.slice(0, 90);
  const thrityDaysDates = (allTimeDates ?? [])?.slice(0, 30);
  const sevenDaysDates = (allTimeDates ?? [])?.slice(0, 7);

  const totalTx = epochs
    .map(item => item.stat?.count_tx ?? 0)
    .reduce((a, b) => a + b, 0);

  const prevEpochTPS = epochs[0]?.stat?.count_tx
    ? (epochs[0].stat?.count_tx / 432000).toFixed(2)
    : "-";

  const averageTxFee = epochs[0]?.stat?.avg_tx_fee
    ? lovelaceToAda(+epochs[0]?.stat?.avg_tx_fee)
    : "-";

  const statCards = [
    {
      key: "total_transactions",
      icon: <ArrowLeftRight className='text-primary' />,
      label: "Transactions",
      content: formatNumber(totalTx),
      footer: "All time",
    },
    {
      key: "transactions_per_second",
      icon: <Zap className='text-primary' />,
      label: "Transactions per second (TPS)",
      content: prevEpochTPS,
      footer: "In previous epoch",
    },
    {
      key: "avg_fee_per_transaction",
      icon: <Database className='text-primary' />,
      label: "Average fee per transaction",
      content: averageTxFee,
      footer: "In previous epoch",
    },
  ];

  const getMaxTpsByEpochs = (arr: AnalyticsRateResponseData[] | undefined) =>
    (arr ?? []).map(item => {
      const countTx = item?.stat?.count_tx_out ?? 1;
      const avgBlockSize = +(item?.stat?.avg_block_size ?? 1);
      const maxBlockSize = miscConst?.epoch_param?.max_block_size ?? 1;

      return (countTx / 86400 / avgBlockSize) * maxBlockSize;
    });

  const getTx = (arr: AnalyticsRateResponseData[] | undefined) =>
    (arr ?? [])
      .filter(e => e?.stat)
      .map(item => item?.stat?.count_tx_out)
      .reduce((a, b) => (a as number) + (b as number), 0);

  const getTps = (arr: AnalyticsRateResponseData[] | undefined) => {
    const seconds = (arr ?? []).map(() => 86400).reduce((a, b) => a + b, 0);

    const txs = getTx(arr) as number;

    return (txs / seconds).toFixed(2);
  };

  const getMaxTps = (arr: AnalyticsRateResponseData[] | undefined) => {
    const maxTpsArr = getMaxTpsByEpochs(arr);
    const maxTpsLength = maxTpsArr.length;
    const reducedMaxTps = maxTpsArr.reduce((a, b) => a + b, 0);

    return (reducedMaxTps / maxTpsLength).toFixed(2);
  };

  const items = [
    {
      timeframe: "All time",
      transactions: getTx(allTimeDates),
      tps: getTps(allTimeDates),
      max_tps: getMaxTps(allTimeDates),
    },
    {
      timeframe: "3 month",
      transactions: getTx(threeMonthDates),
      tps: getTps(threeMonthDates),
      max_tps: getMaxTps(threeMonthDates),
    },
    {
      timeframe: "30 days",
      transactions: getTx(thrityDaysDates),
      tps: getTps(thrityDaysDates),
      max_tps: getMaxTps(thrityDaysDates),
    },
    {
      timeframe: "7 days",
      transactions: getTx(sevenDaysDates),
      tps: getTps(sevenDaysDates),
      max_tps: getMaxTps(sevenDaysDates),
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-3'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading}
        statCards={statCards}
      />
      <NetworkTxInEpochGraph epochQuery={epochQuery} miscConst={miscConst} />
      <AnalyticsGraph
        title='Transactions per second (TPS)'
        description='Visual expression of all transactions on the Cardano network in time.'
      >
        <div className='flex h-full w-full flex-wrap gap-3 xl:flex-nowrap'>
          <NetworkTransactionsTable query={epochQuery} items={items} />
          <NetworkTxInTimeGraph items={items} />
        </div>
      </AnalyticsGraph>
    </section>
  );
};
