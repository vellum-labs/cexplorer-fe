import type { GovernanceActionList } from "@/types/governanceTypes";
import type { NCLPeriod } from "@/constants/ncl";
import type { FC } from "react";

import { useADADisplay } from "@/hooks/useADADisplay";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip, useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { CircleHelp } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { formatAbbreviatedADA, formatFullADA } from "@/utils/formatADA";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useNavigate } from "@tanstack/react-router";
import { NCL_WITHDRAWAL_COLORS } from "@/constants/ncl";

interface NCLProgressBarProps {
  nclPeriod: NCLPeriod;
  withdrawals: GovernanceActionList[];
  getWithdrawalAmount: (item: GovernanceActionList) => number;
}

interface SegmentData {
  name: string;
  amount: number;
  percent: number;
  color: string;
  isRemaining?: boolean;
  actionId?: string;
}

export const NCLProgressBar: FC<NCLProgressBarProps> = ({
  nclPeriod,
  withdrawals,
  getWithdrawalAmount,
}) => {
  const { t } = useAppTranslation();
  const { formatLovelace } = useADADisplay();
  const { textColor, bgColor } = useGraphColors();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const remainingBudgetColor = theme === "dark" ? "#374151" : "#d1d5db";

  const totalWithdrawn = useMemo(
    () => withdrawals.reduce((sum, item) => sum + getWithdrawalAmount(item), 0),
    [withdrawals, getWithdrawalAmount],
  );

  const limit = nclPeriod.limit;
  const utilizationPercent = (totalWithdrawn / limit) * 100;
  const isExceeded = utilizationPercent > 100;

  const segments: SegmentData[] = useMemo(() => {
    const result: SegmentData[] = [];

    withdrawals.forEach((withdrawal, index) => {
      const amount = getWithdrawalAmount(withdrawal);
      const percent = (amount / limit) * 100;
      if (amount > 0) {
        result.push({
          name: withdrawal.anchor?.offchain?.name || `Withdrawal ${index + 1}`,
          amount,
          percent,
          color: NCL_WITHDRAWAL_COLORS[index % NCL_WITHDRAWAL_COLORS.length],
          actionId: withdrawal.ident?.id,
        });
      }
    });

    const remaining = Math.max(0, limit - totalWithdrawn);
    if (remaining > 0) {
      const remainingPercent = (remaining / limit) * 100;
      result.push({
        name: t("governance.treasury.remainingBudget"),
        amount: remaining,
        percent: remainingPercent,
        color: remainingBudgetColor,
        isRemaining: true,
      });
    }

    return result;
  }, [
    withdrawals,
    getWithdrawalAmount,
    limit,
    totalWithdrawn,
    t,
    remainingBudgetColor,
  ]);

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        appendToBody: true,
        confine: true,
        backgroundColor: bgColor,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          const segment = params.data;
          return `
            <strong>${segment.name}</strong><br/>
            <strong>${t("governance.treasury.amount")}:</strong> ${formatLovelace(segment.rawAmount)}<br/>
            <strong>${t("governance.treasury.ofNCL")}:</strong> ${segment.percent.toFixed(1)}%
          `;
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      xAxis: {
        type: "value",
        max: Math.max(limit, totalWithdrawn),
        show: false,
      },
      yAxis: {
        type: "category",
        show: false,
        data: [""],
      },
      series: segments.map(segment => ({
        type: "bar",
        stack: "total",
        name: segment.name,
        cursor: segment.actionId ? "pointer" : "default",
        data: [
          {
            value: segment.amount,
            name: segment.name,
            rawAmount: segment.amount,
            percent: segment.percent,
            actionId: segment.actionId,
            isRemaining: segment.isRemaining,
            itemStyle: { color: segment.color },
          },
        ],
        barMinHeight: 1,
      })),
    };
  }, [segments, limit, totalWithdrawn, t, formatLovelace, bgColor, textColor]);

  const handleChartClick = (params: any) => {
    const actionId = params.data?.actionId;
    if (actionId) {
      navigate({
        to: "/gov/action/$id",
        params: { id: encodeURIComponent(actionId) },
      });
    }
  };

  return (
    <div className='mb-4 rounded-xl border border-border bg-darker p-4'>
      <div className='mb-3 flex items-center gap-1'>
        <p className='font-medium'>{t("governance.treasury.nclUtilization")}</p>
        <Tooltip
          content={
            <p className='max-w-[250px]'>
              {t("governance.treasury.nclTooltip")}
            </p>
          }
        >
          <CircleHelp
            size={15}
            className='cursor-pointer text-grayTextPrimary'
          />
        </Tooltip>
      </div>

      <div className='flex items-center justify-between'>
        <Tooltip content={formatFullADA(totalWithdrawn)}>
          <span
            className={`text-xl font-bold ${isExceeded ? "text-red-500" : ""}`}
          >
            {formatAbbreviatedADA(totalWithdrawn)}
          </span>
        </Tooltip>
        <Tooltip content={formatFullADA(limit)}>
          <span className='text-xl font-bold text-grayTextPrimary'>
            {formatAbbreviatedADA(limit)}
          </span>
        </Tooltip>
      </div>

      <div className='rounded-lg w-full bg-background'>
        <ReactECharts
          key={`ncl-chart-${segments.length}`}
          option={chartOption}
          style={{ height: "32px", width: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge={true}
          onEvents={{ click: handleChartClick }}
        />
      </div>

      <div className='mt-1 flex items-center justify-between'>
        <span
          className={`text-sm font-medium ${isExceeded ? "text-red-500" : "text-primary"}`}
        >
          {utilizationPercent.toFixed(1)}% {t("governance.treasury.utilized")}
        </span>
        {isExceeded && (
          <span className='text-sm text-red-500'>
            {t("governance.treasury.exceededLimit")}
          </span>
        )}
      </div>

      <div className='text-sm mt-1 text-grayTextPrimary'>
        {t("governance.treasury.approvedForEpochs")}: {nclPeriod.startEpoch} -{" "}
        {nclPeriod.endEpoch}
      </div>
    </div>
  );
};
