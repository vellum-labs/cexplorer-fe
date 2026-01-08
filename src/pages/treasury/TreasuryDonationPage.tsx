import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { TreasuryDonationEpochsTab } from "@/components/script/treasury/tabs/TreasuryDonationEpochsTab";
import { TreasuryDonationOverview } from "@/components/script/treasury/TreasuryDonationOverview";
import { useFetchTreasuryDonationStats } from "@/services/treasury";
import { TxListPage } from "../tx/TxListPage";
import { PageBase } from "@/components/global/pages/PageBase";
import { TreasuryDonationModal } from "@/components/script/treasury/TreasuryDonationModal";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useWalletStore } from "@/stores/walletStore";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Wallet, Info } from "lucide-react";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const TreasuryDonationPage = () => {
  const { t } = useAppTranslation("pages");
  const query = useFetchTreasuryDonationStats();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const { wallet } = useWalletStore();

  const handleDonateClick = () => {
    if (!wallet) {
      setShowWalletModal(true);
      return;
    }
    setShowDonationModal(true);
  };

  const handleSuccess = (hash: string) => {
    setTxHash(hash);
    setShowDonationModal(false);
    setShowSuccessModal(true);
  };

  const tabItems = [
    {
      key: "donations",
      label: t("treasuryDonations.tabs.recentDonations"),
      content: <TxListPage key='donation' isDonationPage />,
      visible: true,
    },
    {
      key: "stats",
      label: t("treasuryDonations.tabs.epochByEpoch"),
      content: <TreasuryDonationEpochsTab query={query} />,
      visible: true,
    },
  ];
  return (
    <PageBase
      metadataTitle='treasuryDonations'
      title={t("treasuryDonations.title")}
      breadcrumbItems={[
        {
          label: t("treasuryDonations.title"),
        },
      ]}
      adsCarousel={false}
    >
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {showDonationModal &&
        createPortal(
          <TreasuryDonationModal
            onClose={() => setShowDonationModal(false)}
            onSuccess={handleSuccess}
            wallet={wallet}
          />,
          document.body,
        )}
      {showSuccessModal && (
        <Modal
          minWidth='400px'
          maxWidth='95%'
          onClose={() => setShowSuccessModal(false)}
        >
          <div className='mt-2 flex h-full w-full flex-col items-center overflow-hidden p-1.5'>
            <h3>{t("treasuryDonations.success.title")} ❤️</h3>
            <div className='mt-4 flex w-full flex-col items-center gap-2'>
              <p className='text-text-sm'>{t("treasuryDonations.success.txHashLabel")}</p>
              <div className='flex items-center gap-1'>
                <Link
                  to='/tx/$hash'
                  params={{ hash: txHash }}
                  className='break-all text-primary'
                >
                  {txHash}
                </Link>
                <Copy copyText={txHash} />
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div className='w-full max-w-desktop p-mobile lg:p-desktop lg:pb-0'>
        <div className='mb-2 w-full rounded-l border border-border bg-cardBg p-2'>
          <div className='flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-start gap-2'>
              <Info size={20} className='mt-1/4 shrink-0 text-primary' />
              <div className='flex flex-col gap-1'>
                <h3 className='text-text-md font-semibold'>
                  {t("treasuryDonations.info.title")}
                </h3>
                <p className='text-text-sm text-grayTextPrimary'>
                  {t("treasuryDonations.info.description")}
                </p>
              </div>
            </div>
            <div className='h-fit shrink-0'>
              <Tooltip
                content={t("treasuryDonations.info.donateTooltip")}
                forceDirection='bottom'
              >
                <Button
                  size='lg'
                  label={t("treasuryDonations.info.donateButton")}
                  variant='primary'
                  leftIcon={<Wallet />}
                  onClick={handleDonateClick}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <TreasuryDonationOverview query={query} />
      <Tabs items={tabItems} />
    </PageBase>
  );
};
