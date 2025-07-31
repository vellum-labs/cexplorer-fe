import { network } from "@/constants/confVariables";
import { useFetchWatchlist } from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletConfigModalState } from "@/stores/states/walletConfigModalState";
import { useWalletStore } from "@/stores/walletStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import type { WalletState, WalletType } from "@/types/walletTypes";
import { JamOnBreadProvider, JobCardano } from "@jamonbread/sdk";
import type { WalletApi } from "lucid-cardano";
import { Lucid } from "lucid-cardano";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthToken } from "./useAuthToken";

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  walletApi: undefined,
  disabledExt: false,
  job: null,
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
    const apiUrl = "https://api.jamonbread.io/api/".replace(/^\/+|\/+$/g, "");
    const wallet =
      typeof window !== "undefined"
        ? window?.cardano && window.cardano?.[walletType]
        : undefined;
    const walletApi = await wallet?.enable();
    const provider = new JamOnBreadProvider(
      `https://api.jamonbread.io/api/lucid`,
    );
    const lucid = await Lucid.new(provider, "Preprod");
    lucid.selectWallet(walletApi as WalletApi);
    const address = await lucid.wallet.address();
    const stakeKey = lucid.utils.stakeCredentialOf(address).hash;
    const job = new JobCardano(lucid, apiUrl);

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
      job,
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
