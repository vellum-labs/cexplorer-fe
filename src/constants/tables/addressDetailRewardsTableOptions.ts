import type { AddressDetailRewardsTableOptions } from "@/types/tableTypes";

interface AddressRewardsOptions {
  key: keyof AddressDetailRewardsTableOptions["columnsVisibility"];
  name: string;
}

export const addressDetailRewardsTableOptions: AddressRewardsOptions[] = [
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "date",
    name: "Date",
  },
  {
    key: "stake_pool",
    name: "Stake Pool",
  },
  {
    key: "active_stake",
    name: "Active Stake",
  },
  {
    key: "reward",
    name: "Reward",
  },
  {
    key: "roa",
    name: "ROA",
  },
];
