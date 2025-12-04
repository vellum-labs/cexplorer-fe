import { useState, useEffect, useMemo } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { RangeSlider } from "@vellumlabs/cexplorer-sdk";
import { useFetchEpochDetailParam } from "@/services/epoch";
import { useFetchAdaPots } from "@/services/analytics";
import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";
import { EPOCH_LENGTH_DAYS } from "@/constants/confVariables";
import { RotateCcw } from "lucide-react";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

interface ProjectionDataPoint {
  epoch: number;
  year: number;
  treasury: number;
  reserves: number;
}

const STORAGE_KEY_FEES = "treasuryProjection_avgFees";
const STORAGE_KEY_WITHDRAWAL = "treasuryProjection_annualWithdrawal";
const DEFAULT_ANNUAL_WITHDRAWAL = 320_000_000;

export const TreasuryProjectionPage = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const currentEpoch = miscConst?.epoch?.no ?? 0;

  const { data: epochParam, isLoading: isLoadingEpoch } =
    useFetchEpochDetailParam(currentEpoch);
  const { data: adaPotsResponse, isLoading: isLoadingPots } = useFetchAdaPots();

  const { textColor, bgColor, splitLineColor } = useGraphColors();

  const currentAdaPot = adaPotsResponse?.data?.data?.[0];
  const currentFees = (currentAdaPot?.fees ?? 1) / 1_000_000;
  const initialReserves = (currentAdaPot?.reserves ?? 1) / 1_000_000;
  const initialTreasury = (currentAdaPot?.treasury ?? 1) / 1_000_000;

  const tau = epochParam?.treasury_growth_rate ?? 0.2;
  const rho = epochParam?.monetary_expand_rate ?? 0.003;

  const [avgFeesPerEpoch, setAvgFeesPerEpoch] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_FEES);
      return saved ? Number(saved) : currentFees;
    }
    return currentFees;
  });

  const [annualWithdrawal, setAnnualWithdrawal] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_WITHDRAWAL);
      return saved ? Number(saved) : DEFAULT_ANNUAL_WITHDRAWAL;
    }
    return DEFAULT_ANNUAL_WITHDRAWAL;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_FEES, avgFeesPerEpoch.toString());
    }
  }, [avgFeesPerEpoch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_WITHDRAWAL, annualWithdrawal.toString());
    }
  }, [annualWithdrawal]);

  const handleReset = () => {
    setAvgFeesPerEpoch(currentFees);
    setAnnualWithdrawal(DEFAULT_ANNUAL_WITHDRAWAL);
  };

  const EPOCHS_PER_YEAR = Math.round(365.25 / EPOCH_LENGTH_DAYS);
  const PROJECTION_YEARS = 20;
  const TOTAL_EPOCHS = PROJECTION_YEARS * EPOCHS_PER_YEAR;

  const projectionData = useMemo(() => {
    const data: ProjectionDataPoint[] = [];
    let currentTreasury = initialTreasury;
    let currentReserves = initialReserves;
    const withdrawalPerEpoch = annualWithdrawal / EPOCHS_PER_YEAR;

    for (let i = 0; i <= TOTAL_EPOCHS; i++) {
      const epochNo = currentEpoch + i;
      const yearNumber = i / EPOCHS_PER_YEAR;

      data.push({
        epoch: epochNo,
        year: yearNumber,
        treasury: Math.max(0, currentTreasury),
        reserves: Math.max(0, currentReserves),
      });

      const treasuryIncomeFromReserves = currentReserves * rho * tau;
      const treasuryIncomeFromFees = avgFeesPerEpoch * tau;
      const totalTreasuryIncome =
        treasuryIncomeFromReserves + treasuryIncomeFromFees;

      currentTreasury =
        currentTreasury + totalTreasuryIncome - withdrawalPerEpoch;
      currentReserves = currentReserves - currentReserves * rho;

      currentTreasury = Math.max(0, currentTreasury);
      currentReserves = Math.max(0, currentReserves);
    }

    return data;
  }, [
    tau,
    rho,
    initialTreasury,
    initialReserves,
    avgFeesPerEpoch,
    annualWithdrawal,
    currentEpoch,
    TOTAL_EPOCHS,
    EPOCHS_PER_YEAR,
  ]);

  const chartOption = useMemo(
    () => ({
      animation: false,
      tooltip: {
        trigger: "axis",
        backgroundColor: bgColor,
        borderColor: splitLineColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const dataPoint = projectionData[dataIndex];
          const currentYear = new Date().getFullYear();
          const yearDecimal = dataPoint.year;
          const fullYear = currentYear + Math.floor(yearDecimal);
          const monthDecimal = (yearDecimal % 1) * 12;
          const month = Math.round(monthDecimal) + 1;
          const displayMonth = month > 12 ? month - 12 : month;
          const displayYear = month > 12 ? fullYear + 1 : fullYear;
          const formattedDate = `${displayMonth.toString().padStart(2, "0")}.${displayYear}`;

          let tooltip = `<div style="font-weight: 600; margin-bottom: 8px;">Epoch ${dataPoint.epoch} (${formattedDate})</div>`;
          params.forEach((param: any) => {
            const value = typeof param.value === "number" ? param.value : 0;
            tooltip += `<div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 4px;">
              <span>${param.marker} ${param.seriesName}:</span>
              <span style="font-weight: 600;">${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ₳</span>
            </div>`;
          });
          return tooltip;
        },
      },
      legend: {
        data: ["Treasury", "Reserves"],
        textStyle: {
          color: textColor,
        },
        top: 0,
      },
      grid: {
        left: "10",
        right: "30",
        bottom: "10",
        top: "60",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: projectionData.map(d => {
          const currentYear = new Date().getFullYear();
          return `${currentYear + Math.floor(d.year)}`;
        }),
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          color: textColor,
          hideOverlap: true,
        },
      },
      yAxis: {
        type: "value",
        name: "ADA",
        nameTextStyle: {
          color: textColor,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          color: textColor,
          formatter: (value: number) => {
            if (value >= 1_000_000_000) {
              return `${(value / 1_000_000_000).toFixed(1)}B`;
            }
            if (value >= 1_000_000) {
              return `${(value / 1_000_000).toFixed(0)}M`;
            }
            return value.toLocaleString();
          },
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      series: [
        {
          name: "Treasury",
          type: "line",
          smooth: true,
          data: projectionData.map(d => d.treasury),
          itemStyle: {
            color: "#3b82f6",
          },
          lineStyle: {
            width: 3,
            color: "#3b82f6",
          },
          areaStyle: {
            color: "#3b82f6",
            opacity: 0.1,
          },
        },
        {
          name: "Reserves",
          type: "line",
          smooth: true,
          data: projectionData.map(d => d.reserves),
          itemStyle: {
            color: "#10b981",
          },
          lineStyle: {
            width: 3,
            color: "#10b981",
          },
          areaStyle: {
            color: "#10b981",
            opacity: 0.1,
          },
        },
      ],
    }),
    [projectionData, textColor, bgColor, splitLineColor, EPOCHS_PER_YEAR],
  );

  return (
    <PageBase
      metadataTitle='treasuryProjection'
      title='Treasury Projection'
      breadcrumbItems={[
        {
          label: "Treasury Projection",
        },
      ]}
      adsCarousel={false}
    >
      <div className='w-full max-w-desktop p-mobile lg:p-desktop'>
        <div className='w-full rounded-l border border-border bg-cardBg p-2'>
          <div className='mb-3 flex items-start justify-between'>
            <div>
              <h3 className='mb-1 text-text-lg font-semibold'>
                Treasury & Reserves Projection
              </h3>
              <p className='text-text-sm text-grayTextPrimary'>
                Adjust parameters to project Treasury and Reserves balance over
                the next {PROJECTION_YEARS} years.
              </p>
            </div>
            <button
              onClick={handleReset}
              className='flex items-center gap-1 rounded-s border border-border bg-cardBg px-2 py-1 text-text-sm text-grayTextPrimary transition-colors hover:border-primary hover:text-primary'
              title='Reset to default values'
            >
              <RotateCcw size={16} />
              <span className='hidden sm:inline'>Reset</span>
            </button>
          </div>

          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <label className='text-text-sm font-medium'>
                  Average Fees per Epoch
                </label>
                <span className='text-text-sm font-semibold text-primary'>
                  {avgFeesPerEpoch.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₳
                </span>
              </div>
              <RangeSlider
                min={0}
                max={1_000_000}
                step={1000}
                value={avgFeesPerEpoch}
                onChange={setAvgFeesPerEpoch}
              />
              <p className='text-text-xs text-grayTextPrimary'>
                Current:{" "}
                {currentFees.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}{" "}
                ₳
              </p>
            </div>

            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <label className='text-text-sm font-medium'>
                  Annual Treasury Withdrawal
                </label>
                <span className='text-text-sm font-semibold text-primary'>
                  {(annualWithdrawal / 1_000_000).toFixed(0)}M ₳
                </span>
              </div>
              <RangeSlider
                min={0}
                max={initialTreasury}
                step={1_000_000}
                value={annualWithdrawal}
                onChange={setAnnualWithdrawal}
              />
            </div>
          </div>
        </div>

        <div className='mt-3 w-full rounded-l border border-border bg-cardBg p-2'>
          <div className='mb-2'>
            <h3 className='text-text-lg font-semibold'>
              {PROJECTION_YEARS}-Year Projection
            </h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Treasury income: {(tau * 100).toFixed(1)}% of (Reserve emission +
              Fees) • Reserve emission: {(rho * 100).toFixed(2)}% per epoch
            </p>
          </div>
          <div className='relative h-[450px] w-full'>
            <GraphWatermark />
            {isLoadingPots || isLoadingEpoch || !currentEpoch ? (
              <div className='flex h-full items-center justify-center text-grayTextPrimary'>
                Loading chart data...
              </div>
            ) : initialTreasury > 0 && initialReserves > 0 ? (
              <ReactEcharts
                option={chartOption}
                style={{ height: "100%", width: "100%" }}
                notMerge={true}
                lazyUpdate={true}
              />
            ) : (
              <div className='flex h-full items-center justify-center text-grayTextPrimary'>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </PageBase>
  );
};
