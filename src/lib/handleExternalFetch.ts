import type { StringifiableRecord } from "query-string";
import queryString from "query-string";

interface FetchOptions extends RequestInit {
  params?: StringifiableRecord;
  timeout?: number;
}

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

const getExternalUrl = (
  baseUrl: string,
  path: string,
  params?: StringifiableRecord,
) =>
  queryString.stringifyUrl({
    url: `${baseUrl}${path}`,
    query: params,
  });

export const handleExternalFetch = async <T>(
  baseUrl: string,
  path: string,
  options?: FetchOptions,
): Promise<T> => {
  const fullUrl = getExternalUrl(baseUrl, path, options?.params);
  const timeout = options?.timeout ?? 20000;

  try {
    const response = await fetchWithTimeout(fullUrl, timeout, {
      method: options?.method ?? "GET",
      headers: options?.headers,
      body: options?.body,
      signal: options?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("An unknown error occurred during fetch");
    }
    console.error("External fetch error:", error.message);
    throw error;
  }
};
