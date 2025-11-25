import type { BlockBasicInfo } from "./blockTypes";
import type { ResponseCore } from "./commonTypes";
import type { TxBasicInfo } from "./txTypes";
import type { AnchorInfo, GovernanceRole } from "./governanceTypes";

export type DrepListOrder =
  | "average_power"
  | "power"
  | "own"
  | "since"
  | "delegator"
  | "average_stake"
  | "top_delegator"
  | undefined;

interface DrepCount {
  total: number | undefined;
  active: number | undefined;
  inactive: number | undefined;
  retired: number | undefined;
}

interface DrepDistrStat {
  stake: number;
  delegators: number;
}

interface StatDrep {
  count: DrepCount;
  distr: DrepDistrStat;
  deposit: number;
}

interface DrepStake {
  total: number;
  drep_always_abstain: number;
  drep_always_no_confidence: number;
}

interface DrepCommittee {
  count: {
    total: number;
  };
}

interface DrepStat {
  drep: StatDrep;
  stake: DrepStake;
  committee: DrepCommittee;
}

interface DrepHash {
  raw: string;
  view: string;
  legacy: string;
  has_script: boolean;
}

interface DrepDistr {
  count: number;
  amount: number;
  active_until: number;
}

interface ToplistItem {
  item: {
    amount: number;
    data: any;
    hash: DrepHash;
    distr: DrepDistr;
    since: string | null;
  };
}

interface DrepToplist {
  by_stake: ToplistItem[];
  by_count: ToplistItem[];
}

interface DelegatorItem {
  count: number;
  stake: number;
}

interface DrepDelegator {
  total: DelegatorItem;
  drep_always_abstain: DelegatorItem;
  drep_always_no_confidence: DelegatorItem;
  delegated_stake_pools: DelegatorItem;
}

interface AnalyticsDrepDistr {
  amount: number;
  count: number;
  epoch_no: number;
  drep_always_abstain: number;
  drep_always_no_confidence: number;
}

export interface DrepAnalytics {
  toplist: DrepToplist;
  delegator: DrepDelegator;
  drep_distr: AnalyticsDrepDistr[];
}

export interface StakeDrepRetired {
  drep: {
    count: number;
  };
  delegator: {
    count: number;
    stake: number;
  };
}

export type StakeDrepRetiredResponse = ResponseCore<StakeDrepRetired>;

interface DrepVotes {
  count: number;
  vote: string;
}

interface DrepTotal {
  votes: DrepVotes[];
  opportunity: number;
}
interface DrepListStat {
  total: DrepTotal;
  recently: string;
}

interface VoteStats {
  total: {
    gov_votes: number;
    gov_actions: number;
  };
  recent: {
    gov_votes: number;
    gov_actions: number;
  };
}

interface VoteStatRate {
  total: number;
  recent: number;
}

interface DrepVoteStat {
  recent_vote: string;
  stat: VoteStats;
  rate: VoteStatRate;
}

export interface DrepListData {
  is_active: number;
  amount: number;
  data: any;
  hash: DrepHash;
  distr: DrepDistr;
  stat: DrepListStat;
  since: string | null;
  owner: DrepOwner;
  gov_action?: {
    vote: string;
  } | null;
  pool?: string[];
  top_delegator: {
    view: string;
    stake: number;
  };
  image_url?: string;
  votestat?: DrepVoteStat;
}

interface DrepList {
  count: number;
  data: DrepListData[];
}

interface DrepTx {
  slot: number;
  epoch_no: number;
  tx_hash: string;
}

interface DrepCertItem {
  deposit: number;
  tx: DrepTx;
}

interface DrepCert {
  update: DrepCertItem;
  registration: DrepCertItem;
}

interface DrepActionTx {
  hash: string;
  time: string;
  invalid_hereafter: null | string;
  treasury_donation: number;
  block_no: number;
  block_hash: string;
  epoch_no: number;
}

export interface DrepAction {
  type: string;
  tx: DrepActionTx;
  vote: null | string;
}

interface DrepStat {
  total: DrepTotal;
  recently: string;
  gov_action: {
    total: number;
    active: number;
    enacted: number;
    expires: number;
    ratified: number;
  }[];
}

