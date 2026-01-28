import type { AnalyticsRateResponseData } from "@/types/analyticsTypes";
import type { FC } from "react";

import { ArrowLeftRight, Database, Zap } from "lucide-react";

import { AnalyticsGraph } from "../../AnalyticsGraph";
import { AnalyticsStatList } from "../../AnalyticsStatList";
import { NetworkTxInEpochGraph } from "../graphs/NetworkTxInEpochGraph";
import { NetworkTxInTimeGraph } from "../graphs/NetworkTxInTimeGraph";
import { NetworkTransactionsTable } from "../tables/NetworkTransactionsTable";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  useFetchAnalyticsRate,
  useFetchEpochAnalytics,
} from "@/services/analytics";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";

import { configJSON } from "@/constants/conf";

export const NetworkTransactionTab: FC = () => {
  const { t } = useAppTranslation("common");
  const epochQuery = useFetchEpochAnalytics();
  const rateQuery = useFetchAnalyticsRate();

  const { epochLength } = configJSON.genesisParams[0].shelley[0];

  const epochs = (epochQuery.data?.data ?? []).filter(item => item?.stat);
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const allTimeDates = rateQuery.data?.data;
  const threeMonthDates = (allTimeDates ?? [])?.slice(0, 90);
  const thrityDaysDates = (allTimeDates ?? [])?.slice(0, 30);
  const sevenDaysDates = (allTimeDates ?? [])?.slice(0, 7);

  const totalTx = epochs
    .map(item => item.stat?.count_tx ?? 0)
    .reduce((a, b) => a + b, 0);

  const prevEpochTPS = epochs[1]?.stat?.count_tx
    ? (epochs[1].stat?.count_tx / epochLength).toFixed(2)
    : "-";

  const averageTxFee = epochs[1]?.stat?.avg_tx_fee
    ? lovelaceToAda(+epochs[1]?.stat?.avg_tx_fee)
    : "-";

  const statCards = [
    {
      key: "total_transactions",
      icon: <ArrowLeftRight className='text-primary' />,
      label: t("analytics.transactions"),
      content: formatNumber(totalTx),
      footer: t("analytics.allTime"),
    },
    {
      key: "transactions_per_second",
      icon: <Zap className='text-primary' />,
      label: t("analytics.transactionsPerSecond"),
      content: prevEpochTPS,
      footer: t("analytics.inPreviousEpoch"),
    },
    {
      key: "avg_fee_per_transaction",
      icon: <Database className='text-primary' />,
      label: t("analytics.avgFeePerTransaction"),
      content: averageTxFee,
      footer: t("analytics.inPreviousEpoch"),
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
      timeframe: t("analytics.allTime"),
      transactions: getTx(allTimeDates),
      tps: getTps(allTimeDates),
      max_tps: getMaxTps(allTimeDates),
    },
    {
      timeframe: t("analytics.threeMonth"),
      transactions: getTx(threeMonthDates),
      tps: getTps(threeMonthDates),
      max_tps: getMaxTps(threeMonthDates),
    },
    {
      timeframe: t("analytics.thirtyDays"),
      transactions: getTx(thrityDaysDates),
      tps: getTps(thrityDaysDates),
      max_tps: getMaxTps(thrityDaysDates),
    },
    {
      timeframe: t("analytics.sevenDays"),
      transactions: getTx(sevenDaysDates),
      tps: getTps(sevenDaysDates),
      max_tps: getMaxTps(sevenDaysDates),
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5'>
      <AnalyticsStatList
        isLoading={epochQuery.isLoading}
        statCards={statCards}
      />
      <NetworkTxInEpochGraph epochQuery={epochQuery} miscConst={miscConst} />
      <AnalyticsGraph
        title={t("analytics.transactionsPerSecond")}
        description={t("analytics.tpsDescription")}
      >
        <div className='flex h-full w-full flex-wrap gap-1.5 xl:flex-nowrap'>
          <NetworkTransactionsTable query={epochQuery} items={items} />
          <NetworkTxInTimeGraph items={items} />
        </div>
      </AnalyticsGraph>
    </section>
  );
};
