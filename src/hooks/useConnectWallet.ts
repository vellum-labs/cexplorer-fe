import { network } from "@/constants/confVariables";
import { useFetchWatchlist } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletConfigModalState } from "@/stores/states/walletConfigModalState";
import { useWalletStore } from "@/stores/walletStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import type { WalletState, WalletType } from "@/types/walletTypes";
import { BrowserWallet } from "@meshsdk/core";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuthToken } from "./useAuthToken";

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  disabledExt: false,
  wallet: null,
};

export const useConnectWallet = () => {
  const { setWalletState, walletType, wallet } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  const { setIsOpen } = useWalletConfigModalState();
  const token = useAuthToken();
  const query = useFetchWatchlist(token);
  const watchlistData = query.data?.data?.data;
  const { watchlist, setWatchlist } = useWatchlistStore();

  useEffect(() => {
    if (watchlistData && watchlistData !== watchlist)
      setWatchlist(watchlistData);
  }, [watchlistData]);

  const isReconnecting = useRef(false);
  useEffect(() => {
    const reconnectWallet = async () => {
      if (walletType && !wallet && !isReconnecting.current) {
        isReconnecting.current = true;
        try {
          const reconnectedWallet = await BrowserWallet.enable(walletType);
          setWalletState({ wallet: reconnectedWallet });
        } catch (error) {
          console.error("Failed to reconnect wallet:", walletType, error);
          localStorage.removeItem("wallet-store");
          setWalletState(defaultState);
        } finally {
          isReconnecting.current = false;
        }
      }
    };
    reconnectWallet();
  }, [walletType, wallet, setWalletState]);

  const _connect = async (walletType: WalletType) => {
    const wallet = await BrowserWallet.enable(walletType);

    const usedAddresses = await wallet.getUsedAddresses();
    let address = usedAddresses[0];

    if (!address) {
      const unusedAddresses = await wallet.getUnusedAddresses();
      address = unusedAddresses[0];
    }

    if (!address) {
      toast.error(
        "No address found in wallet. Please ensure your wallet has an address.",
      );
      setWalletState(defaultState);
      return;
    }

    const rewardAddresses = await wallet.getRewardAddresses();
    const rewardAddress = rewardAddresses?.[0];
    const stakeKey = rewardAddress ? rewardAddress.slice(-56) : "";

    if (address.startsWith("addr_test1") && network !== "preprod" && network !== "preview") {
      toast("Please use a mainnet wallet to connect to the mainnet Cexplorer", {
        id: "mainnet-wallet",
      });
      setWalletState(defaultState);
      return;
    }

    if (address.startsWith("addr1") && network !== "mainnet") {
      toast("Please use a testnet wallet to connect to the testnet Cexplorer", {
        id: "testnet-wallet",
      });
      setWalletState(defaultState);
      return;
    }

    if (localStorage.getItem("disabled")) {
      setWalletState(defaultState);
      throw new Error("Wallet is disabled");
    }

    setWalletState({
      walletType,
      address,
      stakeKey,
      disabledExt: false,
      wallet,
    });

    if (!tokens[address]) {
      setIsOpen(true);
    }
  };

  const connect = async (walletType: WalletType) => {
    await _connect(walletType);
  };

  const disconnect = () => {
    setWalletState(defaultState);
    localStorage.removeItem("wallet-store");
  };

  return { connect, disconnect };
};
