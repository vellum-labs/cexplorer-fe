import type { ResponseCore } from "./commonTypes";

export enum GovernanceRole {
  DRep = "DRep",
  SPO = "SPO",
  ConstitutionalCommittee = "ConstitutionalCommittee",
}

interface GovernanceActionIdent {
  id: string;
  bech: string;
}

interface GovernanceActionTx {
  hash: string;
  time: string;
  invalid_hereafter: number | null;
  treasury_donation: number;
  index: number;
}

interface GovernanceActionDescription {
  tag: string;
  contents: any[];
}

interface GovernanceActionAnchor {
  url: string;
  data_hash: string;
  offchain: {
    name: string;
    abstract: string;
    motivation: string;
    rationale: string;
  } | null;
}

export interface GovernanceActionList {
  ident: GovernanceActionIdent;
  tx: GovernanceActionTx;
  prev_gov_action_proposal_id: null | string;
  deposit: number;
  return_address: {
    view: string;
  };
  expiration: number;
  anchor: GovernanceActionAnchor;
  type: string;
  description: GovernanceActionDescription;
  param_proposal: null;
  ratified_epoch: null;
  enacted_epoch: null;
  dropped_epoch: null;
  expired_epoch: null;
  voting_procedure: GovernanceActionVotingProcedure[] | null;
  total?: {
    drep?: {
      count: number;
      represented_by: number;
      stake: number;
      drep_always_no_confidence?: {
        represented_by: number;
        stake: number;
      };
      drep_always_abstain?: {
        represented_by: number;
        stake: number;
      };
    };
    spo?: {
      count: number;
      represented_by: number;
      stake: number;
      drep_always_abstain?: {
        represented_by: number;
        stake: number;
      };
      drep_always_no_confidence?: {
        represented_by: number;
        stake: number;
      };
    };
  };
  committee?: {
    quorum?: {
      numerator: number;
      denuminator: number;
    };
    member: GovernanceActionCommitteeMember[];
  };
}

interface GovernanceActionVotingProcedure {
  vote: string;
  voter_role: string;
  count: number;
  stat: {
    stake: number;
    represented_by: number;
  };
}

export interface GovernanceActionCommitteeMember {
  ident: {
    raw: string;
    has_script: boolean;
  };
  key: {
    cold: string;
    hot: string;
  };
  registry: {
    img: string;
    name: string;
  };
  vote: null | string;
  expiration_epoch: number | null;
}

export interface GovernanceActionDetail {
  ident: GovernanceActionIdent;
  tx: GovernanceActionTx;
  prev_gov_action_proposal_id: string | null;
  deposit: number;
  return_address: {
    view: string;
  };
  epoch_param: Array<{
    drep_activity: number;
    dvt_p_p_gov_group: number;
    committee_min_size: number;
    gov_action_lifetime: number;
    dvt_committee_normal: number;
    pvt_committee_normal: number;
    pvtpp_security_group: number;
    dvt_p_p_network_group: number;
    dvt_p_p_economic_group: number;
    dvt_p_p_technical_group: number;
    dvt_treasury_withdrawal: number;
    dvt_hard_fork_initiation: number;
    dvt_motion_no_confidence: number;
    pvt_hard_fork_initiation: number;
    pvt_motion_no_confidence: number;
    committee_max_term_length: number;
    dvt_update_to_constitution: number;
    dvt_committee_no_confidence: number;
    pvt_committee_no_confidence: number;
  }>;
  expiration: number;
  anchor: GovernanceActionAnchor;
  type: string;
  description: GovernanceActionDescription;
  param_proposal: null;
  ratified_epoch: number | null;
  enacted_epoch: number | null;
  dropped_epoch: number | null;
  expired_epoch: number | null;
  voting_procedure: GovernanceActionVotingProcedure[];
  total: {
    drep: {
      count: number;
      represented_by: number;
      stake: number;
      drep_always_no_confidence: {
        represented_by: number;
        stake: number;
      };
      drep_always_abstain: {
        represented_by: number;
        stake: number;
      };
    };
    spo: {
      count: number;
      represented_by: number;
      stake: number;
      drep_always_abstain: {
        represented_by: number;
        stake: number;
      };
      drep_always_no_confidence: {
        represented_by: number;
        stake: number;
      };
    };
  };
  committee: {
    quorum: {
      numerator: number;
      denuminator: number;
    };
    member: GovernanceActionCommitteeMember[];
  };
}

