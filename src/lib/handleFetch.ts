import type { StringifiableRecord } from "query-string";

import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useNotFound } from "@/stores/useNotFound";
import { useWalletStore } from "@/stores/walletStore";
import { callNetworkErrorToast } from "@/utils/error/callNetworkErrorToast";
import { getUrl } from "@/utils/getUrl";

interface FetchOptions extends RequestInit {
  params?: StringifiableRecord;
  timeout?: number;
  retryCount?: number;

  headers?: HeadersInit;
  body?: BodyInit;
}

let globalSignal: AbortSignal | undefined;

export const setGlobalAbortSignal = (signal: AbortSignal) => {
  globalSignal = signal;
};

const fetchWithTimeout = (
  url: string,
  timeout: number,
  options?: RequestInit,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Request timed out")),
      timeout,
    );
    fetch(url, { ...options })
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const handleInvalidToken = () => {
  const { address } = useWalletStore.getState();
  const { tokens, setTokens } = useAuthTokensStore.getState();

  if (address && tokens[address]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [address]: _removed, ...updatedTokens } = tokens;
    setTokens(updatedTokens);
  }
};

export const handleFetch = async <T>(
  url: string,
  prevOffset?: number,
  options?: FetchOptions,
  hideToast: boolean = false,
): Promise<T & { prevOffset: number | undefined }> => {
  const fullUrl = getUrl(url, options?.params);
  const timeout = options?.timeout ?? 20000;
  const retryCount = options?.retryCount ?? 2;
  const headers = options?.headers;
  const body = options?.body;
  const method = options?.method ?? "GET";

  const signal = options?.signal ?? globalSignal;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const response = await fetchWithTimeout(fullUrl, timeout, {
        method,
        headers,
        body,
        signal,
      });

      if (response.status === 404) {
        useNotFound.getState().setNotFound(true);
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const data: T & { code?: string; msg?: string } = await response.json();

      const isInvalidToken =
        (data.code === "403" && data.msg === "Invalid user-token") ||
        (response.status === 403 && data.msg === "Invalid user-token");

      if (isInvalidToken) {
        handleInvalidToken();
      }

      if (response.status !== 200 && !hideToast && !isInvalidToken) {
        callNetworkErrorToast({
          status: response.status,
          apiUrl: response.url,
          body: response.body,
        });
        throw new Error("The network response failed.");
      }

      return { ...data, prevOffset: prevOffset, responseHeaders };
    } catch (error) {
      if (attempt !== retryCount) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying...`);

        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      if (!(error instanceof Error)) {
        throw new Error("An unknown error occurred during fetch");
      }

      console.error("Fetch error:", error.message);
      throw error;
    }
  }

  throw new Error("Failed to fetch after retries");
};
