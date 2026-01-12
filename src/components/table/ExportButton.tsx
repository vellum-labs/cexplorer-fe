import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";
import type { WalletApi } from "@/types/walletTypes";

import { colors } from "@/constants/colors";
import { Download } from "lucide-react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

import { FeatureModal } from "@vellumlabs/cexplorer-sdk";
import { ExportTableModal } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "../wallet/ConnectWalletModal";

import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { useState } from "react";

interface ExportButtonProps {
  columns?: TableColumns<any>;
  items?: any[];
  currentPage?: number;
}

const ExportButton: FC<ExportButtonProps> = ({
  columns,
  items,
  currentPage,
}) => {
  const { t } = useAppTranslation("common");
  const { address, wallet } = useWalletStore();
  const userQuery = useFetchUserInfo();
  const nftCount = userQuery.data?.data?.membership.nfts;

  const [showFeatureModal, setShowFeatureModal] = useState<boolean>(false);
  const [showConnectWallet, setShowConnectWallet] = useState<boolean>(false);
  const [showExportTable, setShowExportTable] = useState<boolean>(false);

  const showModals = () => {
    if (
      !address ||
      !wallet ||
      typeof nftCount === "undefined" ||
      nftCount < 1
    ) {
      setShowFeatureModal(true);
      return;
    }

    setShowExportTable(true);
  };

  return (
    <>
      {showFeatureModal && (
        <FeatureModal
          onClose={() => setShowFeatureModal(false)}
          setShowConnectWallet={setShowConnectWallet}
          address={address}
          walletApi={wallet as unknown as WalletApi}
          title={t("sdk.featureModal.title")}
          subTitle={t("sdk.featureModal.subTitle")}
          cancelLabel={t("sdk.featureModal.cancelLabel")}
          connectWalletLabel={t("sdk.featureModal.connectWalletLabel")}
          getProLabel={t("sdk.featureModal.getProLabel")}
        />
      )}
      {showConnectWallet && (
        <ConnectWalletModal onClose={() => setShowConnectWallet(false)} />
      )}
      {showExportTable && (
        <ExportTableModal
          onClose={() => setShowExportTable(false)}
          columns={columns}
          items={items}
          currentPage={currentPage}
          title={t("sdk.exportTable.title")}
          csvLabel={t("sdk.exportTable.csvLabel")}
          csvDescription={t("sdk.exportTable.csvDescription")}
          jsonLabel={t("sdk.exportTable.jsonLabel")}
          jsonDescription={t("sdk.exportTable.jsonDescription")}
          cancelLabel={t("sdk.exportTable.cancelLabel")}
          exportLabel={t("sdk.exportTable.exportLabel")}
        />
      )}
      <div
        className='flex h-[40px] w-fit shrink-0 cursor-pointer items-center justify-center gap-1/2 rounded-s border border-border bg-cardBg px-1.5'
        onClick={showModals}
      >
        <Download size={20} color={colors.text} />
        <span className='text-text-sm font-medium'>{t("actions.export")}</span>
      </div>
    </>
  );
};

export default ExportButton;
