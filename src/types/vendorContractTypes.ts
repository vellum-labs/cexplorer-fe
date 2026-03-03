export interface MilestonesSummary {
  total: number;
  pending: number;
  completed: number;
  disbursed: number;
}

export interface Financials {
  total_allocated_lovelace: number;
  total_allocated_ada: number;
  total_disbursed_lovelace: number;
  total_disbursed_ada: number;
  current_balance_lovelace: number;
  current_balance_ada: number;
  disbursement_percentage: number;
  utxo_count: number;
}

export interface Treasury {
  contract_instance: string;
  name: string | null;
}

export interface VendorContract {
  id: number;
  project_id: string;
  project_name: string;
  description: string;
  vendor_name: string | null;
  vendor_address: string;
  contract_url: string | null;
  contract_address: string;
  status: "pending_approval" | "active" | "paused" | "completed" | "cancelled";
  fund_tx_hash: string;
  fund_time: number;
  initial_amount_lovelace: number;
  initial_amount_ada: number;
  milestones_summary: MilestonesSummary;
  financials: Financials;
  treasury: Treasury;
  last_event_time: number;
  event_count: number;
}

export interface VendorContractsResponse {
  data: VendorContract[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    has_next: boolean;
  };
  meta: {
    timestamp: string;
  };
}

export type VendorContractStatusFilter =
  | "pending_approval"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface FetchVendorContractsParams {
  page?: number;
  limit?: number;
  status?: VendorContractStatusFilter;
  search?: string;
  sort?: "fund_time" | "project_id" | "project_name";
  order?: "asc" | "desc";
  from_time?: number;
  to_time?: number;
}

// Treasury API types
export interface TreasuryStatistics {
  vendor_contract_count: number;
  active_contracts: number;
  completed_contracts: number;
  cancelled_contracts: number;
  total_events: number;
  utxo_count: number;
  last_event_time: number;
}

export interface TreasuryFinancials {
  balance_lovelace: number;
  balance_ada: number;
}

export interface TreasuryData {
  id: number;
  contract_instance: string;
  contract_address: string | null;
  stake_credential: string | null;
  name: string | null;
  status: string;
  publish_tx_hash: string | null;
  publish_time: number | null;
  initialized_tx_hash: string;
  initialized_at: number;
  permissions: unknown | null;
  statistics: TreasuryStatistics;
  financials: TreasuryFinancials;
  created_at: string;
  updated_at: string;
}

export interface TreasuryResponse {
  data: TreasuryData;
  meta: {
    timestamp: string;
  };
}

// Statistics API types
export interface StatisticsTreasury {
  total_count: number;
  active_count: number;
  disbursed_count: number;
}

export interface StatisticsProjects {
  total_count: number;
  active_count: number;
  completed_count: number;
  paused_count: number;
  cancelled_count: number;
}

export interface StatisticsMilestones {
  total_count: number;
  pending_count: number;
  completed_count: number;
  withdrawn_count: number;
}

export interface StatisticsEvents {
  total_count: number;
  by_type: {
    initialize: number;
    withdraw: number;
    resume: number;
    disburse: number;
    publish: number;
    complete: number;
    pause: number;
    fund: number;
  };
}

export interface StatisticsFinancials {
  total_allocated_lovelace: number;
  total_allocated_ada: number;
  total_disbursed_lovelace: number;
  total_disbursed_ada: number;
  current_balance_lovelace: number;
  current_balance_ada: number;
}

export interface StatisticsSync {
  last_slot: number;
  last_block: number;
  last_updated: string;
}

export interface StatisticsData {
  treasury: StatisticsTreasury;
  projects: StatisticsProjects;
  milestones: StatisticsMilestones;
  events: StatisticsEvents;
  financials: StatisticsFinancials;
  sync: StatisticsSync;
}

export interface StatisticsResponse {
  data: StatisticsData;
  meta: {
    timestamp: string;
  };
}

// Single Vendor Contract Detail types
export interface VendorContractDetail {
  id: number;
  project_id: string;
  project_name: string;
  description: string;
  vendor_name: string | null;
  vendor_address: string;
  contract_url: string | null;
  contract_address: string;
  status: "active" | "paused" | "completed" | "cancelled" | "pending_approval";
  fund_tx_hash: string;
  fund_time: number;
  initial_amount_lovelace: number;
  initial_amount_ada: number;
  milestones_summary: MilestonesSummary;
  financials: Financials;
  treasury: Treasury;
  last_event_time: number;
  event_count: number;
}

export interface VendorContractDetailResponse {
  data: VendorContractDetail;
  meta: {
    timestamp: string;
  };
}

// Milestones types
export interface Milestone {
  id: number;
  milestone_id: string;
  milestone_order: number;
  label: string;
  description: string | null;
  acceptance_criteria: string | null;
  amount_lovelace: number | null;
  amount_ada: number | null;
  status: "pending" | "completed" | "withdrawn";
  completion: string | null; // ISO date string
  disbursement: string | null; // ISO date string
  project: {
    project_id: string;
    project_name: string;
  };
}

export interface MilestonesResponse {
  data: Milestone[];
  meta: {
    timestamp: string;
  };
}

// Events types
export interface VendorContractEvent {
  id: number;
  tx_hash: string;
  slot: number;
  block_number: number;
  block_time: number; // Unix timestamp
  event_type:
    | "initialize"
    | "withdraw"
    | "resume"
    | "disburse"
    | "publish"
    | "complete"
    | "pause"
    | "fund";
  amount_lovelace: number | null;
  amount_ada: number | null;
  reason: string | null;
  destination: string | null;
  treasury: {
    contract_instance: string;
    name: string | null;
  } | null;
  project: {
    project_id: string;
    project_name: string;
    vendor_name: string | null;
    contract_address: string;
  };
  milestone: {
    milestone_id: string;
    label: string | null;
    milestone_order: number;
  } | null;
  metadata_raw: unknown;
  created_at: string;
}

export interface EventsResponse {
  data: VendorContractEvent[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    has_next: boolean;
  };
  meta: {
    timestamp: string;
  };
}

export interface FetchEventsParams {
  projectId: string;
  page?: number;
  limit?: number;
}