export type GovernanceActionListResponse = ResponseCore<{
  data: GovernanceActionList[];
  count: number;
}>;

export type GovernanceActionDetailResponse =
  ResponseCore<GovernanceActionDetail>;

export type GovernanceVoteDetailResponse =
  ResponseCore<GovernanceVoteDetailData>;

export interface GovernanceVoteDetailData {
  data: GovernanceVote[];
  count: number;
}

export interface GovernanceVote {
  voter_role: GovernanceRole;
  vote: "Yes" | "No" | "Abstain";
  proposal: GovernanceProposal;
  info: GovernanceVoterInfo;
  tx: GovernanceTx;
  anchor: {
    url: string | null;
    data_hash: string | null;
    offchain: {
      comment: string | null;
    };
  };
}

export interface GovernanceProposal {
  ident: {
    id: string;
    bech: string;
  };
  type: string; // e.g. "InfoAction"
  anchor: {
    url: string;
    data_hash: string;
    offchain: {
      name: string | null;
    };
  };
  tx: {
    hash: string;
    time: string;
    invalid_hereafter: string | null;
    treasury_donation: number;
  };
  deposit: number;
  expiration: number;
  description: {
    tag: string;
  };
  previous: string | null;
  ratified_epoch: number | null;
  enacted_epoch: number | null;
  dropped_epoch: number | null;
  expired_epoch: number | null;
}

export interface GovernanceVoterInfo {
  id: string;
  meta: {
    image_url: string | null;
    given_name?: string;
    name?: string;
    objectives: string;
    motivations: string;
    qualifications: string;
    payment_address: string;
  };
  power: {
    stake: number;
    represented_by: number;
  };
}

export interface GovernanceTx {
  hash: string;
  time: string;
  invalid_hereafter: string | null;
  treasury_donation: number;
  block_no: number;
  block_hash: string;
  epoch_no: number;
}

export interface CommitteeListItem {
  id: number;
  quorum_numerator: number;
  quorum_denominator: number;
  members: number;
}

export interface CommitteeListResponse {
  data: CommitteeListItem[];
  count: number;
}

export interface CommitteeStat {
  members: number;
}

export interface CommitteeKey {
  hot: string | null;
  cold: string | null;
}

export interface CommitteeIdent {
  raw: string;
  has_script: boolean;
}

export interface CommitteeRegistry {
  img: string;
  name: string;
}

export interface CommitteeMember {
  key: CommitteeKey;
  ident: CommitteeIdent;
  registry: CommitteeRegistry | null;
  registration: {
    hash: string;
    time: string;
    index: number;
    invalid_hereafter: null | number;
    treasury_donation: number;
  } | null;
  de_registration: null;
  expiration_epoch: number | null;
}

export interface CommitteeInfo {
  id: number | null;
  quorum_numerator: number;
  quorum_denominator: number;
}

export type CommitteeDetailResponse = ResponseCore<{
  stat: CommitteeStat;
  member: CommitteeMember[];
  committee: CommitteeInfo;
}>;

export interface ConstitutionAnchor {
  url: string;
  data_hash: string;
}

export interface ConstitutionDataItem {
  id: number;
  anchor: ConstitutionAnchor;
  script_hash: string;
  gov_action_proposal: any | null;
}

export type ConstitutionListResponse = ResponseCore<{
  data: ConstitutionDataItem[];
  count: number;
}>;

export interface CommitteeStat {
  members: number;
}

export interface CommitteeKey {
  hot: string | null;
  cold: string | null;
}

export interface CommitteeIdent {
  raw: string;
  has_script: boolean;
}

