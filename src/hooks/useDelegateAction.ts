import { useState, useEffect } from "react";
import { BrowserWallet } from "@meshsdk/core";
import { useWalletStore } from "@/stores/walletStore";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";

interface UseDelegateActionProps {
  type: "pool" | "drep";
  ident: string;
}

export const useDelegateAction = ({ type, ident }: UseDelegateActionProps) => {
  const { address, walletType } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [pendingDelegation, setPendingDelegation] = useState(false);
  const hasAuthToken = address ? !!tokens[address]?.token : false;

  // Check URL on mount for delegation action
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlAction = urlParams.get("action");

      if (urlAction === "delegate") {
        const url = new URL(window.location.href);
        url.searchParams.delete("action");
        window.history.replaceState({}, "", url.toString());

        if (!address && !walletType) {
          setPendingDelegation(true);
          setShowWalletModal(true);
        } else {
          BrowserWallet.enable(walletType!)
            .then(freshWallet => {
              handleDelegation({ type, ident }, freshWallet);
            })
            .catch(err => {
              console.error("[Delegate Action] Error enabling wallet:", err);
            });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger delegation after wallet connects and auth token is obtained
  useEffect(() => {
    const triggerDelegation = async () => {
      if (pendingDelegation && walletType && address && hasAuthToken) {
        try {
          const freshWallet = await BrowserWallet.enable(walletType);
          await handleDelegation({ type, ident }, freshWallet);
        } catch (error) {
          console.error("[Delegate Action] Delegation error:", error);
        }
        setPendingDelegation(false);
      }
    };

    triggerDelegation();
  }, [pendingDelegation, walletType, address, ident, hasAuthToken, type]);

  return {
    showWalletModal,
    setShowWalletModal,
  };
};
