import { useState, useCallback } from "react";

interface UseFetchUrlContentReturn {
  content: string;
  isLoading: boolean;
  isOpen: boolean;
  fetchContent: (url: string) => Promise<void>;
  close: () => void;
}

const convertIpfsUrl = (url: string): string => {
  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${hash}`;
  }
  return url;
};

export const useFetchUrlContent = (): UseFetchUrlContentReturn => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchContent = useCallback(async (url: string) => {
    setIsLoading(true);
    setIsOpen(true);

    try {
      const fetchUrl = convertIpfsUrl(url);
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.text();

      try {
        const jsonData = JSON.parse(data);
        setContent(JSON.stringify(jsonData, null, 2));
      } catch {
        setContent(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setContent(
        `Failed to fetch content from URL:\n\n${url}\n\nError: ${errorMessage}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setContent("");
  }, []);

  return {
    content,
    isLoading,
    isOpen,
    fetchContent,
    close,
  };
};
