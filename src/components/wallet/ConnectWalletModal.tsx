import { network } from "@/constants/confVariables";
import { filteredSupportedWallets, walletInfos } from "@/constants/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletStore } from "@/stores/walletStore";
import type { WalletType } from "@/types/walletTypes";
import { initNufiDappCardanoSdk } from "@nufi/dapp-client-cardano";
import type { SocialLoginInfo } from "@nufi/dapp-client-core";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { SsoButton } from "@nufi/sso-button-react";
import "@nufi/sso-button-react/dist/style.css";
import React, { useEffect, useState } from "react";
import { browserName, isMobile, isSafari, isTablet } from "react-device-detect";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import WalletOption from "./WalletOption";
import { useAppTranslation } from "@/hooks/useAppTranslation";

type Props = {
  onClose: () => void;
};

const ConnectWalletModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation("common");
  const { connect } = useConnectWallet();
  const { walletType } = useWalletStore();
  const [walletLoading, setWalletLoading] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [installedWallets, setInstalledWallets] = useState<WalletType[]>([]);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  const [ssoUserInfo, setSSOUserInfo] = useState<null | SocialLoginInfo>(null);
  const [unavailableWallets, setUnavailableWallets] = useState<WalletType[]>(
    [],
  );

  const handleConnectWallet = async (walletType: WalletType) => {
    setWalletLoading(true);
    try {
      if (walletType === "nufiSnap") {
        initNufiDappCardanoSdk(nufiCoreSdk, "snap");
        await window.cardano.nufiSnap.enable();
        await connect(walletType);
        return;
      }

      await connect(walletType);
      onClose();
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const installed = filteredSupportedWallets.filter(
        wallet =>
          wallet &&
          (!!window.cardano?.[wallet] ||
            (wallet === "nufiSnap" && isMetamaskInstalled)),
      );
      setInstalledWallets(installed);

      const available = filteredSupportedWallets.filter(
        wallet =>
          wallet &&
          ((!window.cardano?.[wallet] && wallet !== "nufiSnap") ||
            (wallet === "nufiSnap" && !isMetamaskInstalled)) &&
          (unsupportedBrowserCheck(wallet) || mobileAppSupport(wallet)),
      );
      setAvailableWallets(available);

      const unavailable = filteredSupportedWallets.filter(
        wallet =>
          wallet &&
          (!window.cardano?.[wallet] ||
            (wallet === "nufiSnap" && !isMetamaskInstalled)) &&
          !unsupportedBrowserCheck(wallet) &&
          !mobileAppSupport(wallet),
      );
      setUnavailableWallets(unavailable);
    }
  }, [isMetamaskInstalled]);

  const unsupportedBrowserCheck = (walletType: WalletType) => {
    return (
      !walletInfos[walletType]?.unsuportedBrowsers?.includes(
        browserName.toLowerCase(),
      ) &&
      !isMobile &&
      !isTablet
    );
  };

  const mobileAppSupport = (walletType: WalletType) => {
    return walletInfos[walletType].hasMobileApp && (isMobile || isTablet);
  };

  const handleInstallWallet = (walletType: WalletType) => {
    if (isMobile || isTablet) {
      if (!mobileAppSupport(walletType)) {
        return;
      } else {
        window.open(walletInfos[walletType].extensionUrl, "_blank");
      }
    }

    if (!unsupportedBrowserCheck(walletType)) {
      return;
    }

    window.open(walletInfos[walletType].extensionUrl, "_blank");
  };

  if (walletLoading) {
    return (
      <Modal
        hideClose
        minWidth='95%'
        maxWidth='500px'
        maxHeight='95%'
        onClose={onClose}
      >
        <div className='flex justify-center p-3 pt-4'>
          <SpinningLoader />
        </div>
      </Modal>
    );
  }

  return (
    <Modal minWidth='95%' maxWidth='500px' maxHeight='95%' onClose={onClose}>
      <div className='flex w-full flex-col flex-wrap items-center justify-center p-0 md:flex-row [&>div]:md:flex [&>div]:md:flex-1 [&>div]:md:flex-col [&>div]:md:self-center'>
        <div className='w-full'>
          <h2>{t("wallet.connectWallet")} </h2>
          <div className='mb-2 mt-2 flex h-full w-full flex-col items-center justify-around'>
            {isSafari && !isMobile && !isTablet && (
              <p className='font-regular text-red-500'>
                {t("wallet.noSupportedWalletsSafari")}
              </p>
            )}
            {installedWallets.length === 0 && (
              <p>
                {t("wallet.noWalletsInstalled")}
              </p>
            )}
          </div>
          {installedWallets.length > 0 &&
            installedWallets.map(wallet => (
              <WalletOption
                key={wallet}
                supported
                name={wallet}
                onConnect={() => {
                  handleConnectWallet(wallet);
                }}
                onInstall={() => handleInstallWallet(wallet)}
                isInstalled={
                  installedWallets.includes(wallet) ||
                  (wallet === "nufiSnap" && isMetamaskInstalled)
                }
              />
            ))}
          {availableWallets.length > 0 &&
            availableWallets.map(wallet => (
              <WalletOption
                supported
                key={wallet}
                name={wallet}
                onConnect={() => handleConnectWallet(wallet)}
                onInstall={() => handleInstallWallet(wallet)}
                isInstalled={
                  installedWallets.includes(wallet) ||
                  (wallet === "nufiSnap" && isMetamaskInstalled)
                }
              />
            ))}
          {unavailableWallets.length > 0 &&
            unavailableWallets.map(wallet => (
              <WalletOption
                key={wallet}
                name={wallet}
                onConnect={() => handleConnectWallet(wallet)}
                onInstall={() => handleInstallWallet(wallet)}
                isInstalled={
                  installedWallets.includes(wallet) ||
                  (wallet === "nufiSnap" && isMetamaskInstalled)
                }
              />
            ))}
          {walletType === "nufiSSO" ? (
            <SsoButton
              key='sso_logged'
              state='logged_in'
              label={ssoUserInfo?.email || t("wallet.connected")}
              userInfo={{
                provider: ssoUserInfo?.typeOfLogin,
              }}
              classes={{
                base: "sso-button",
                button: "sso-button",
              }}
            />
          ) : (
            <SsoButton
              key='sso'
              state='logged_out'
              label={t("wallet.login")}
              onLogin={async () => {
                nufiCoreSdk.init(
                  network === "mainnet"
                    ? "https://wallet-staging.nu.fi"
                    : "https://wallet-preview-staging.nu.fi",
                  {
                    zIndex: 100003,
                  },
                );

                await nufiCoreSdk
                  ?.getApi()
                  ?.isMetamaskInstalled()
                  .then(result => {
                    setIsMetamaskInstalled(result);
                  });

                const currentSSOInfo = nufiCoreSdk
                  .getApi()
                  .onSocialLoginInfoChanged(data => {
                    setSSOUserInfo(data);
                  });
                setSSOUserInfo(currentSSOInfo);
                initNufiDappCardanoSdk(nufiCoreSdk, "sso");
                handleConnectWallet("nufiSSO");
              }}
              classes={{
                base: "sso-button",
                button: "sso-button",
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
