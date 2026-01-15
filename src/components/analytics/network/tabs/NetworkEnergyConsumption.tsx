import type { FC } from "react";

import { AnalyticsGraph } from "../../AnalyticsGraph";
import { NetworkEnergyGraph } from "../graphs/NetworkEnergyGraph";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAnalyticsRate } from "@/services/analytics";

import { formatNumber } from "@vellumlabs/cexplorer-sdk";

export const NetworkEnergyConsumption: FC = () => {
  const { t } = useAppTranslation("common");
  const rateQuery = useFetchAnalyticsRate();

  const data = rateQuery.data?.data;

  const lastDataItem = (data ?? [])[0];

  const availableValue = (num: number | undefined | null) =>
    num ? formatNumber(num) : "-";

  const consumptionPerDevice = 45;
  const estimatedBitcoinConsumptionY = 185000;
  const conversionFactor = 1_000_000_000;

  const countPoolRelayUniq = lastDataItem?.stat?.count_pool_relay_uniq ?? 0;
  const countPool = lastDataItem?.stat?.count_pool ?? 0;

  const estimatedUniqueDevices = countPoolRelayUniq * 1.5;
  const estimatedYearlyConsumption =
    (consumptionPerDevice * 365 * 24 * estimatedUniqueDevices) /
    conversionFactor;

  const cardanoVsBitcoinEfficiency =
    estimatedBitcoinConsumptionY / estimatedYearlyConsumption;

  const compareColumns = [
    {
      key: "consumption_per_device",
      title: t("analytics.consumptionPerDevice"),
      value: `${consumptionPerDevice}W`,
    },
    {
      key: "consumption_per_device",
      title: t("analytics.uniqueRelays"),
      value: availableValue(countPoolRelayUniq),
    },
    {
      key: "pools",
      title: t("analytics.pools"),
      value: availableValue(countPool),
    },
    {
      key: "est_bit_cons",
      title: t("analytics.estimatedBitcoinConsumption"),
      value: `${formatNumber(estimatedBitcoinConsumptionY)} GWh`,
    },
    {
      key: "est_un_dev",
      title: t("analytics.estimatedUniqueDevices"),
      value: availableValue(estimatedUniqueDevices),
    },
    {
      key: "est_year_cons",
      title: t("analytics.estimatedYearlyConsumption"),
      value: `${formatNumber(Math.round(estimatedYearlyConsumption))} GWh`,
    },
    {
      key: "card_vs_bit_eff",
      title: t("analytics.cardanoVsBitcoinEfficiency"),
      value: `${formatNumber(Math.round(cardanoVsBitcoinEfficiency))}x`,
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-1.5 lg:flex-row'>
      <AnalyticsGraph
        title={t("analytics.cardanoVsBitcoin")}
        description={t("analytics.cardanoVsBitcoinDescription")}
        className='lg:max-w-[500px]'
      >
        <div
          className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-m border border-border text-grayTextPrimary'
          style={{
            transform: "rotateX(180deg)",
          }}
        >
          <div
            className='w-full'
            style={{
              transform: "rotateX(180deg)",
            }}
          >
            {compareColumns.map(({ key, title, value }, i) => (
              <div className='flex w-full items-center' key={key}>
                <div
                  className={`min-w-[270px] max-w-[255px] flex-grow ${i === 0 || i % 2 === 0 ? "bg-darker" : ""} `}
                  style={{
                    minHeight: "64px",
                    height: "64px",
                  }}
                >
                  <p className='flex h-full items-center pl-3 text-text-sm'>
                    {title}
                  </p>
                </div>
                <div
                  key={i}
                  className={`flex min-w-[140px] flex-1 justify-center ${i === 0 || i % 2 === 0 ? "bg-darker" : ""}`}
                  style={{
                    minHeight: "64px",
                    height: "64px",
                  }}
                >
                  <p
                    className={`flex h-full w-full items-center justify-end pr-3 text-text-sm ${i === compareColumns.length - 1 && "font-bold"}`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnalyticsGraph>
      <AnalyticsGraph
        title={t("analytics.cardanoEnergyConsumption")}
        description={t("analytics.cardanoEnergyConsumptionDescription")}
        exportButton
      >
        <NetworkEnergyGraph rateQuery={rateQuery} />
      </AnalyticsGraph>
    </section>
  );
};
