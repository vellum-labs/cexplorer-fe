import type { FC } from "react";
import { useState, useEffect } from "react";
import { ArrowRight, Copy, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useWalletStore } from "@/stores/walletStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useNavigate } from "@tanstack/react-router";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import {
  DelegationConfirmModal,
  type DelegationInfo,
} from "@/components/wallet/DelegationConfirmModal";
import { generateImageUrl } from "@/utils/generateImageUrl";
import {
  Image,
  LoadingSkeleton,
  Tabs,
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
  const { wallet, address, walletType } = useWalletStore();
  const { walletDataList, selectedWalletData, totals, breakdownItems, isLoading } =
    usePortfolioData();
  const [activeTab, setActiveTab] = useState<TabType>("category");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [copiedDeleg, setCopiedDeleg] = useState<string | null>(null);
  const [delegationInfo, setDelegationInfo] = useState<DelegationInfo | null>(null);
  const [delegationLoading, setDelegationLoading] = useState(false);

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
      legend: {
        orient: "vertical" as const,
        left: 0,
        top: "center",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        textStyle: { color: textColor, fontSize: 13 },
        data: breakdownItems.slice(0, 5).map(item => item.name),
        formatter: (name: string) => name.length > 12 ? name.slice(0, 12) + "…" : name,
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

  const handleBreakdownClick = (params: any) => {
    const index = params.dataIndex as number;
    const item = breakdownItems[index];
    if (!item?.assetName) return;
    const fingerprint = getAssetFingerprint(item.assetName);
    if (fingerprint) {
      navigate({ to: "/asset/$fingerprint", params: { fingerprint } });
    }
  };

  const { connect } = useConnectWallet();

  useEffect(() => {
    if (wallet && address && walletType && delegationInfo && !showDelegationModal) {
      setShowWalletModal(false);
      setShowDelegationModal(true);
    }
  }, [wallet, address, walletType]);

  const handleDelegateClick = async (type: "pool" | "drep", ident: string) => {
    setDelegationInfo({ type, ident });

    if (!walletType) {
      setShowWalletModal(true);
      return;
    }

    if (!wallet) {
      try {
        await connect(walletType);
      } catch {
        setShowWalletModal(true);
        return;
      }
      return;
    }

    setShowDelegationModal(true);
  };

  const handleDelegationConfirm = async (donationAmount: number) => {
    if (!delegationInfo) return;
    setDelegationLoading(true);
    try {
      await handleDelegation(
        {
          type: delegationInfo.type,
          ident: delegationInfo.ident,
          donationAmount,
        },
        wallet,
      );
    } finally {
      setDelegationLoading(false);
      setShowDelegationModal(false);
      setDelegationInfo(null);
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
      <div className='mb-3 flex items-start justify-between gap-2'>
        <div className='min-w-0 shrink'>
          <h2 className='truncate text-text-lg font-semibold'>
            {t("portfolio.composition.title")}
          </h2>
          <p className='truncate text-text-sm text-grayTextPrimary'>
            {formatString(subtitle, "long")}
          </p>
        </div>
        <div className='shrink-0'>
        <Tabs
          withPadding={false}
          withMargin={false}
          tabParam='composition'
          items={[
            { key: "category", label: t("portfolio.composition.category"), visible: true },
            { key: "breakdown", label: t("portfolio.composition.breakdown"), visible: true },
          ]}
          activeTabValue={activeTab}
          onClick={(key: string) => setActiveTab(key as TabType)}
          toRight
        />
        </div>
      </div>

      {activeTab === "category" ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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

          <div className='flex items-center justify-center'>
            <div className='h-[200px] w-full md:h-[280px]'>
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

          <div className='flex items-center justify-center'>
            <div className='h-[200px] w-full md:h-[280px]'>
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

      {delegationData && (
        <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
          <div className='flex items-center justify-between rounded-m border border-border p-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
              {delegationData.poolDelegation && (
                <Image
                  src={generateImageUrl(delegationData.poolDelegation, "ico", "pool")}
                  type='pool'
                  height={32}
                  width={32}
                  className='shrink-0 rounded-max'
                />
              )}
              <div className='min-w-0'>
                <p className='text-text-sm font-semibold'>
                  {t("portfolio.composition.poolDelegation")}
                </p>
                {delegationData.poolDelegation ? (
                  <p className='flex items-center gap-1 text-text-xs'>
                    <Link
                      to='/pool/$id'
                      params={{ id: delegationData.poolDelegation }}
                      className='truncate text-primary'
                    >
                      {formatString(delegationData.poolDelegation, "long")}
                    </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(delegationData.poolDelegation!);
                      setCopiedDeleg("pool");
                      setTimeout(() => setCopiedDeleg(null), 1500);
                    }}
                    className='shrink-0 text-grayTextPrimary hover:text-primary'
                  >
                    {copiedDeleg === "pool" ? (
                      <Check size={12} className='text-green-500' />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </p>
              ) : (
                <p className='text-text-xs text-redText'>
                  {t("portfolio.composition.notDelegated")}
                </p>
              )}
              </div>
            </div>
            <button
              onClick={() =>
                handleDelegateClick("pool", delegationData.poolDelegation ?? "")
              }
              className='flex shrink-0 items-center gap-0.5 text-text-sm text-primary'
            >
              {delegationData.poolDelegation
                ? t("portfolio.composition.redelegate")
                : t("portfolio.composition.delegate")}
              <ArrowRight size={14} />
            </button>
          </div>
          <div className='flex items-center justify-between rounded-m border border-border p-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
              {delegationData.drepDelegation && (
                <Image
                  src={generateImageUrl(delegationData.drepDelegation, "ico", "drep")}
                  type='user'
                  height={32}
                  width={32}
                  className='shrink-0 rounded-max'
                />
              )}
              <div className='min-w-0'>
              <p className='text-text-sm font-semibold'>
                {t("portfolio.composition.drepDelegation")}
              </p>
              {delegationData.drepDelegation ? (
                <p className='flex items-center gap-1 text-text-xs'>
                  <Link
                    to='/drep/$hash'
                    params={{ hash: delegationData.drepDelegation }}
                    className='truncate text-primary'
                  >
                    {formatString(delegationData.drepDelegation, "long")}
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(delegationData.drepDelegation!);
                      setCopiedDeleg("drep");
                      setTimeout(() => setCopiedDeleg(null), 1500);
                    }}
                    className='shrink-0 text-grayTextPrimary hover:text-primary'
                  >
                    {copiedDeleg === "drep" ? (
                      <Check size={12} className='text-green-500' />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </p>
              ) : (
                <p className='text-text-xs text-redText'>
                  {t("portfolio.composition.notDelegated")}
                </p>
              )}
              </div>
            </div>
            <button
              onClick={() =>
                handleDelegateClick("drep", delegationData.drepDelegation ?? "")
              }
              className='flex shrink-0 items-center gap-0.5 text-text-sm text-primary'
            >
              {delegationData.drepDelegation
                ? t("portfolio.composition.redelegate")
                : t("portfolio.composition.delegate")}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {showDelegationModal && delegationInfo && (
        <DelegationConfirmModal
          info={delegationInfo}
          onConfirm={handleDelegationConfirm}
          onCancel={() => {
            setShowDelegationModal(false);
            setDelegationInfo(null);
          }}
          isLoading={delegationLoading}
        />
      )}
    </div>
  );
};
