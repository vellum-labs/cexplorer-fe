import { useState, useEffect } from "react";
import { useWalletStore } from "@/stores/walletStore";
import { useAuthTokensStore } from "@/stores/authTokensStore";

interface UseDelegateActionProps {
  type: "pool" | "drep";
  ident: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useDelegateAction = (_props: UseDelegateActionProps) => {
  const { address, walletType } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [pendingDelegation, setPendingDelegation] = useState(false);
  const hasAuthToken = address ? !!tokens[address]?.token : false;

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
          setShowDelegationModal(true);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pendingDelegation && walletType && address && hasAuthToken) {
      setShowDelegationModal(true);
      setPendingDelegation(false);
    }
  }, [pendingDelegation, walletType, address, hasAuthToken]);

  return {
    showWalletModal,
    setShowWalletModal,
    showDelegationModal,
    setShowDelegationModal,
  };
};
