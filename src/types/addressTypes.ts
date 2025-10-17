import type { Meta } from "./accountTypes";
import type { AssetCore, AssetRegistry } from "./assetsTypes";
import type { ResponseCore } from "./commonTypes";
import type { User } from "./userTypes";

interface AddressTx {
  active_epoch_no: number;
  slot: number;
  tx_hash: string;
}

interface AddressDelegation {
  pool: string;
  tx: AddressTx;
}

interface AddressStakePool {
  id: string;
  meta: Meta;
  delegation: AddressDelegation;
}

interface AddressStake {
  view: string;
  slot_update: number;
  slot_first_registered: number;
  live_pool: AddressStakePool;
  active_pool: AddressStakePool;
  balance: {
    live: number;
    active: number;
  };
  reward: {
    total: number;
    withdrawn: number;
  };
}

//may be redundant

// interface AddressRegistry {
//   name: string;
//   ticker: string;
//   has_logo: boolean;
//   decimals: number;
// }

export type AddressAsset = AssetCore & {
  quantity: number;
  name: string;
  registry: AssetRegistry;
  market: {
    quantity: number;
    price: number | null;
    liquidity: number | null;
  };
};

interface AddressActivity {
  first: string;
  recent: string;
  count: number;
}

interface AddressExtract {
  address: string;
  magic: number;
  header: number;
  payment: string;
  stake: string;
}

export interface AddressAdaHandle {
  hex: string;
  pkh: string;
  utxo: string;
}

export interface AddressDetailData {
  address: string;
  stake: AddressStake | null;
  balance: number;
  asset: AddressAsset[];
  activity: AddressActivity;
  extract: AddressExtract;
  adahandle: AddressAdaHandle | null;
  user: User;
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

interface AddressDetail {
  count: number;
  data: AddressDetailData[];
}

export interface AddressListItem {
  address: string;
  asset: AddressAsset[];
  stake: string;
  payment_cred: string;
  balance: number | null;
  first: string;
  last: string;
  activity: number;
}

export interface AddressList {
  count: number;
  data: AddressListItem[];
}

interface UTXOSet {
  tx_hash: string;
  tx_index: number;
  block_height: number;
  block_time: number;
  value: number;
  datum_hash: null | string;
  asset_list: [];
}

interface UTXO {
  sum: number;
  bool_or: string;
  utxo_set: UTXOSet[];
}

export interface AddressUTXO {
  count: number;
  data: UTXO[];
}

interface AddressInspector {
  address: string;
  magic: number;
  header: number;
  payment: string;
  stake: string;
}

export type AddressDetailResponse = ResponseCore<AddressDetail>;
export type AddressDetailUTXOResponse = ResponseCore<AddressUTXO>;
export type AddressListResponse = ResponseCore<AddressList>;
export type AddressInspectorResponse = ResponseCore<AddressInspector>;
