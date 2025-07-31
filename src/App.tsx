import { initNufiDappCardanoSdk } from "@nufi/dapp-client-cardano";
import {
  default as nufiCoreSdk,
  default as publicNufiCoreSdk,
} from "@nufi/dapp-client-core";
import { useEffect } from "react";
import { CustomLabelModal } from "./components/global/modals/CustomLabelModal";
import WalletConfigModal from "./components/wallet/WalletConfigModal";
import { enabledWalletConnector, network } from "./constants/confVariables";
import { useConnectWallet } from "./hooks/useConnectWallet";
import { useFetchUserInfo } from "./services/user";
import { useCustomLabelModalState } from "./stores/states/customLabelModalState";
import { useWalletConfigModalState } from "./stores/states/walletConfigModalState";
import { useThemeStore } from "./stores/themeStore";
import { useUqStore } from "./stores/uqStore";
import { useWalletStore } from "./stores/walletStore";
import { generateUniqueId } from "./utils/generateUniqueId";
import { GoogleAnalytics } from "./components/global/GoogleAnalytics";

function App() {
  const { theme } = useThemeStore();
  const { walletType } = useWalletStore();
  const { connect, disconnect } = useConnectWallet();
  const { setUq, uq } = useUqStore();
  const { isOpen } = useCustomLabelModalState();
  const { isOpen: isConfigOpen } = useWalletConfigModalState();
  const userQuery = useFetchUserInfo();

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

  return (
    <>
      {isConfigOpen && <WalletConfigModal />}
      {isOpen && <CustomLabelModal />}
      <GoogleAnalytics />
    </>
  );
}

export default App;
