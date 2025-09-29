import { network } from "@/constants/confVariables";
import { useFetchWatchlist } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletConfigModalState } from "@/stores/states/walletConfigModalState";
import { useWalletStore } from "@/stores/walletStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import type { WalletState, WalletType } from "@/types/walletTypes";
import type { WalletApi } from "@lucid-evolution/lucid";
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthToken } from "./useAuthToken";

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  walletApi: undefined,
  disabledExt: false,
  lucid: null,
};

export const useConnectWallet = () => {
  const { setWalletState } = useWalletStore();
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

  const _connect = async (walletType: WalletType) => {
    const wallet =
      typeof window !== "undefined"
        ? window?.cardano && window.cardano?.[walletType]
        : undefined;
    const walletApi = await wallet?.enable();

    const config = (() => {
      const configRaw = import.meta.env.VITE_APP_CONFIG ?? "preprod-stage";

      switch (configRaw) {
        case "preprod-stage":
        case "preprod":
          return "Preprod";
        case "preview-stage":
        case "preview":
          return "Preview";
        case "mainnet-stage":
        case "mainnet":
          return "Mainnet";
        default:
          return "Preprod";
      }
    })();

    const blockfrostEndpoint = (() => {
      switch (config) {
        case "Mainnet":
          return "https://cardano-mainnet.blockfrost.io/api/v0";
        case "Preview":
          return "https://cardano-preview.blockfrost.io/api/v0";
        case "Preprod":
        default:
          return "https://cardano-preprod.blockfrost.io/api/v0";
      }
    })();

    const apiKey = import.meta.env.VITE_APP_BLOCKFROST_KEY;

    const lucid = await Lucid(
      new Blockfrost(blockfrostEndpoint, apiKey),
      config,
    );
    lucid.selectWallet.fromAPI(walletApi as WalletApi);

    const address = await lucid.wallet().address();
    const rewardAddress = await lucid.wallet().rewardAddress();
    const stakeKey = rewardAddress ? rewardAddress.slice(-56) : "";

    if (address.startsWith("addr_test1") && network !== "preprod") {
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
      lucid,
      walletApi,
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
  };

  return { connect, disconnect };
};