export interface CommitteeRegistry {
  img: string;
  name: string;
}

export interface CommitteeInfo {
  id: number | null;
  quorum_numerator: number;
  quorum_denominator: number;
}

export interface ThresholdGovStat {
  drep: {
    count: {
      total: number;
      active: number;
    };
    distr: {
      stake: number;
      delegators: number;
    };
    deposit: number;
  };
  stat: {
    other: {
      power: number;
      represented_by: number;
    };
    epoch_no: number;
    drep_always_abstain: {
      power: number;
      represented_by: number;
    };
    drep_always_no_confidence: {
      power: number;
      represented_by: number;
    };
  }[];
  stake: {
    total: number;
    drep_inactive: {
      power: number;
      represented_by: number;
    };
    drep_always_abstain: number;
    drep_always_no_confidence: number;
  };
  committee: {
    count: {
      total: number;
    };
  };
  gov_action: {
    total: number;
    active: number;
    enacted: number;
    expires: number;
    ratified: number;
  }[];
}

export interface ThresholdDrepList {
  data: {
    data: {
      image_url: string;
      given_name: string;
      objectives: string;
      motivations: string;
      qualifications: string;
      payment_address: string;
    };
    hash: {
      raw: string;
      view: string;
      has_script: boolean;
    };
    stat: {
      total: {
        votes: [
          {
            vote: string;
            count: number;
          },
        ];
        opportunity: number;
      };
      recently: string;
    };
    distr: {
      count: number;
      amount: number;
      active_until: number;
    };
    owner: {
      stake: string;
      address: string;
      balance: number;
    };
    since: string;
    amount: number;
    is_active: boolean;
    top_delegator: {
      view: string;
      stake: number;
    };
  }[];
  count: number;
}

export interface ThresholdPoolList {
  data: {
    stats: {
      recent: {
        roa: number;
        luck: number;
        epochs: number;
      };
      lifetime: {
        roa: number;
        luck: number;
        epochs: number;
      };
    };
    blocks: {
      epoch: number;
      total: number;
    };
    epochs: {
      [key: string]: {
        no: number;
        data: {
          block: {
            luck: number;
            minted: number;
            estimated: number;
          };
          reward: {
            leader_pct: number;
            member_pct: number;
            leader_lovelace: number;
            member_lovelace: number;
          };
          pledged: number;
          delegators: number;
          epoch_stake: number;
        };
      };
    };
    pledged: number;
    pool_id: string;
    pool_name: {
      name: string;
      ticker: string;
      extended: null;
      homepage: string;
      description: string;
    };
    delegators: number;
    last_block: {
      proto: number;
      slot_no: number;
    };
    live_stake: number;
    pool_retire: {
      live: null;
      active: null;
    };
    pool_update: {
      live: {
        tx: {
          hash: string;
          time: string;
        };
        index: number;
        owner: [
          {
            view: string;
          },
        ];
        margin: number;
        pledge: number;
        meta_id: number;
        fixed_cost: number;
        reward_addr: string;
        active_epoch_no: number;
      };
      active: {
        tx: {
          hash: string;
          time: string;
        };
        index: number;
        owner: [
          {
            view: string;
          },
        ];
        margin: number;
        pledge: number;
        meta_id: number;
        fixed_cost: number;
        reward_addr: string;
        active_epoch_no: number;
      };
    };
    active_stake: number;
    active_epochs: number;
    top_delegator: {
      view: string;
      stake: number;
    };
    pool_id_hash_raw: string;
  }[];
  count: number;
}

