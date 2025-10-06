import type { FC } from "react";

import { AnalyticsGraph } from "../../AnalyticsGraph";
import { NetworkEnergyGraph } from "../graphs/NetworkEnergyGraph";

import { useFetchAnalyticsRate } from "@/services/analytics";

import { formatNumber } from "@/utils/format/format";

export const NetworkEnergyConsumption: FC = () => {
  const rateQuery = useFetchAnalyticsRate();

  const data = rateQuery.data?.data;

  const lastDataItem = (data ?? [])[0];

  const availableValue = (num: number | undefined | null) =>
    num ? formatNumber(num) : "-";

  const consumptionPerDevice = 45;
  const estimatedBitcoinConsumptionY = 185000;
  const conversionFactor = 1_000_000;

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
      title: "Consumption per device",
      value: `${consumptionPerDevice}W`,
    },
    {
      key: "consumption_per_device",
      title: "Unique relays",
      value: availableValue(countPoolRelayUniq),
    },
    {
      key: "pools",
      title: "Pools",
      value: availableValue(countPool),
    },
    {
      key: "est_bit_cons",
      title: "Estimated Bitcoin consumption (y)",
      value: `${formatNumber(estimatedBitcoinConsumptionY)} GWh`,
    },
    {
      key: "est_un_dev",
      title: "Estimated unique devices *",
      value: availableValue(estimatedUniqueDevices),
    },
    {
      key: "est_year_cons",
      title: "Estimated yearly consumption",
      value: `${formatNumber(Math.round(estimatedYearlyConsumption))} GWh`,
    },
    {
      key: "card_vs_bit_eff",
      title: "Cardano versus Bitcoin efficiency",
      value: `${formatNumber(Math.round(cardanoVsBitcoinEfficiency))}x`,
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col gap-3 lg:flex-row'>
      <AnalyticsGraph
        title='Cardano PoS vs. Bitcoin PoW'
        description="Overview: This comparison examines the energy efficiency advantages of Cardano's proof-of-stake consensus over Bitcoin's proof-of-work model."
        className='lg:max-w-[500px]'
      >
        <div
          className='thin-scrollbar relative w-full overflow-auto overflow-x-auto rounded-lg border border-border text-grayTextPrimary'
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
                  <p className='flex h-full items-center pl-3 text-sm'>
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
                    className={`flex h-full w-full items-center justify-end pr-3 text-sm ${i === compareColumns.length - 1 && "font-bold"}`}
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
        title='Cardano energy consumption'
        description='Overview: This graph monitors total amount of operated stake pool and their energy consumption.'
        exportButton
      >
        <NetworkEnergyGraph rateQuery={rateQuery} />
      </AnalyticsGraph>
    </section>
  );
};
