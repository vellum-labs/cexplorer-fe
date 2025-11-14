import type { FC } from "react";
import { useState, useEffect } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { Input, AdsCarousel } from "@vellumlabs/cexplorer-sdk";
import { PoolSelector } from "@/components/staking-calculator/PoolSelector";
import { PoolDetailCalculatorOverview } from "@/components/staking-calculator/PoolDetailCalculatorOverview";
import { useFetchPoolDetail } from "@/services/pools";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { activeSlotsCoeff, epochLength } from "@/constants/confVariables";
import { generateImageUrl } from "@/utils/generateImageUrl";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

const STORAGE_KEY_AMOUNT = "stakingCalculator_adaAmount";
const STORAGE_KEY_POOL = "stakingCalculator_selectedPool";

export const StakingCalculatorPage: FC = () => {
  const [adaAmount, setAdaAmount] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY_AMOUNT) || "10000";
    }
    return "10000";
  });

  const [selectedPool, setSelectedPool] = useState<Pool | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_POOL);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [selectedRoa, setSelectedRoa] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_AMOUNT, adaAmount);
    }
  }, [adaAmount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedPool) {
        localStorage.setItem(STORAGE_KEY_POOL, JSON.stringify(selectedPool));
      } else {
        localStorage.removeItem(STORAGE_KEY_POOL);
      }
    }
    setSelectedRoa(null);
  }, [selectedPool]);

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setAdaAmount(value);
    }
  };

  const poolQuery = useFetchPoolDetail(
    selectedPool?.pool_id?.startsWith("pool1")
      ? selectedPool?.pool_id
      : undefined,
    selectedPool?.pool_id?.startsWith("pool1")
      ? undefined
      : selectedPool?.pool_id,
  );

  const miscBasicQuery = useFetchMiscBasic();
  const { data: basicData } = miscBasicQuery;
  const miscConst = useMiscConst(basicData?.data.version.const);

  const poolData = poolQuery.data?.data;

  const estimatedBlocks =
    ((epochLength *
      activeSlotsCoeff *
      (1 - (miscConst?.epoch_param?.decentralisation ?? 0))) /
      (miscConst?.epoch_stat.stake.active ?? 1)) *
    (poolData?.active_stake ?? 1);

  return (
    <PageBase
      metadataTitle='stakingCalculator'
      title='Rewards Calculator'
      subTitle='Calculate your potential rewards'
      breadcrumbItems={[{ label: "Rewards Calculator" }]}
      adsCarousel={false}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile md:flex-row md:items-start md:p-desktop'>
          <div className='flex flex-1 flex-col gap-4 rounded-xl border border-border bg-cardBg p-4 md:p-6'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-text-lg font-semibold'>
                Amount of ADA to stake
              </h3>
              <div className='relative'>
                <Input
                  value={adaAmount}
                  onchange={handleAmountChange}
                  placeholder='Enter amount'
                  className='pr-20'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  <span className='text-text-sm font-medium text-grayTextPrimary'>
                    ADA
                  </span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <div className='flex flex-col items-center gap-1 rounded-xl border border-border bg-cardBg p-4'>
                <p className='text-text-2xl font-bold'>
                  {selectedPool && (selectedRoa ?? poolData?.stats?.recent?.roa)
                    ? `${adaAmount ? ((Number(adaAmount) * (selectedRoa ?? poolData?.stats?.recent?.roa ?? 0)) / 100).toFixed(2) : "0"} ADA`
                    : adaAmount
                      ? `${((Number(adaAmount) * 2.71) / 100).toFixed(2)} ADA`
                      : "0 ADA"}
                </p>
                <p className='text-center text-text-sm text-grayTextPrimary'>
                  Staking Reward per year in ADA
                </p>
              </div>
              <div className='flex flex-col items-center gap-1 rounded-xl border border-border bg-cardBg p-4'>
                <p className='text-text-2xl font-bold'>
                  {selectedPool && (selectedRoa ?? poolData?.stats?.recent?.roa)
                    ? `${(selectedRoa ?? poolData?.stats?.recent?.roa ?? 0).toFixed(2)}%`
                    : "2.71%"}
                </p>
                <p className='text-center text-text-sm text-grayTextPrimary'>
                  Annualized staking reward
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-text-lg font-semibold'>
                Select a stake pool
              </h3>
              <p className='text-text-sm text-grayTextPrimary'>
                You can leave the stake pool field empty to calculate estimated
                rewards based on general network averages.
              </p>
              <p className='text-text-sm text-grayTextPrimary'>
                If you select a specific pool, the calculator will use that
                pool's individual parameters to provide a more accurate
                estimate.
              </p>
              <PoolSelector
                selectedPool={selectedPool}
                onSelectPool={setSelectedPool}
              />
            </div>

            {selectedPool && (
              <PoolDetailCalculatorOverview
                query={poolQuery}
                estimatedBlocks={estimatedBlocks}
                onRoaChange={setSelectedRoa}
              />
            )}
          </div>

          <div className='flex w-full flex-col-reverse gap-3 md:w-[400px] md:flex-col'>
            <div className='flex flex-col gap-3 rounded-xl border border-border bg-cardBg p-4 md:p-6'>
              <h3 className='text-text-lg font-semibold'>Information</h3>
              <div className='flex flex-col gap-3 text-text-sm text-grayTextPrimary'>
                <p>
                  This is a simplified, open-source version of a{" "}
                  <a
                    href='https://cardano.org/calculator/'
                    className='text-primary'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Cardano Foundation's staking rewards calculator
                  </a>
                  .
                </p>
                <p>
                  It uses live network data to estimate potential rewards when
                  you delegate your ADA to a staking pool.
                </p>
                <p>
                  The calculator uses a Monte Carlo simulation, which runs many
                  random scenarios to estimate possible outcomes. This gives a
                  probabilistic view of potential rewards based on different
                  network conditions and staking parameters.
                </p>
                <p>
                  Enter any amount of ADA to see a simulation of your potential
                  returns.
                </p>
                <p>
                  It uses current blockchain parameters for the calculation.
                </p>
              </div>
            </div>

            <AdsCarousel
              generateImageUrl={generateImageUrl}
              miscBasicQuery={miscBasicQuery}
              singleItem
              className='p-0 md:p-0'
            />
          </div>
        </div>
      </section>
    </PageBase>
  );
};
