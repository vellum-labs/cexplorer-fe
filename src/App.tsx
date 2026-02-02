import { initNufiDappCardanoSdk } from "@nufi/dapp-client-cardano";
import {
  default as nufiCoreSdk,
  default as publicNufiCoreSdk,
} from "@nufi/dapp-client-core";
import { useEffect } from "react";
import { CustomLabelModal } from "./components/global/modals/CustomLabelModal";
import { GeekConfigModal } from "./components/global/modals/GeekConfigModal";
import WalletConfigModal from "./components/wallet/WalletConfigModal";
import { enabledWalletConnector, network } from "./constants/confVariables";
import { useConnectWallet } from "./hooks/useConnectWallet";
import { useAuthToken } from "./hooks/useAuthToken";
import { useFetchUserInfo, useUserLabels } from "./services/user";
import { useAddressLabelStore } from "./stores/addressLabelStore";
import { useCustomLabelModalState } from "./stores/states/customLabelModalState";
import { useWalletConfigModalState } from "./stores/states/walletConfigModalState";
import { useGeekConfigModalState } from "./stores/states/geekConfigModalState";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { useUqStore } from "./stores/uqStore";
import { useWalletStore } from "./stores/walletStore";
import { generateUniqueId } from "./utils/generateUniqueId";
import { GoogleAnalytics } from "./components/global/GoogleAnalytics";
import type { AddressLabel } from "./types/commonTypes";

function App() {
  const { theme } = useThemeStore();
  const { walletType } = useWalletStore();
  const { connect, disconnect } = useConnectWallet();
  const { setUq, uq } = useUqStore();
  const { isOpen } = useCustomLabelModalState();
  const { isOpen: isConfigOpen } = useWalletConfigModalState();
  const { isOpen: isGeekConfigOpen } = useGeekConfigModalState();
  const userQuery = useFetchUserInfo();
  const token = useAuthToken();
  const { data: apiLabelsData } = useUserLabels(token || "");
  const { mergeApiLabels } = useAddressLabelStore();
  const userAddress = userQuery?.data?.data?.address;

  useEffect(() => {
    if (userQuery.data?.code === "403") {
      disconnect();
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    (async () => {
      if (walletType && enabledWalletConnector && window?.cardano) {
        await connect(walletType);
      }
    })();
  }, [walletType]);

  useEffect(() => {
    if (walletType === "nufiSSO") {
      publicNufiCoreSdk.init(
        network === "mainnet"
          ? "https://wallet-staging.nu.fi"
          : "https://wallet-preview-staging.nu.fi",
        {
          zIndex: 100003,
        },
      );
      initNufiDappCardanoSdk(nufiCoreSdk, "sso");
    }

    if (walletType === "nufiSnap") {
      nufiCoreSdk.init(
        network === "mainnet"
          ? "https://wallet-staging.nu.fi"
          : "https://wallet-preview-staging.nu.fi",
        {
          zIndex: 100003,
        },
      );
      initNufiDappCardanoSdk(nufiCoreSdk, "snap");
    }
  }, [walletType]);

  useEffect(() => {
    if (!uq) {
      setUq(generateUniqueId());
    }
  }, [uq]);

  useEffect(() => {
    if (token && apiLabelsData?.data?.labels) {
      const apiLabels: AddressLabel[] = apiLabelsData.data.labels
        .map(l => ({
          ident: l.ident || l.address || "",
          label: l.label || "",
        }))
        .filter(l => l.ident && l.label);

      mergeApiLabels(apiLabels, userAddress || null);
    }
  }, [token, apiLabelsData, userAddress, mergeApiLabels]);

  return (
    <>
      {isConfigOpen && <WalletConfigModal />}
      {isOpen && <CustomLabelModal />}
      {isGeekConfigOpen && <GeekConfigModal />}
      <GoogleAnalytics />
    </>
  );
}

export default App;
