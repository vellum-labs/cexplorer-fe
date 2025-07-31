import type { BlockListColumns, TableOptionsCore } from "@/types/tableTypes";

type BlockListOptions = {
  key: keyof TableOptionsCore<BlockListColumns>["columnsVisibility"];
  name: string;
}[];

export const blocksListTableOptions: BlockListOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "block_no",
    name: "Height",
  },
  {
    key: "epoch_no",
    name: "Epoch",
  },
  {
    key: "slot_no",
    name: "Slot",
  },
  {
    key: "tx_count",
    name: "TXs",
  },
  {
    key: "minted_by",
    name: "Minted by",
  },
  {
    key: "hash",
    name: "Hash",
  },
  {
    key: "epoch_slot_no",
    name: "Epoch slot",
  },
  {
    key: "vrf_key",
    name: "VRF key",
  },
  {
    key: "protocol",
    name: "Protocol",
  },
  {
    key: "cert_counter",
    name: "Cert counter",
  },
  {
    key: "size",
    name: "Size",
  },
];
