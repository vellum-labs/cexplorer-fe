import type {
  CommitteeDetailResponse,
  CommitteeListResponse,
  ConstitutionListResponse,
  GovernanceActionDetailResponse,
  GovernanceActionListResponse,
  ThresholdResponse,
} from "@/types/governanceTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const fetchGovernenceAction = async (
  limit = 10,
  offset = 0,
  state: "All" | "Active" | "Ratified" | "Enacted" | "Expired",
  search?: string,
) => {
  const url = "/gov/gov_action_proposal_list";
  const options = {
    params: { limit, offset, state, search },
  };
  return handleFetch<GovernanceActionListResponse>(url, offset, options);
};

export const useFetchGovernanceAction = (
  limit: number,
  page: number,
  state: "All" | "Active" | "Ratified" | "Enacted" | "Expired",
  search?: string,
) =>
  useInfiniteQuery({
    queryKey: ["gov-action-list", limit, page, state, search],
    queryFn: ({ pageParam = page }) =>
      fetchGovernenceAction(limit, pageParam, state, search),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      return nextOffset >= lastPage.data.count ? undefined : nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });

export const fetchGovernenceActionDetail = async (id: string) => {
  const url = "/gov/gov_action_proposal_detail";
  const options = { params: { id } };
  return handleFetch<GovernanceActionDetailResponse>(url, undefined, options);
};

export const useFetchGovernanceActionDetail = (id: string) =>
  useQuery({
    queryKey: ["governance_action_detail", id],
    queryFn: () => fetchGovernenceActionDetail(id),
  });

export const fetchGovernenceVote = async (
  limit = 10,
  offset = 0,
  id: string,
  voter_role?: string,
  order?: "stake" | "represented_by",
  sort?: "asc" | "desc",
  vote?: string,
  vote_not = true,
  search?: string,
) => {
  const url = voter_role && vote_not ? "/gov/vote_not" : "/gov/vote";
  const options = {
    params: {
      limit,
      offset,
      gov_action_proposal: id,
      voter_role,
      order: voter_role ? (order ?? "stake") : undefined,
      sort: voter_role ? (sort ?? "desc") : undefined,
      vote,
      search,
    },
  };
  return handleFetch<any>(url, undefined, options);
};

export const useFetchGovernanceVote = (
  limit: number,
  page: number,
  id: string,
  voter_role?: string,
  order?: "stake" | "represented_by",
  sort?: "asc" | "desc",
  vote?: string,
  vote_not = true,
  search?: string,
) =>
  useInfiniteQuery({
    queryKey: [
      "gov-vote",
      limit,
      page,
      id,
      voter_role,
      order,
      sort,
      vote,
      search,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchGovernenceVote(
        limit,
        pageParam,
        id,
        voter_role,
        order,
        sort,
        vote,
        vote_not,
        search,
      ),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      return nextOffset >= lastPage.data.count ? undefined : nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });

export const fetchVoteDetail = async (tx: string) => {
  const url = "/gov/vote";
  const options = { params: { tx } };
  return handleFetch<any>(url, undefined, options);
};

export const useFetchVoteDetail = (tx: string | undefined) =>
  useQuery({
    queryKey: ["gov-vote-detail", tx],
    queryFn: () => fetchVoteDetail(tx!),
    enabled: !!tx,
    refetchOnWindowFocus: false,
  });

export const fetchCommitteeList = async () => {
  const url = "/gov/committee_list/";
  const options = {};

  return handleFetch<CommitteeListResponse>(url, undefined, options);
};

export const useFetchCommitteeList = () => {
  return useQuery({
    queryKey: ["committee-list"],
    queryFn: () => fetchCommitteeList(),
  });
};

export const fetchCommitteeDetail = async (id: number = 0) => {
  const url = "/gov/committee_detail";
  const options = {
    params: {
      id,
    },
  };

  return handleFetch<CommitteeDetailResponse>(url, undefined, options);
};

export const useFetchCommitteeDetail = () => {
  return useQuery({
    queryKey: ["committee-detail"],
    queryFn: () => fetchCommitteeDetail(),
  });
};

export const fetchConstitutionList = async (limit: number = 1) => {
  const url = "/gov/constitution_list";
  const options = {
    params: {
      limit,
    },
  };

  return handleFetch<ConstitutionListResponse>(url, undefined, options);
};

export const useFetchConstitutionList = () => {
  return useQuery({
    queryKey: ["constitution-list"],
    queryFn: () => fetchConstitutionList(),
  });
};

export const fetchCCVotes = async (
  limit = 10,
  offset = 0,
  vote,
  committee_voter,
  tx,
) => {
  const url = "/gov/vote";
  const options = {
    params: {
      limit,
      offset,
      voter_role: "ConstitutionalCommittee",
      vote,
      committee_voter,
      tx,
    },
  };

  return handleFetch<any>(url, undefined, options);
};

export const useFetchCCVotes = (
  limit = 10,
  page: number,
  vote?: string,
  committee_voter?: string,
  tx?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["cc-votes", limit, page, vote, committee_voter, tx],
    queryFn: ({ pageParam = page }) =>
      fetchCCVotes(limit, pageParam, vote, committee_voter, tx),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });
};

export const fetchNewVotes = async (
  limit: number = 10,
  offset: number = 0,
  voter_role?: "SPO" | "DRep" | "ConstitutionalCommittee",
  vote?: "All" | "Yes" | "No" | "Abstain",
  tx?: string,
  gov_action_proposal?: string,
  drep_voter?: string,
  pool_voter?: string,
  committee_voter?: string,
) => {
  const url = "/gov/vote";
  const options = {
    params: {
      limit,
      offset,
      voter_role,
      vote,
      tx,
      gov_action_proposal,
      drep_voter,
      pool_voter,
      committee_voter,
    },
  };
  return handleFetch<any>(url, undefined, options);
};

export const useFetchNewVotes = (
  limit: number,
  page: number,
  voter_role?: "SPO" | "DRep" | "ConstitutionalCommittee",
  vote?: "All" | "Yes" | "No" | "Abstain",
  tx?: string,
  gov_action_proposal?: string,
  drep_voter?: string,
  pool_voter?: string,
  committee_voter?: string,
) =>
  useInfiniteQuery({
    queryKey: [
      "gov-new-vote",
      limit,
      page,
      voter_role,
      vote,
      tx,
      gov_action_proposal,
      drep_voter,
      pool_voter,
      committee_voter,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchNewVotes(
        limit,
        pageParam,
        voter_role,
        vote,
        tx,
        gov_action_proposal,
        drep_voter,
        pool_voter,
        committee_voter,
      ),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });

export const fetchThreshold = async () => {
  const url = "/gov/thresholds";
  const options = {};

  return handleFetch<ThresholdResponse>(url, undefined, options);
};

export const useFetchThreshold = () => {
  return useQuery({
    queryKey: ["threshold"],
    queryFn: () => fetchThreshold(),
  });
};

export const fetchDrepListVote = async (
  limit: number = 10,
  offset: number = 0,
  gov_action: string,
) => {
  const url = "/gov/drep_list_vote";
  const options = {
    params: {
      limit,
      offset,
      gov_action,
    },
  };
  return handleFetch<any>(url, undefined, options);
};

export const useFetchDrepListVote = (
  limit: number,
  page: number,
  gov_action: string,
) =>
  useInfiniteQuery({
    queryKey: ["gov-drep_list_vote", limit, page, gov_action],
    queryFn: ({ pageParam = page }) =>
      fetchDrepListVote(limit, pageParam, gov_action),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });
