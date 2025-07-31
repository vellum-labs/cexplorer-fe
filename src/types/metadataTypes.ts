import type { ResponseCore } from "./commonTypes";

interface MetadataTx {
  hash: string;
  slot_no: number;
}

export interface MetadataTxListItem {
  tx: MetadataTx;
  key: number;
  md: any;
  size: number;
}

interface MetadataTxListData {
  count: number;
  data: MetadataTxListItem[];
}

export type MetadataTxListResponse = ResponseCore<MetadataTxListData>;
