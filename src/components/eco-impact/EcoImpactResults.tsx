import type { FC } from "react";
import { useMemo } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAnalyticsRate } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { formatNumber, LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TreesProgressBar } from "./TreesProgressBar";
import {
  calcCardanoAnnualEnergyGWh,
  calcStakePercent,
  calcUserCardanoEnergyKWh,
  calcEnergyEfficiency,
  calcEnergySaved,
  calcCO2Saved,
  calcTrees,
} from "@/utils/ecoImpact/calculations";
import { formatEnergy, formatCO2 } from "@/utils/ecoImpact/formatting";

interface EcoImpactResultsProps {
  stakedAda: number;
}

export const EcoImpactResults: FC<EcoImpactResultsProps> = ({ stakedAda }) => {
  const { t } = useAppTranslation("common");

  const rateQuery = useFetchAnalyticsRate();
  const miscBasicQuery = useFetchMiscBasic();
  const { data: basicData } = miscBasicQuery;
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const isLoading = rateQuery.isLoading || miscBasicQuery.isLoading;

  const calculations = useMemo(() => {
    const rateData = rateQuery.data?.data;
    const lastDataItem = (rateData ?? [])[0];
    const countPoolRelayUniq =
      lastDataItem?.stat?.count_pool_relay_uniq ?? 0;

    const totalNetworkActiveStake = miscConst?.epoch_stat?.stake?.active ?? 0;

    if (!countPoolRelayUniq || !totalNetworkActiveStake || !stakedAda) {
      return null;
    }

    const cardanoAnnualEnergyGWh = calcCardanoAnnualEnergyGWh(countPoolRelayUniq);

    const stakePercent = calcStakePercent(stakedAda, totalNetworkActiveStake);
    const userCardanoEnergyKWh = calcUserCardanoEnergyKWh(stakePercent, cardanoAnnualEnergyGWh);

    const energyEfficiency = calcEnergyEfficiency(cardanoAnnualEnergyGWh);
    const energySaved = calcEnergySaved(userCardanoEnergyKWh, energyEfficiency);
    const co2Saved = calcCO2Saved(energySaved);
    const trees = calcTrees(co2Saved);

    return {
      energyEfficiency,
      energySaved,
      co2Saved,
      trees,
    };
  }, [rateQuery.data, miscConst, stakedAda]);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-3 md:flex-row'>
          <LoadingSkeleton height='148px' width='100%' />
          <LoadingSkeleton height='148px' width='100%' />
          <LoadingSkeleton height='148px' width='100%' />
        </div>
        <LoadingSkeleton height='208px' width='100%' />
      </div>
    );
  }

  if (!calculations) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
        <div className='flex flex-col gap-1 rounded-m border border-border bg-background p-4'>
          <span className='text-text-xs text-grayTextPrimary'>
            {t("ecoImpact.results.energyEfficiency")}
          </span>
          <span className='text-text-xl font-bold text-text'>
            {formatNumber(Math.round(calculations.energyEfficiency))}x
          </span>
          <span className='text-text-xs text-grayTextPrimary'>
            {t("ecoImpact.results.energyEfficiencyUnit")}
          </span>
        </div>

        <div className='flex flex-col gap-1 rounded-m border border-border bg-background p-4'>
          <span className='text-text-xs text-grayTextPrimary'>
            {t("ecoImpact.results.energySaved")}
          </span>
          <span className='text-text-xl font-bold text-text'>
            {formatNumber(formatEnergy(calculations.energySaved).value)}
          </span>
          <span className='text-text-xs text-grayTextPrimary'>
            {formatEnergy(calculations.energySaved).unit}
          </span>
        </div>

        <div className='flex flex-col gap-1 rounded-m border border-border bg-background p-4'>
          <span className='text-text-xs text-grayTextPrimary'>
            {t("ecoImpact.results.co2Saved")}
          </span>
          <span className='text-text-xl font-bold text-text'>
            {formatNumber(formatCO2(calculations.co2Saved).value)}
          </span>
          <span className='text-text-xs text-grayTextPrimary'>
            {formatCO2(calculations.co2Saved).unit}
          </span>
        </div>
      </div>

      <TreesProgressBar trees={calculations.trees} />
    </div>
  );
};
