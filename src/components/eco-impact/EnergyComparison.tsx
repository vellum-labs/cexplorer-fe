import type { FC } from "react";
import { useMemo } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAnalyticsRate } from "@/services/analytics";
import {
  formatNumber,
  LoadingSkeleton,
  useThemeStore,
} from "@vellumlabs/cexplorer-sdk";
import AdaIcon from "@/resources/images/icons/ada.webp";
import BitcoinIcon from "@/resources/images/wallet/bitcoin.svg";
import {
  CONSUMPTION_PER_DEVICE,
  BITCOIN_ANNUAL_ENERGY_GWH,
  BITCOIN_ANNUAL_TX,
  CARDANO_ANNUAL_TX_ESTIMATE,
  CO2_PER_KWH,
  CONVERSION_FACTOR,
} from "@/constants/ecoImpact";

export const EnergyComparison: FC = () => {
  const { t } = useAppTranslation("common");
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const rateQuery = useFetchAnalyticsRate();

  const metrics = useMemo(() => {
    const rateData = rateQuery.data?.data;
    const lastDataItem = (rateData ?? [])[0];
    const countPoolRelayUniq =
      lastDataItem?.stat?.count_pool_relay_uniq ?? 0;

    if (!countPoolRelayUniq) return null;

    const estimatedUniqueDevices = countPoolRelayUniq * 1.5;
    const cardanoAnnualEnergyGWh =
      (CONSUMPTION_PER_DEVICE * 365 * 24 * estimatedUniqueDevices) /
      CONVERSION_FACTOR;

    const cardanoAnnualEnergyKWh = cardanoAnnualEnergyGWh * 1_000_000;
    const bitcoinAnnualEnergyKWh = BITCOIN_ANNUAL_ENERGY_GWH * 1_000_000;

    const cardanoEnergyPerTx =
      cardanoAnnualEnergyKWh / CARDANO_ANNUAL_TX_ESTIMATE;
    const bitcoinEnergyPerTx = bitcoinAnnualEnergyKWh / BITCOIN_ANNUAL_TX;
    const cardanoCO2PerTx = cardanoEnergyPerTx * CO2_PER_KWH;
    const bitcoinCO2PerTx = bitcoinEnergyPerTx * CO2_PER_KWH;

    return {
      cardanoAnnualEnergyGWh,
      cardanoEnergyPerTx,
      bitcoinEnergyPerTx,
      cardanoCO2PerTx,
      bitcoinCO2PerTx,
    };
  }, [rateQuery.data]);

  if (rateQuery.isLoading) {
    return <LoadingSkeleton height='200px' width='100%' />;
  }

  if (!metrics) return null;

  const rows = [
    {
      label: t("ecoImpact.results.annualEnergy"),
      cardano: `${formatNumber(Math.round(metrics.cardanoAnnualEnergyGWh * 100) / 100)} GWh`,
      bitcoin: `${formatNumber(BITCOIN_ANNUAL_ENERGY_GWH)} GWh`,
    },
    {
      label: t("ecoImpact.results.energyPerTx"),
      cardano: `${formatNumber(Math.round(metrics.cardanoEnergyPerTx * 10000) / 10000)} kWh`,
      bitcoin: `${formatNumber(Math.round(metrics.bitcoinEnergyPerTx * 100) / 100)} kWh`,
    },
    {
      label: t("ecoImpact.results.co2PerTx"),
      cardano: `${formatNumber(Math.round(metrics.cardanoCO2PerTx * 10000) / 10000)} kg`,
      bitcoin: `${formatNumber(Math.round(metrics.bitcoinCO2PerTx * 100) / 100)} kg`,
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-text-lg font-semibold text-text'>
        {t("ecoImpact.results.comparisonTitle")}
      </h3>
      <p className='text-text-sm text-grayTextPrimary'>
        {t("ecoImpact.results.comparisonDescription")}
      </p>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]'>
        <div
          className='flex flex-col gap-3 rounded-m border-2 p-4'
          style={{
            borderColor: isDark ? "rgba(34, 197, 94, 0.4)" : "#86efac",
            backgroundColor: isDark ? "rgba(22, 101, 52, 0.1)" : "#f0fdf4",
          }}
        >
          <div className='flex items-center gap-2'>
            <img
              src={AdaIcon}
              alt='Cardano'
              className='h-8 w-8 rounded-max'
            />
            <span
              className='text-text-md font-semibold'
              style={{ color: isDark ? "#4ade80" : "#166534" }}
            >
              {t("ecoImpact.results.cardano")}
            </span>
          </div>
          {rows.map(row => (
            <div
              key={row.label}
              className='flex items-center justify-between'
            >
              <span
                className='text-text-sm'
                style={{ color: isDark ? "#86efac" : "#15803d" }}
              >
                {row.label}
              </span>
              <span className='text-text-sm font-medium text-text'>
                {row.cardano}
              </span>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-center'>
          <span className='text-text-sm font-medium text-grayTextPrimary'>
            vs
          </span>
        </div>

        <div
          className='flex flex-col gap-3 rounded-m border-2 p-4'
          style={{
            borderColor: isDark ? "rgba(251, 191, 36, 0.4)" : "#fde68a",
            backgroundColor: isDark ? "rgba(120, 53, 15, 0.1)" : "#fffbeb",
          }}
        >
          <div className='flex items-center gap-2'>
            <img src={BitcoinIcon} alt='Bitcoin' className='h-8 w-8' />
            <span
              className='text-text-md font-semibold'
              style={{ color: isDark ? "#fbbf24" : "#92400e" }}
            >
              {t("ecoImpact.results.bitcoin")}
            </span>
          </div>
          {rows.map(row => (
            <div
              key={row.label}
              className='flex items-center justify-between'
            >
              <span
                className='text-text-sm'
                style={{ color: isDark ? "#fcd34d" : "#b45309" }}
              >
                {row.label}
              </span>
              <span className='text-text-sm font-medium text-text'>
                {row.bitcoin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
