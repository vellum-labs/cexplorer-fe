import { useState, useCallback } from "react";

interface UseFetchUrlContentReturn {
  content: string;
  isLoading: boolean;
  isOpen: boolean;
  isError: boolean;
  errorUrl: string | null;
  fetchContent: (url: string) => Promise<void>;
  close: () => void;
}

const IPFS_GATEWAYS = [
  "https://ipfs.blockfrost.dev/ipfs/",
  "https://ipfs.io/ipfs/",
];

const convertIpfsUrl = (url: string, gatewayIndex = 0): string => {
  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
  }
  return url;
};

const isIpfsUrl = (url: string): boolean => url.startsWith("ipfs://");

export const useFetchUrlContent = (): UseFetchUrlContentReturn => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorUrl, setErrorUrl] = useState<string | null>(null);

  const fetchContent = useCallback(async (url: string) => {
    setIsLoading(true);
    setIsOpen(true);
    setIsError(false);
    setErrorUrl(null);

    const tryFetch = async (fetchUrl: string): Promise<string> => {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.text();
    };

    try {
      let data: string;

      if (isIpfsUrl(url)) {
        let lastError: Error | null = null;
        for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
          try {
            const fetchUrl = convertIpfsUrl(url, i);
            data = await tryFetch(fetchUrl);
            break;
          } catch (error) {
            lastError =
              error instanceof Error ? error : new Error("Unknown error");
            if (i === IPFS_GATEWAYS.length - 1) {
              throw lastError;
            }
          }
        }
        data = data!;
      } else {
        data = await tryFetch(url);
      }

      try {
        const jsonData = JSON.parse(data);
        setContent(JSON.stringify(jsonData, null, 2));
      } catch {
        setContent(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const displayUrl = isIpfsUrl(url) ? convertIpfsUrl(url, 0) : url;
      setContent(
        `Failed to fetch content from URL:\n\n${displayUrl}\n\nError: ${errorMessage}`,
      );
      setIsError(true);
      setErrorUrl(displayUrl);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setContent("");
    setIsError(false);
    setErrorUrl(null);
  }, []);

  return {
    content,
    isLoading,
    isOpen,
    isError,
    errorUrl,
    fetchContent,
    close,
  };
};
