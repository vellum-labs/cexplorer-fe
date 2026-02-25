import { vi } from "vitest";

vi.mock("@/lib/handleFetch", () => ({
  handleFetch: vi.fn(),
}));


vi.mock("@/stores/authTokensStore", () => ({
  useAuthTokensStore: { getState: vi.fn(() => ({ tokens: {} })) },
}));
vi.mock("@/stores/useNotFound", () => ({
  useNotFound: { getState: vi.fn(() => ({})) },
}));
vi.mock("@/stores/walletStore", () => ({
  useWalletStore: { getState: vi.fn(() => ({})) },
}));
vi.mock("@/utils/error/callNetworkErrorToast", () => ({
  callNetworkErrorToast: vi.fn(),
}));
vi.mock("@/utils/getUrl", () => ({
  getUrl: vi.fn((url: string) => url),
}));

import { fetchMiscAnchor } from "@/services/misc";
import { handleFetch } from "@/lib/handleFetch";

const mockHandleFetch = handleFetch as ReturnType<typeof vi.fn>;

const mockAnchorResponse = (data: string | false) => ({
  code: 0,
  data,
  tokens: 0,
  ex: 0,
  debug: false,
});

describe("fetchMiscAnchor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

 
  it("calls handleFetch with /misc/get_anchor endpoint", async () => {
    mockHandleFetch.mockResolvedValue(mockAnchorResponse("content"));

    await fetchMiscAnchor("abc123");

    expect(mockHandleFetch).toHaveBeenCalledWith(
      "/misc/get_anchor",
      undefined,
      { params: { data_hash: "abc123" } },
      true,
    );
  });

  it("passes the dataHash as data_hash query param", async () => {
    mockHandleFetch.mockResolvedValue(mockAnchorResponse("content"));

    const hash = "01da1d9bdc90f6e25c1115714c4e3398c667f9689cc5d3c032e60861438b8a30";
    await fetchMiscAnchor(hash);

    const callArgs = mockHandleFetch.mock.calls[0];
    expect(callArgs[2].params.data_hash).toBe(hash);
  });

  it("passes true as the 4th argument (auth flag)", async () => {
    mockHandleFetch.mockResolvedValue(mockAnchorResponse("content"));

    await fetchMiscAnchor("somehash");

    expect(mockHandleFetch.mock.calls[0][3]).toBe(true);
  });


  it("returns the response when data is a string", async () => {
    const response = mockAnchorResponse("{ body: { comment: 'test' } }");
    mockHandleFetch.mockResolvedValue(response);

    const result = await fetchMiscAnchor("hash1");

    expect(result).toEqual(response);
    expect(result.data).toBe("{ body: { comment: 'test' } }");
  });

  it("returns the response when data is false (proxy could not fetch)", async () => {
    const response = mockAnchorResponse(false);
    mockHandleFetch.mockResolvedValue(response);

    const result = await fetchMiscAnchor("hash2");

    expect(result).toEqual(response);
    expect(result.data).toBe(false);
  });

 
  it("propagates network errors from handleFetch", async () => {
    mockHandleFetch.mockRejectedValue(new Error("Network error"));

    await expect(fetchMiscAnchor("hash3")).rejects.toThrow("Network error");
  });
});
