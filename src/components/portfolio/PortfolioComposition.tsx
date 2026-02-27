import type { FC } from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useNavigate } from "@tanstack/react-router";
import {
  LoadingSkeleton,
  formatNumberWithSuffix,
  formatString,
  getAssetFingerprint,
} from "@vellumlabs/cexplorer-sdk";

type TabType = "category" | "breakdown";

const CHART_COLORS = {
  ada: "#0284C7",
  tokens: "#1E6CB0",
  nfts: "#7ECBF5",
  empty: "#E4E7EC",
};

const BREAKDOWN_COLORS = [
  "#0284C7",
  "#003F72",
  "#0268A2",
  "#36A2D9",
  "#7ECBF5",
  "#0891B2",
  "#4F46E5",
  "#7C3AED",
  "#BE185D",
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#16A34A",
  "#0D9488",
  "#B5DFF5",
  "#D1ECFA",
  "#94A3B8",
];

export const PortfolioComposition: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const navigate = useNavigate();
  const { textColor, bgColor } = useGraphColors();
  const { wallets, selectedWalletId } = usePortfolioStore();
  const { walletDataList, selectedWalletData, totals, breakdownItems, isLoading } =
    usePortfolioData();
  const [activeTab, setActiveTab] = useState<TabType>("category");

  const selectedWallet = selectedWalletId
    ? wallets.find(w => w.id === selectedWalletId)
    : null;

  const subtitle = selectedWallet
    ? selectedWallet.name
    : t("portfolio.composition.allAddresses");

  const displayTotals = selectedWalletData
    ? {
        adaBalance: selectedWalletData.adaBalance,
        tokenCount: selectedWalletData.tokenCount,
        nftCount: selectedWalletData.nftCount,
        tokenValueAda: selectedWalletData.tokenValueAda,
        nftValueAda: selectedWalletData.nftValueAda,
        totalValueAda: selectedWalletData.totalValueAda,
      }
    : totals;

  const adaInAda = displayTotals.adaBalance / 1e6;

  const getCategoryOption = () => {
    const data = [
      {
        value: adaInAda || 0,
        name: "ADA",
        itemStyle: { color: CHART_COLORS.ada },
        emphasis: { itemStyle: { color: CHART_COLORS.ada } },
      },
      {
        value: displayTotals.tokenValueAda || 0,
        name: t("portfolio.composition.tokens"),
        itemStyle: { color: CHART_COLORS.tokens },
        emphasis: { itemStyle: { color: CHART_COLORS.tokens } },
      },
      {
        value: displayTotals.nftValueAda || 0,
        name: t("portfolio.composition.nfts"),
        itemStyle: { color: CHART_COLORS.nfts },
        emphasis: { itemStyle: { color: CHART_COLORS.nfts } },
      },
    ];

    const hasValue = data.some(d => d.value > 0);
    if (!hasValue) {
      data[0].value = 1;
      data[0].itemStyle.color = CHART_COLORS.empty;
      data[0].emphasis.itemStyle.color = CHART_COLORS.empty;
    }

    return {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: bgColor,
        textStyle: { color: textColor },
        formatter: ({ name, value, percent }: any) =>
          `<b>${name}</b><br/>₳ ${formatNumberWithSuffix(value)}<br/>${percent.toFixed(1)}%`,
      },
      legend: {
        orient: "vertical" as const,
        left: 0,
        top: "center",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        textStyle: { color: textColor, fontSize: 13 },
        data: ["ADA", t("portfolio.composition.tokens"), t("portfolio.composition.nfts")],
      },
      series: [
        {
          type: "pie",
          radius: ["55%", "80%"],
          center: ["65%", "50%"],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          data,
        },
      ],
    };
  };

  const getBreakdownOption = () => {
    const data = breakdownItems.map((item, i) => ({
      value: item.valueAda,
      name: item.name,
      itemStyle: { color: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] },
      emphasis: {
        itemStyle: { color: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] },
      },
    }));

    const hasValue = data.some(d => d.value > 0);
    if (!hasValue) {
      return getCategoryOption();
    }

    return {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: bgColor,
        textStyle: { color: textColor },
        formatter: ({ name, value, percent }: any) =>
          `<b>${name}</b><br/>₳ ${formatNumberWithSuffix(value)}<br/>${percent.toFixed(1)}%`,
      },
      legend: { show: false },
      series: [
        {
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          data,
        },
      ],
    };
  };

  const handleBreakdownClick = (params: any) => {
    const index = params.dataIndex as number;
    const item = breakdownItems[index];
    if (!item?.assetName) return;
    const fingerprint = getAssetFingerprint(item.assetName);
    if (fingerprint) {
      navigate({ to: "/asset/$fingerprint", params: { fingerprint } });
    }
  };

  const delegationData = selectedWalletData ?? (walletDataList.length === 1 ? walletDataList[0] : null);

  if (isLoading) {
    return (
      <div className='rounded-l border border-border bg-cardBg p-4'>
        <LoadingSkeleton height='400px' />
      </div>
    );
  }

  return (
    <div className='rounded-l border border-border bg-cardBg p-4'>
      {/* Header */}
      <div className='mb-3 flex items-start justify-between'>
        <div>
          <h2 className='text-text-lg font-semibold'>
            {t("portfolio.composition.title")}
          </h2>
          <p className='text-text-sm text-grayTextPrimary'>{subtitle}</p>
        </div>
        <div className='flex rounded-m border border-border'>
          <button
            className={`px-3 py-1.5 text-text-sm font-medium ${
              activeTab === "category"
                ? "bg-cardBg text-foreground"
                : "text-grayTextPrimary"
            } rounded-l-m`}
            onClick={() => setActiveTab("category")}
          >
            {t("portfolio.composition.category")}
          </button>
          <button
            className={`px-3 py-1.5 text-text-sm font-medium ${
              activeTab === "breakdown"
                ? "bg-cardBg text-foreground"
                : "text-grayTextPrimary"
            } rounded-r-m`}
            onClick={() => setActiveTab("breakdown")}
          >
            {t("portfolio.composition.breakdown")}
          </button>
        </div>
      </div>

      {/* Main content: stat boxes left, donut right */}
      {activeTab === "category" ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Left: stat boxes */}
          <div className='flex flex-col gap-2'>
            {/* Total */}
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.total")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  ₳{formatNumberWithSuffix(displayTotals.totalValueAda)}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.totalValueAda)}
              </p>
            </div>
            {/* ADA */}
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>ADA</p>
                <p className='text-text-xs text-grayTextPrimary'>
                  ₳{formatNumberWithSuffix(adaInAda)}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(adaInAda)}
              </p>
            </div>
            {/* Tokens */}
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.tokens")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  {displayTotals.tokenCount}{" "}
                  {t("portfolio.composition.tokensLabel")}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.tokenValueAda)}
              </p>
            </div>
            {/* NFTs */}
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.nfts")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  {displayTotals.nftCount}{" "}
                  {t("portfolio.composition.nftsLabel")}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.nftValueAda)}
              </p>
            </div>
          </div>

          {/* Right: donut chart */}
          <div className='flex items-center justify-center'>
            <div className='h-[280px] w-full'>
              <ReactECharts
                option={getCategoryOption()}
                notMerge
                lazyUpdate
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Left: same stat boxes */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.total")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  ₳{formatNumberWithSuffix(displayTotals.totalValueAda)}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.totalValueAda)}
              </p>
            </div>
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>ADA</p>
                <p className='text-text-xs text-grayTextPrimary'>
                  ₳{formatNumberWithSuffix(adaInAda)}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(adaInAda)}
              </p>
            </div>
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.tokens")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  {displayTotals.tokenCount}{" "}
                  {t("portfolio.composition.tokensLabel")}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.tokenValueAda)}
              </p>
            </div>
            <div className='flex items-center justify-between rounded-m border border-border p-3'>
              <div>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.nfts")}
                </p>
                <p className='text-text-xs text-grayTextPrimary'>
                  {displayTotals.nftCount}{" "}
                  {t("portfolio.composition.nftsLabel")}
                </p>
              </div>
              <p className='text-text-lg font-bold'>
                ₳{formatNumberWithSuffix(displayTotals.nftValueAda)}
              </p>
            </div>
          </div>

          {/* Right: breakdown donut chart */}
          <div className='flex items-center justify-center'>
            <div className='h-[280px] w-full'>
              <ReactECharts
                option={getBreakdownOption()}
                notMerge
                lazyUpdate
                style={{ height: "100%", width: "100%", cursor: "pointer" }}
                onEvents={{ click: handleBreakdownClick }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delegation cards */}
      {delegationData && (
        <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
          <div className='flex items-center justify-between rounded-m border border-border p-3'>
            <div>
              <p className='text-text-sm font-semibold'>
                {t("portfolio.composition.poolDelegation")}
              </p>
              <p
                className={`truncate text-text-xs ${
                  delegationData.poolDelegation
                    ? "text-grayTextPrimary"
                    : "text-redText"
                }`}
              >
                {delegationData.poolDelegation
                  ? formatString(delegationData.poolDelegation, "long")
                  : t("portfolio.composition.notDelegated")}
              </p>
            </div>
            <span className='flex items-center gap-0.5 text-text-sm text-primary'>
              {t("portfolio.composition.delegate")}
              <ArrowRight size={14} />
            </span>
          </div>
          <div className='flex items-center justify-between rounded-m border border-border p-3'>
            <div>
              <p className='text-text-sm font-semibold'>
                {t("portfolio.composition.drepDelegation")}
              </p>
              <p
                className={`truncate text-text-xs ${
                  delegationData.drepDelegation
                    ? "text-grayTextPrimary"
                    : "text-redText"
                }`}
              >
                {delegationData.drepDelegation
                  ? formatString(delegationData.drepDelegation, "long")
                  : t("portfolio.composition.notDelegated")}
              </p>
            </div>
            <span className='flex items-center gap-0.5 text-text-sm text-primary'>
              {t("portfolio.composition.delegate")}
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
