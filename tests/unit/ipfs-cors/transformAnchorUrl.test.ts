import { vi } from "vitest";

vi.mock("@/constants/conf", () => ({
  configJSON: {
    ipfs: "https://ipfs.blockfrost.dev/ipfs",
  },
}));

import { transformAnchorUrl } from "@/utils/format/transformAnchorUrl";

describe("transformAnchorUrl", () => {
 
  it("transforms ipfs:// URL using the configured gateway", () => {
    const result = transformAnchorUrl("ipfs://QmHash123");
    expect(result).toBe("https://ipfs.blockfrost.dev/ipfs/QmHash123");
  });

  it("strips ipfs:// prefix and appends CID to gateway", () => {
    const cid = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    const result = transformAnchorUrl(`ipfs://${cid}`);
    expect(result).toBe(`https://ipfs.blockfrost.dev/ipfs/${cid}`);
  });

  it("does not produce double slash between gateway and CID", () => {
  const result = transformAnchorUrl("ipfs://QmHash");
    expect(result).toBe("https://ipfs.blockfrost.dev/ipfs/QmHash");
    expect(result).not.toMatch(/\/\/QmHash/);
  });

 
  it("returns https:// URL unchanged", () => {
    const url = "https://example.com/metadata.json";
    expect(transformAnchorUrl(url)).toBe(url);
  });

  it("returns http:// URL unchanged", () => {
    const url = "http://example.com/metadata.json";
    expect(transformAnchorUrl(url)).toBe(url);
  });

  
  it("returns undefined for null", () => {
    expect(transformAnchorUrl(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(transformAnchorUrl(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(transformAnchorUrl("")).toBeUndefined();
  });

 
  it("returns other URL schemes unchanged", () => {
    const url = "ftp://files.example.com/meta";
    expect(transformAnchorUrl(url)).toBe(url);
  });
});
