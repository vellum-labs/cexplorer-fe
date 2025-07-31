import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useWalletStore } from "@/stores/walletStore";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
  const { address } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  const [token, setToken] = useState(tokens[address || ""]?.token);

  useEffect(() => {
    setToken(tokens[address || ""]?.token);
  }, [tokens, address]);

  return token;
};
