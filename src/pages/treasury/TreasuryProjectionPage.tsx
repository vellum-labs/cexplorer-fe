import { useState, useEffect, useMemo } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { RangeSlider } from "@vellumlabs/cexplorer-sdk";
import { useFetchEpochDetailParam } from "@/services/epoch";
import { useFetchAdaPots } from "@/services/analytics";
import { useConstStore } from "@/stores/constStore";
import ReactEcharts from "echarts-for-react";
import GraphWatermark from "@/components/global/graphs/GraphWatermark";
import { useGraphColors } from "@/hooks/useGraphColors";

interface ProjectionDataPoint {
  epoch: number;
  treasury: number;
  toTreasury: number;
  reserves: number;
}

export const TreasuryProjectionPage = () => {
  const { constData } = useConstStore();
  const currentEpoch = constData?.epoch?.no ?? 0;

  const { data: epochParam } = useFetchEpochDetailParam(currentEpoch);
  const { data: adaPotsResponse } = useFetchAdaPots();

  const { textColor, bgColor, splitLineColor } = useGraphColors();

  const currentAdaPot = adaPotsResponse?.data?.data?.[0];
  const fees = (currentAdaPot?.fees ?? 0) / 1_000_000;
  const reserves = (currentAdaPot?.reserves ?? 0) / 1_000_000;
  const treasury = (currentAdaPot?.treasury ?? 0) / 1_000_000;

  const [tau, setTau] = useState<number>(0.2);
  const [rho, setRho] = useState<number>(0.003);

  useEffect(() => {
    if (epochParam?.monetary_expand_rate !== undefined) {
      setTau(epochParam.monetary_expand_rate);
    }
    if (epochParam?.treasury_growth_rate !== undefined) {
      setRho(epochParam.treasury_growth_rate);
    }
  }, [epochParam]);

  // Calculate "To Treasury" using the formula: τ × [(ρ × Reserves) + Fees]
  const calculateToTreasury = (
    tauValue: number,
    rhoValue: number,
    reservesValue: number,
    feesValue: number,
  ) => {
    return tauValue * (rhoValue * reservesValue + feesValue);
  };

  // Generate projection data for next 100 epochs
  const projectionData = useMemo(() => {
    const epochs = 100;
    const data: ProjectionDataPoint[] = [];
    let currentTreasury = treasury;
    let currentReserves = reserves;
    const avgFees = fees;

    for (let i = 0; i <= epochs; i++) {
      const epochNo = currentEpoch + i;
      const toTreasury = calculateToTreasury(tau, rho, currentReserves, avgFees);

      data.push({
        epoch: epochNo,
        treasury: currentTreasury,
        toTreasury: toTreasury,
        reserves: currentReserves,
      });

      // Update for next epoch
      currentTreasury += toTreasury;
      currentReserves -= rho * currentReserves;
    }

    return data;
  }, [tau, rho, treasury, reserves, fees, currentEpoch]);

  // Current epoch "To Treasury" value
  const currentToTreasury = calculateToTreasury(tau, rho, reserves, fees);

  // ECharts configuration
  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: bgColor,
        borderColor: splitLineColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          const epoch = params[0].axisValue;
          let tooltip = `<div style="font-weight: 600; margin-bottom: 8px;">Epoch ${epoch}</div>`;
          params.forEach((param: any) => {
            tooltip += `<div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 4px;">
              <span>${param.marker} ${param.seriesName}:</span>
              <span style="font-weight: 600;">${param.value.toLocaleString()} ₳</span>
            </div>`;
          });
          return tooltip;
        },
      },
      legend: {
        data: ["Treasury Balance", "To Treasury"],
        textStyle: {
          color: textColor,
        },
        top: 0,
      },
      grid: {
        left: "10",
        right: "10",
        bottom: "10",
        top: "60",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: projectionData.map(d => d.epoch),
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          color: textColor,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Treasury Balance (ADA)",
          nameTextStyle: {
            color: textColor,
          },
          position: "left",
          axisLine: {
            show: true,
            lineStyle: {
              color: textColor,
            },
          },
          axisLabel: {
            color: textColor,
            formatter: (value: number) => {
              if (value >= 1_000_000) {
                return `${(value / 1_000_000).toFixed(1)}M`;
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
        {
          type: "value",
          name: "To Treasury (ADA)",
          nameTextStyle: {
            color: textColor,
          },
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              color: textColor,
            },
          },
          axisLabel: {
            color: textColor,
            formatter: (value: number) => {
              if (value >= 1_000_000) {
                return `${(value / 1_000_000).toFixed(1)}M`;
              }
              return value.toLocaleString();
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "Treasury Balance",
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
          name: "To Treasury",
          type: "bar",
          yAxisIndex: 1,
          data: projectionData.map(d => d.toTreasury),
          itemStyle: {
            color: "#10b981",
            opacity: 0.6,
          },
        },
      ],
    }),
    [projectionData, textColor, bgColor, splitLineColor],
  );

  console.log("tau", tau);
  console.log("rho", rho);
  console.log("fees", fees);
  console.log("reserves", reserves);
  console.log("treasury", treasury);
  console.log("currentToTreasury", currentToTreasury);
  console.log("projectionData", projectionData);

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
          <div className='mb-3'>
            <h3 className='mb-1 text-text-lg font-semibold'>
              Treasury Projection Calculator
            </h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Adjust the parameters below to see how the treasury will grow.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <label className='text-text-sm font-medium'>
                  Monetary Expand Rate (τ)
                </label>
                <span className='text-text-sm font-semibold text-primary'>
                  {(tau * 100).toFixed(1)}%
                </span>
              </div>
              <RangeSlider
                min={0}
                max={1}
                step={0.001}
                value={tau}
                onChange={setTau}
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <label className='text-text-sm font-medium'>
                  Treasury Growth Rate (ρ)
                </label>
                <span className='text-text-sm font-semibold text-primary'>
                  {(rho * 100).toFixed(2)}%
                </span>
              </div>
              <RangeSlider
                min={0}
                max={0.5}
                step={0.0001}
                value={rho}
                onChange={setRho}
              />
            </div>
          </div>
        </div>

        <div className='mt-3 w-full rounded-l border border-border bg-cardBg p-2'>
          <div className='mb-2'>
            <h3 className='text-text-lg font-semibold'>
              Treasury Projection (100 Epochs)
            </h3>
            <p className='text-text-sm text-grayTextPrimary'>
              Formula: To Treasury = τ × [(ρ × Reserves) + Fees]
            </p>
          </div>
          <div className='relative h-[450px] w-full'>
            <GraphWatermark />
            {treasury > 0 && reserves > 0 && currentEpoch > 0 ? (
              <ReactEcharts
                key={`chart-${tau}-${rho}`}
                option={chartOption}
                style={{ height: "100%", width: "100%" }}
                notMerge={true}
                lazyUpdate={true}
              />
            ) : (
              <div className='flex h-full items-center justify-center text-grayTextPrimary'>
                Loading chart data...
              </div>
            )}
          </div>
        </div>
      </div>
    </PageBase>
  );
};
