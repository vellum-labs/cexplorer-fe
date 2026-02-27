import { useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { PortfolioComposition } from "@/components/portfolio/PortfolioComposition";
import { PortfolioWalletList } from "@/components/portfolio/PortfolioWalletList";
import { PortfolioHoldingsTab } from "@/components/portfolio/PortfolioHoldingsTab";
import { PortfolioTradesTab } from "@/components/portfolio/PortfolioTradesTab";
import { AddWalletModal } from "@/components/portfolio/AddWalletModal";
import { Button, Tabs } from "@vellumlabs/cexplorer-sdk";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const PortfolioPage = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { wallets } = usePortfolioStore();
  const { isLoading } = usePortfolioData();
  const [showAddModal, setShowAddModal] = useState(false);

  const hasWallets = wallets.length > 0;

  const tabs = [
    {
      key: "holdings",
      label: t("portfolio.tabs.holdings"),
      content: <PortfolioHoldingsTab />,
      visible: true,
    },
    {
      key: "trades",
      label: t("portfolio.tabs.trades"),
      content: <PortfolioTradesTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataOverride={{
        title: t("portfolio.title", "Portfolio Tracker"),
      }}
      title={t("portfolio.title", "Portfolio Tracker")}
      breadcrumbItems={[
        { label: t("portfolio.breadcrumb", "Portfolio") },
      ]}
      adsCarousel={false}
    >
      <section className='flex w-full min-w-0 max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {hasWallets ? (
          <>
            <div className='grid grid-cols-1 gap-3 lg:grid-cols-5'>
              <div className='lg:col-span-3'>
                <PortfolioComposition />
              </div>
              <div className='lg:col-span-2'>
                <PortfolioWalletList
                  onAddWallet={() => setShowAddModal(true)}
                />
              </div>
            </div>
            <div className='mt-3'>
              <Tabs items={tabs} apiLoading={isLoading} />
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-l border border-border bg-cardBg p-8'>
            <p className='mb-1 text-text-xl font-semibold'>
              {t("portfolio.empty.title")}
            </p>
            <p className='mb-3 text-text-sm text-grayTextPrimary'>
              {t("portfolio.empty.subtitle")}
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant='primary'
              size='md'
              label={t("portfolio.wallets.addWallet")}
            />
          </div>
        )}
      </section>

      {showAddModal && (
        <AddWalletModal onClose={() => setShowAddModal(false)} />
      )}
    </PageBase>
  );
};
