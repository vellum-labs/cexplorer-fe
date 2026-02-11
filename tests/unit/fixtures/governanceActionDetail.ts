/**
 * Fixtures for governance action detail testing.
 * Based on real GovernanceActionDetail type from src/types/governanceTypes.ts
 */

export const governanceActionDetailFixture = {
  ident: {
    id: "gov_action1qpx0qfnj6#0",
    bech: "gov_action1qpx0qfnj6_bech32_encoded",
  },
  tx: {
    hash: "abc123def456abc123def456abc123def456abc123def456abc123def456abcd",
    time: "2024-11-15T10:30:00",
    invalid_hereafter: null,
    treasury_donation: 0,
    index: 0,
  },
  prev_gov_action_proposal_id: null,
  deposit: 100000000000,
  return_address: {
    view: "stake1ux4vspfvhfcge9g25fna3cq95ncme0rsm3hjmjz03cdsgscx5lhrc",
  },
  expiration: 510,
  type: "TreasuryWithdrawals",
  anchor: {
    url: "https://example.com/proposal.json",
    data_hash: "abc123def456abc123def456abc123def456abc123def456abc123def456abcd",
    offchain: {
      name: "Test Governance Action Proposal",
      abstract: "This is a test governance action for unit testing.",
      motivation: "To verify the rendering of governance details.",
      rationale: "Unit tests improve code reliability.",
    },
  },
  description: {
    tag: "TreasuryWithdrawals",
    contents: [
      null,
      [
        {
          stake_credential: {
            AddrKeyCred: "abc123",
          },
          coin: 50000000000,
        },
      ],
    ],
  },
  param_proposal: null,
  ratified_epoch: null,
  enacted_epoch: null,
  dropped_epoch: null,
  expired_epoch: null,
  epoch_param: [
    {
      drep_activity: 20,
      dvt_p_p_gov_group: 0.75,
      committee_min_size: 7,
      gov_action_lifetime: 6,
      dvt_committee_normal: 0.67,
      pvt_committee_normal: 0.51,
      pvtpp_security_group: 0.6,
      dvt_p_p_network_group: 0.67,
      dvt_p_p_economic_group: 0.67,
      dvt_p_p_technical_group: 0.67,
      dvt_treasury_withdrawal: 0.67,
      dvt_hard_fork_initiation: 0.6,
      dvt_motion_no_confidence: 0.67,
      pvt_hard_fork_initiation: 0.51,
      pvt_motion_no_confidence: 0.51,
      committee_max_term_length: 146,
      dvt_update_to_constitution: 0.75,
      dvt_committee_no_confidence: 0.6,
      pvt_committee_no_confidence: 0.51,
    },
  ],
  voting_procedure: [
    {
      voter_role: "DRep",
      vote: "Yes",
      count: 120,
      stat: { stake: 5000000000000, represented_by: 500 },
    },
    {
      voter_role: "DRep",
      vote: "No",
      count: 30,
      stat: { stake: 1000000000000, represented_by: 100 },
    },
    {
      voter_role: "DRep",
      vote: "Abstain",
      count: 10,
      stat: { stake: 200000000000, represented_by: 50 },
    },
    {
      voter_role: "SPO",
      vote: "Yes",
      count: 80,
      stat: { stake: 3000000000000, represented_by: 300 },
    },
    {
      voter_role: "SPO",
      vote: "No",
      count: 20,
      stat: { stake: 800000000000, represented_by: 80 },
    },
    {
      voter_role: "SPO",
      vote: "Abstain",
      count: 5,
      stat: { stake: 100000000000, represented_by: 25 },
    },
  ],
  total: {
    drep: {
      count: 300,
      represented_by: 1500,
      stake: 9000000000000,
      drep_always_no_confidence: {
        represented_by: 20,
        stake: 500000000000,
      },
      drep_always_abstain: {
        represented_by: 30,
        stake: 300000000000,
      },
    },
    spo: {
      count: 200,
      represented_by: 800,
      stake: 6000000000000,
      drep_always_abstain: {
        represented_by: 15,
        stake: 200000000000,
      },
      drep_always_no_confidence: {
        represented_by: 10,
        stake: 400000000000,
      },
    },
  },
  committee: {
    quorum: {
      numerator: 2,
      denuminator: 3,
    },
    member: [
      {
        ident: { raw: "cc_member_hash_1", has_script: false },
        key: { cold: "cold_key_1", hot: "hot_key_1" },
        registry: { img: "", name: "CC Member Alpha" },
        vote: "Yes",
        expiration_epoch: 600,
      },
      {
        ident: { raw: "cc_member_hash_2", has_script: false },
        key: { cold: "cold_key_2", hot: "hot_key_2" },
        registry: { img: "", name: "CC Member Beta" },
        vote: "Yes",
        expiration_epoch: 600,
      },
      {
        ident: { raw: "cc_member_hash_3", has_script: true },
        key: { cold: "cold_key_3", hot: "hot_key_3" },
        registry: { img: "", name: "CC Member Gamma" },
        vote: "No",
        expiration_epoch: 550,
      },
      {
        ident: { raw: "cc_member_hash_4", has_script: false },
        key: { cold: "cold_key_4", hot: "hot_key_4" },
        registry: { img: "", name: "Unknown" },
        vote: null,
        expiration_epoch: 600,
      },
      {
        ident: { raw: "cc_member_hash_5", has_script: false },
        key: { cold: "cold_key_5", hot: "hot_key_5" },
        registry: { img: "", name: "CC Member Epsilon" },
        vote: null,
        expiration_epoch: 600,
      },
    ],
  },
};

/**
 * Wraps fixture data in the API response envelope (ResponseCore<T>).
 */
export const governanceActionDetailResponseFixture = {
  code: 200,
  data: governanceActionDetailFixture,
  tokens: 0,
  ex: 15,
  debug: false,
};

/**
 * A minimal fixture for a ratified & enacted governance action.
 */
export const enactedGovernanceActionFixture = {
  ...governanceActionDetailFixture,
  type: "HardForkInitiation",
  ratified_epoch: 505,
  enacted_epoch: 510,
};

/**
 * A minimal fixture for an expired governance action.
 */
export const expiredGovernanceActionFixture = {
  ...governanceActionDetailFixture,
  type: "InfoAction",
  expired_epoch: 508,
};

/**
 * Fixture with no description contents and no offchain metadata.
 * Useful for testing hidden tabs.
 */
export const minimalGovernanceActionFixture = {
  ...governanceActionDetailFixture,
  description: { tag: "InfoAction", contents: null },
  anchor: {
    ...governanceActionDetailFixture.anchor,
    offchain: null,
  },
};
