import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletStore } from "@/stores/walletStore";

export const useAuthToken = () => {
  const { address } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  return tokens[address || ""]?.token;
};
