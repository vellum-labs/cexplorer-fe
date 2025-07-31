import { configJSON } from "@/constants/conf";

export const transformAnchorUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;

  // If URL starts with ipfs://, transform it using the config IPFS gateway
  if (url.startsWith("ipfs://")) {
    const cid = url.replace("ipfs://", "");
    const ipfsGateway = configJSON.ipfs;
    
    if (!ipfsGateway || !cid) {
      return url; // Fallback to original URL if transformation fails
    }
    
    // Remove trailing slash from gateway if present and add /ipfs/
    const gateway = ipfsGateway.endsWith("/") ? ipfsGateway.slice(0, -1) : ipfsGateway;
    return `${gateway}/${cid}`;
  }

  // For http:// and https:// URLs, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // For any other URLs, return as-is to avoid breaking existing functionality
  return url;
};