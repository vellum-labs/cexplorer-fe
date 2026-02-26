import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/services/misc", () => ({
  fetchMiscAnchor: vi.fn(),
}));

vi.mock("@/constants/conf", () => ({
  configJSON: {
    ipfs: "https://ipfs.blockfrost.dev/ipfs",
  },
}));

import { useFetchUrlContent } from "@/hooks/useFetchUrlContent";
import { fetchMiscAnchor } from "@/services/misc";

const mockFetchMiscAnchor = fetchMiscAnchor as ReturnType<typeof vi.fn>;

const makeAnchorResponse = (data: string | false) => ({
  code: 0,
  data,
  tokens: 0,
  ex: 0,
  debug: false,
});

describe("useFetchUrlContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  
  it("has correct initial state", () => {
    const { result } = renderHook(() => useFetchUrlContent());

    expect(result.current.content).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.errorUrl).toBeNull();
  });

  
  it("calls fetchMiscAnchor with the dataHash, not global fetch", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse("some content"));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmTest", "abc123hash");
    });

    expect(mockFetchMiscAnchor).toHaveBeenCalledWith("abc123hash");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sets content when proxy returns a plain string", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse("Hello, world!"));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmTest", "abc123hash");
    });

    expect(result.current.content).toBe("Hello, world!");
    expect(result.current.isError).toBe(false);
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("pretty-prints JSON string returned by proxy", async () => {
    const jsonData = { body: { comment: "test rationale" } };
    mockFetchMiscAnchor.mockResolvedValue(
      makeAnchorResponse(JSON.stringify(jsonData)),
    );

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("https://example.com/meta.json", "hashxyz");
    });

    expect(result.current.content).toBe(JSON.stringify(jsonData, null, 2));
    expect(result.current.isError).toBe(false);
  });

  
  it("sets isError=true when proxy returns data: false", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFailHash", "deadbeef");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("sets errorUrl to fallback IPFS gateway URL when proxy returns data: false", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFailHash", "deadbeef");
    });

    expect(result.current.errorUrl).toContain("QmFailHash");
    expect(result.current.errorUrl).toContain("https://ipfs.blockfrost.dev");
  });

  it("sets content to failure message containing the fallback URL when proxy returns data: false", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFailHash", "deadbeef");
    });

    expect(result.current.content).toContain("Failed to fetch content");
    expect(result.current.content).toContain("QmFailHash");
    expect(result.current.content).toContain("https://ipfs.blockfrost.dev");
  });

  it("does NOT fall back to direct fetch when proxy returns data: false (no CORS regression)", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFailHash", "deadbeef");
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sets errorUrl to original https URL when proxy returns false and URL is not ipfs://", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("https://example.com/meta.json", "hashxyz");
    });

    expect(result.current.errorUrl).toBe("https://example.com/meta.json");
    expect(result.current.isError).toBe(true);
  });

  
  it("does not call fetchMiscAnchor when no dataHash is provided", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("ipfs content"),
    });

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmSomeHash");
    });

    expect(mockFetchMiscAnchor).not.toHaveBeenCalled();
  });

  it("fetches from blockfrost IPFS gateway first when URL is ipfs://", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("ipfs content"),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmSomeHash");
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("QmSomeHash"),
    );
    expect(mockFetch.mock.calls[0][0]).toContain("ipfs.blockfrost.dev");
    expect(result.current.content).toBe("ipfs content");
    expect(result.current.isError).toBe(false);
  });

  it("falls back to second IPFS gateway when first fails", async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new Error("CORS error"))
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("content from gateway 2"),
      });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFallback");
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.current.content).toBe("content from gateway 2");
    expect(result.current.isError).toBe(false);
  });

  it("sets isError when all IPFS gateways fail", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("CORS error"),
    );

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFail");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.content).toContain("Failed to fetch content");
    expect(result.current.isLoading).toBe(false);
  });

 
  it("fetches plain https URL directly", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("plain content"),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("https://example.com/meta.json");
    });

    expect(mockFetch).toHaveBeenCalledWith("https://example.com/meta.json");
    expect(result.current.content).toBe("plain content");
    expect(result.current.isError).toBe(false);
  });

  it("sets isError when plain URL fetch returns non-ok response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("https://example.com/missing.json");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.content).toContain("Failed to fetch content");
  });

 
  it("sets isOpen=true immediately when fetchContent is called", async () => {
    let resolveAnchor: (v: any) => void;
    mockFetchMiscAnchor.mockReturnValue(
      new Promise((resolve) => {
        resolveAnchor = resolve;
      }),
    );

    const { result } = renderHook(() => useFetchUrlContent());

    act(() => {
      result.current.fetchContent("ipfs://QmTest", "hash1");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveAnchor!(makeAnchorResponse("data"));
    });
  });

  
  it("close() resets isOpen, content, isError, and errorUrl", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse("data"));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("https://example.com", "hash1");
    });

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.content).toBe("");
    expect(result.current.isError).toBe(false);
    expect(result.current.errorUrl).toBeNull();
  });

  it("close() after error clears error state", async () => {
    mockFetchMiscAnchor.mockResolvedValue(makeAnchorResponse(false));

    const { result } = renderHook(() => useFetchUrlContent());

    await act(async () => {
      await result.current.fetchContent("ipfs://QmFail", "badhash");
    });

    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.errorUrl).toBeNull();
  });
});
