import { BasicTableOptions, CexplorerNftsColumns } from "@/types/tableTypes";

type CexplorerNftsTableOptions = {
  key: keyof BasicTableOptions<CexplorerNftsColumns>["columnsVisibility"];
  name: string;
}[];

export const cexplorerNftsTableOptions: CexplorerNftsTableOptions = [
  {
    key: "star",
    name: "Star",
  },
  {
    key: "index",
    name: "#",
  },
  {
    key: "nft",
    name: "NFT",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "power",
    name: "Delegated Superpowers",
  },
  {
    key: "modify",
    name: "Modify",
  },
];