export interface ThresholdEpochStats {
  pots: {
    fees: number;
    utxo: number;
    rewards: number;
    slot_no: number;
    block_id: number;
    deposits: {
      deposits_drep: number;
      deposits_stake: number;
      deposits_proposal: number;
    };
    reserves: number;
    treasury: number;
  };
  daily: {
    date: string;
    stat: {
      sum_fee: number;
      count_tx: number;
      avg_tx_fee: number;
      count_mint: number;
      count_pool: number;
      drep_distr: {
        sum: number;
        count_uniq: number;
      };
      pool_distr: {
        sum: number;
        count_addr_uniq: number;
        count_pool_uniq: number;
      };
      sum_tx_out: number;
      avg_tx_size: number;
      count_block: number;
      count_datum: number;
      count_tx_out: number;
      block_version: {
        count: number;
        version: number;
      }[];
      avg_block_size: number;
      avg_tx_out_sum: number;
      count_redeemer: number;
      tx_composition: {
        datum: number;
        script: number;
        ma_tx_out: number;
        delegation: number;
        ma_tx_mint: number;
        withdrawal: number;
        pool_update: number;
        tx_metadata: number;
        redeemer_data: number;
        delegation_vote: number;
        drep_registration: number;
        stake_registration: number;
        gov_action_proposal: number;
        stake_deregistration: number;
      };
      block_producers: number;
      count_ma_tx_out: number;
      count_delegation: number;
      count_pool_relay: number;
      voting_procedure: number;
      count_tx_metadata: number;
      treasury_donation: number;
      avg_tx_script_size: number;
      count_tx_out_stake: number;
      max_block_tx_count: number;
      pool_block_version: {
        count: number;
        stake: number;
        version: number;
      }[];
    };
    gov_delegation_vote: number;
    count_tx_out_address: number;
    count_pool_relay_uniq: number;
    count_tx_metadata_with_721: number;
    count_tx_out_stake_not_yesterday: number;
    count_tx_out_address_not_yesterday: number;
  }[];
  epoch: {
    fees: number;
    out_sum: number;
    end_time: string;
    tx_count: number;
    block_size: number;
    start_time: string;
    block_count: number;
  };
  proto: {
    max: number;
    min: number;
  };
  stake: {
    epoch: number;
    pools: {
      minting: number;
      registered: number;
    };
    active: number;
    accounts: number;
  };
  rewards: {
    leader: null;
    member: null;
  };
  epoch_no: number;
  drep_stat: {
    total: {
      power: number;
      represented_by: number;
    };
    drep_always_abstain: {
      power: number;
      represented_by: number;
    };
    drep_always_no_confidence: {
      power: number;
      represented_by: number;
    };
  };
  pool_stat: {
    pools: number;
    pct_leader: null;
    pct_member: null;
    epoch_stake: null;
    delegator_avg: null;
    delegator_count: null;
    delegator_avg_sw: null;
    delegator_count_sw: null;
  };
  spendable_epoch: number;
}

export interface ThresholdsMilestone {
  data: {
    stat: {
      drep_distr: {
        sum: number;
        count_uniq: number;
      };
      pool_distr: {
        sum: number;
        count_addr_uniq: number;
        count_pool_uniq: number;
      };
      circulating_supply: number;
    };
    epoch_no: number;
  }[];
  count: number;
}

export interface ThresholdGovCommitteeDetail {
  stat: {
    members: number;
  };
  member: {
    key: {
      hot: string;
      cold: string;
    };
    ident: {
      raw: string;
      has_script: boolean;
    };
    registry: {
      img: string;
      name: string;
    };
    registration: {
      hash: string;
      time: string;
      index: number;
      invalid_hereafter: null;
      treasury_donation: number;
    };
    de_registration: null;
    expiration_epoch: number;
  }[];
  committee: {
    id: null;
    quorum_numerator: number;
    quorum_denominator: number;
  };
}

export interface Threshold {
  x: string;
  gov_stat: ThresholdGovStat;
  drep_list: ThresholdDrepList;
  pool_list: ThresholdPoolList;
  epoch_stats: ThresholdEpochStats;
  analytics_milestone: ThresholdsMilestone;
  gov_committee_detail: ThresholdGovCommitteeDetail;
}

export type ThresholdResponse = ResponseCore<Threshold>;

export interface ConstitutionAnchor {
  url: string;
  data_hash: string;
}

export interface ConstitutionDataItem {
  id: number;
  anchor: ConstitutionAnchor;
  script_hash: string;
  gov_action_proposal: any | null;
}
