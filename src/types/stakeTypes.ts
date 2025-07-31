import type { AddressAdaHandle, AddressAsset } from "./addressTypes";
import type { BlockBasicInfo } from "./blockTypes";
import type { ResponseCore } from "./commonTypes";
import type { TxBasicInfo } from "./txTypes";
import type { User } from "./userTypes";

interface Delegation {
  id: string | null;
  meta: string | null;
  delegation: string;
}

export interface StakeDetailData {
  view: string;
  asset: AddressAsset[];
  hash_raw: string;
  script_hash: string | null;
  reward: {
    total: number;
    withdrawn: number;
  };
  stake: {
    info: {
      active: boolean;
      slot_update: null;
      slot_first_registered: null;
    };
    live: {
      deleg: Delegation;
      amount: null;
      accounts: 0;
    };
    active: {
      deleg: Delegation;
      amount: null;
      reward: null;
      epoch_no: null;
      epoch_delay: null;
    };
  };
  user: User;
  adahandle: AddressAdaHandle | null;
  vote: {
    vote: {
      slot_first_registered: number;
      slot_update: number;
      live_drep: string;
    };
    drep: {
      is_active: boolean;
      amount: number;
      data: any;
      hash: {
        raw: string;
        view: string;
        has_script: boolean;
      };
      since: string;
    };
  };
}

export type StakeDetailResponse = ResponseCore<StakeDetailData>;

export interface StakeRegistrationsData {
  tx: Omit<TxBasicInfo, "block">;
  data: {
    hash_raw: string;
    view: string;
    script_hash: string | null;
    epoch_no: number;
  };
  block: Omit<BlockBasicInfo, "slot_no">;
}

export type StakeRegistrationsResponse = ResponseCore<{
  count: number;
  data: StakeRegistrationsData[];
}>;
