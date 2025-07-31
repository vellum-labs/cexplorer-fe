import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { colors } from "@/constants/colors";
import { Download } from "lucide-react";

import { ExportTableModal } from "../global/modals/ExportTableModal";
import { FeatureModal } from "../global/modals/FeatureModal";
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
  const { address, walletApi } = useWalletStore();
  const userQuery = useFetchUserInfo();
  const nftCount = userQuery.data?.data?.membership.nfts;

  const [showFeatureModal, setShowFeatureModal] = useState<boolean>(false);
  const [showConnectWallet, setShowConnectWallet] = useState<boolean>(false);
  const [showExportTable, setShowExportTable] = useState<boolean>(false);

  const showModals = () => {
    if (
      !address ||
      !walletApi ||
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
        />
      )}
      <div
        className='flex h-[40px] w-fit shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-border bg-cardBg px-3'
        onClick={showModals}
      >
        <Download size={20} color={colors.text} />
        <span className='text-sm font-medium'>Export</span>
      </div>
    </>
  );
};

export default ExportButton;