type DrepOwner = {
  stake: string;
  address: string;
  balance: number;
};

export interface DrepDistrDetail {
  epoch_no: number;
  power: number;
  represented_by: number;
}

export interface DrepDetail {
  deposit: number;
  owner: {
    address: string;
    stake: string;
    balance: number;
  };
  amount: number;
  is_active: boolean;
  data: {
    image_url: string | null;
    given_name: string;
    objectives: string;
    motivations: string;
    qualifications: string;
    payment_address: string;
  } | null;
  cert: DrepCert;
  hash: DrepHash;
  distr: DrepDistr;
  action: DrepAction[];
  stat: DrepStat;
  since: string;
  votestat?: DrepVoteStat;
}

interface DrepInfo {
  id: string;
  meta: null | any;
  power: {
    stake: number;
    represented_by: number;
  } | null;
}

interface DelegatorInfo {
  id: string;
  data: any;
  tx: DrepTx;
}

interface DrepAnchor {
  url: string;
  data_hash: string;
  offchain: {
    name: string | null;
  };
}

export interface DrepProposal {
  ident: {
    id: string;
    bech: string;
  };
  tx: {
    hash: string;
    time: string;
    invalid_hereafter: string | null;
    treasury_donation: number;
  };
  type: string;
  anchor: DrepAnchor;
  deposit: number;
  expiration: number;
  description: {
    tag: string;
  };
  previous: null;
  ratified_epoch: null | number;
  enacted_epoch: null | number;
  dropped_epoch: null | number;
  expired_epoch: null | number;
}

export interface DrepVoteItem {
  voter_role: GovernanceRole;
  vote: "Yes" | "No" | "Abstain";
  proposal: DrepProposal;
  info: DrepInfo;
  tx: DrepActionTx;
  anchor?: AnchorInfo;
}

interface DrepVote {
  count: number;
  data: DrepVoteItem[];
}

export interface DelegatorData {
  view: string;
  slot_first_registered: number;
  slot_update: number;
  script: string;
  live_stake: number;
  live_drep: DelegatorInfo;
  previous_drep: null | DelegatorInfo;
}

interface DrepDelegator {
  count: number;
  data: DelegatorData;
}

export interface DrepRegistrationsData {
  tx: Omit<TxBasicInfo, "block">;
  data: {
    raw: string;
    view: string;
    deposit: number;
    has_script: boolean;
  };
  block: Omit<BlockBasicInfo, "slot_no">;
  owner: DrepOwner;
}

export type DrepRegistrationsResponse = ResponseCore<{
  count: number;
  data: DrepRegistrationsData[];
}>;
export type DrepStatResponse = ResponseCore<DrepStat>;
export type DrepAnalyticsResponse = ResponseCore<DrepAnalytics>;
export type DrepListResponse = ResponseCore<DrepList>;
export type DrepDetailResponse = ResponseCore<DrepDetail>;
export type DrepVoteResponse = ResponseCore<DrepVote>;
export type DrepDelegatorResponse = ResponseCore<DrepDelegator>;

export interface AverageDrep {
  epoch_no: number;
  avg_delegator: number;
  avg_epoch_stake: number;
}

export type AverageDrepResponse = ResponseCore<AverageDrep[]>;

export interface DrepSpoSameTime {
  epoch_no: number;
  count: number;
  stake: number;
  delegator: number;
}

export type DrepSpoSameTimeResponse = ResponseCore<DrepSpoSameTime[]>;

export type CombinedAverageDrepResponse = {
  averageDrep: AverageDrep[];
  drepSpoSameTime: DrepSpoSameTime[];
};

export interface StakeIsSpoDrep {
  epoch_no: number;
  count: number;
  stake: number;
  delegator: number;
}

export type StakeIsSpoDrepResponse = ResponseCore<StakeIsSpoDrep[]>;

export interface DelegEpochChanges {
  no: number;
  slot_min: number;
  slot_max: number;
  stat: {
    count: number;
    stake: number;
  };
}

export type DelegEpochChangesResponse = ResponseCore<DelegEpochChanges[]>;
