import { useAuthToken } from "@/hooks/useAuthToken";
import { handleFetch } from "@/lib/handleFetch";
import type { ArticleUrl } from "@/types/articleTypes";
import type { ResponseCore } from "@/types/commonTypes";
import type {
  AccountListResponse,
  PolicyListResponse,
  AdminArticleCreationResponse,
  AdminArticleDetailResponse,
  AdminArticleListResponse,
  AdminGroupDetailResponse,
  AdminGroupListResponse,
  AdminPageDetailResponse,
  AdminPageListResponse,
  CexplorerNftsResponse,
  GetUserLabelsResponse,
  GroupType,
  PollListResponse,
  SetCexplorerNftsResponse,
  UserApiResponse,
  UserInfoResponse,
  UserLabels,
  UserLoginResponse,
  WatchlistResponse,
} from "@/types/userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Props {
  address: string | undefined;
  uq: string;
  signature: string;
  secure: 0 | 1;
  expiration: string;
  version: number;
  key: string;
}

interface UserUpdate {
  body: {
    public?: number;
    name?: string;
    picture?: string;
    social?: {
      web?: string;
      xcom?: string;
      telegram?: string;
      discord?: string;
      patreon?: string;
      facebook?: string;
      instagram?: string;
      github?: string;
      linkedin?: string;
    };
  };
  token: string;
}

export const loginUser = async ({
  address,
  uq,
  signature,
  secure,
  expiration,
  version,
  key,
}: Props) => {
  if (!address) return;

  const url = "/user/login";

  const options = {
    params: { address, uq, signature, secure, expiration, version, key },
  };

  return handleFetch<UserLoginResponse>(url, undefined, options);
};

export const fetchUserInfo = async ({ token }: { token: string }) => {
  const url = "/user/info";

  const options = {
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<UserInfoResponse>(url, undefined, options);
};

export const useFetchUserInfo = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["user-info", token],
    queryFn: () => fetchUserInfo({ token }),
    enabled: !!token,
    refetchInterval: 120000,
    staleTime: 120000,
  });
};

type UserApiProps = {
  token: string;
  state?: "new" | "enable" | "disable";
  key?: string;
};

export const fetchUserApi = async ({ token, state, key }: UserApiProps) => {
  const url = "/user/api";

  const options = {
    headers: {
      usertoken: token,
    },
    params: { state, key },
  };

  return handleFetch<UserApiResponse>(url, undefined, options);
};

export const useFetchUserApi = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["user-api", token],
    queryFn: () => fetchUserApi({ token }),
    enabled: !!token,
  });
};

export const useMutateUserApi = () => {
  const token = useAuthToken();

  return useMutation({
    mutationFn: (props: Omit<UserApiProps, "token">) =>
      fetchUserApi({ token, ...props }),
  });
};

export const fetchCexplorerNfts = async ({ token }: { token: string }) => {
  const url = "/user/nft";

  const options = {
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<CexplorerNftsResponse>(url, undefined, options);
};

export const useFetchCexplorerNfts = (token: string) => {
  return useQuery({
    queryKey: ["cexplorer-nfts"],
    queryFn: () => fetchCexplorerNfts({ token }),
    refetchInterval: 120000,
    staleTime: 120000,
    enabled: !!token,
  });
};

export const setCexplorerNff = async ({
  token,
  name,
  type,
  ident,
}: {
  token: string;
  name: string;
  type: "pool" | "asset" | "drep" | "collection";
  ident: string;
}) => {
  const url = "/user/nft_set";

  const options = {
    params: { name, type, ident },
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<SetCexplorerNftsResponse>(url, undefined, options);
};

export const fetchAdminPage = async ({
  token,
  type,
  url,
  lang,
  body,
}: {
  token: string;
  type: "list" | "detail" | "update";
  url?: ArticleUrl;
  lang?: string;
  body?: {
    description: string;
    keywords: string;
    data: string;
  };
}) => {
  const apiUrl = "/admin/page";

  const options = {
    method: type === "update" ? "POST" : "GET",
    params: { url, lang, type },
    headers: {
      usertoken: token,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (type === "detail" && url) {
    return handleFetch<AdminPageDetailResponse>(apiUrl, undefined, options);
  }

  return handleFetch<AdminPageListResponse>(apiUrl, undefined, options);
};

export const useFetchAdminPage = ({
  token,
  type,
  url,
  lang,
}: {
  token: string;
  type: "list" | "detail" | "update";
  url?: ArticleUrl;
  lang?: "en";
}) => {
  return useQuery({
    queryKey: ["admin-page", token, type, url, lang],
    queryFn: () => fetchAdminPage({ token, type, url, lang }),
    enabled: !!token,
    staleTime: 120000,
  });
};

export const fetchAdminArticle = async ({
  token,
  type,
  url,
  lang,
  body,
}: {
  token: string;
  type: "list" | "detail" | "update" | "create";
  url?: ArticleUrl;
  lang?: string;
  body?: {
    lng?: string;
    type?: string;
    render?: string;
    name?: string;
    description?: string;
    keywords?: string;
    data?: string;
    category?: string[];
    image?: string;
    pub_date?: string;
  };
}) => {
  const apiUrl = "/admin/article";

  const options = {
    method: type === "update" || type === "create" ? "POST" : "GET",
    params: { url, lang, type },
    headers: {
      usertoken: token,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (type === "create") {
    return handleFetch<AdminArticleCreationResponse>(
      apiUrl,
      undefined,
      options,
    );
  }

  if (type === "detail" && url) {
    return handleFetch<AdminArticleDetailResponse>(apiUrl, undefined, options);
  }

  return handleFetch<AdminArticleListResponse>(apiUrl, undefined, options);
};

export const useFetchAdminArticle = ({
  token,
  type,
  url,
  lang,
}: {
  token: string;
  type: "list" | "detail" | "update" | "create";
  url?: ArticleUrl;
  lang?: "en";
}) => {
  return useQuery({
    queryKey: ["admin-article", token, type, url, lang],
    queryFn: () => fetchAdminArticle({ token, type, url, lang }),
    enabled: !!token,
  });
};

export const fetchWatchlist = async ({
  token,
  add,
  remove,
}: {
  token: string;
  add?: string;
  remove?: string;
}) => {
  const url = "/user/watchlist";

  const options = {
    params: { add, remove },
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<WatchlistResponse>(url, undefined, options);
};

export const fetchAccountList = async ({ token }: { token: string }) => {
  const url = "/account/list";

  const options = {
    params: { watchlist_only: 1 },
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<AccountListResponse>(url, undefined, options);
};

export const useFetchWatchlist = (
  token: string,
  add?: string,
  remove?: string,
) => {
  return useQuery({
    queryKey: ["watchlist", token, add, remove],
    queryFn: () => fetchWatchlist({ token, add, remove }),
    staleTime: 120000,
    enabled: !!token,
  });
};

export const useFetchAccountList = (token: string) => {
  return useQuery({
    queryKey: ["account-list", token],
    queryFn: () => fetchAccountList({ token }),
    staleTime: 120000,
    enabled: !!token,
  });
};

export const fetchPolicyList = async ({ token }: { token: string }) => {
  const url = "/policy/list";

  const options = {
    params: { watchlist_only: 1 },
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<PolicyListResponse>(url, undefined, options);
};

export const useFetchPolicyList = (token: string) => {
  return useQuery({
    queryKey: ["policy-list", token],
    queryFn: () => fetchPolicyList({ token }),
    staleTime: 120000,
    enabled: !!token,
  });
};

export const updateUserProfile = ({ body, token }: UserUpdate) => {
  const apiUrl = "/user/profile";

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  return handleFetch(apiUrl, undefined, options);
};

export const pollVote = async ({
  token,
  poll,
  option,
}: {
  token: string;
  poll: string;
  option: string;
}) => {
  const apiUrl = "/user/gov";

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
    },
    body: JSON.stringify({ poll, option }),
  };

  return handleFetch<PollListResponse>(apiUrl, undefined, options);
};

export const useMutatePollVote = () => {
  const token = useAuthToken();

  return useMutation({
    mutationFn: (props: { poll: string; option: string }) =>
      pollVote({ token, ...props }),
  });
};

export const fetchAdminGroups = async ({ token }: { token: string }) => {
  const url = "/admin/group?type=list";

  const options = {
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<AdminGroupListResponse>(url, undefined, options);
};

export const useFetchAdminGroups = () => {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["admin-groups", token],
    queryFn: () => fetchAdminGroups({ token }),
    staleTime: 120000,
    enabled: !!token,
  });
};

export const fetchAdminGroupDetail = async ({
  token,
  group,
}: {
  token: string;
  group: string;
}) => {
  const url = `/admin/group?type=detail&url=${group}`;

  const options = {
    headers: {
      usertoken: token,
    },
  };

  return handleFetch<AdminGroupDetailResponse>(url, undefined, options);
};

export const useFetchAdminGroupDetail = (group: string) => {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["admin-group-detail", token, group],
    queryFn: () => fetchAdminGroupDetail({ token, group }),
    staleTime: 120000,
    enabled: !!token,
  });
};

export const createAdminGroup = async ({
  token,
  name,
}: {
  token: string;
  name: string;
}) => {
  const url = "/admin/group?type=create";

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
    },
    body: JSON.stringify({ name }),
  };

  return handleFetch<ResponseCore<{ url: string }>>(url, undefined, options);
};

export const updateAdminGroup = async ({
  group,
  token,
  description,
}: {
  group: string;
  token: string;
  description: string;
}) => {
  const url = `/admin/group?type=update&url=${group}`;

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
    },
    body: JSON.stringify({ description, param: [] }),
  };

  return handleFetch<ResponseCore<{ url: string }>>(url, undefined, options);
};

export const addToGroup = async ({
  group,
  type,
  ident,
  token,
}: {
  group: string;
  type: GroupType;
  ident: string;
  token: string;
}) => {
  const url = `/admin/group?type=add&url=${group}`;

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
    },
    body: JSON.stringify({ type, ident }),
  };

  return handleFetch(url, undefined, options);
};

export const removeFromGroup = async ({
  group,
  type,
  ident,
  token,
}: {
  group: string;
  type: GroupType;
  ident: string;
  token: string;
}) => {
  const url = `/admin/group?type=remove&url=${group}`;

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
    },
    body: JSON.stringify({ type, ident }),
  };

  return handleFetch(url, undefined, options);
};

export const getUserLabels = (token: string) => {
  const url = "/user/labels";

  const options = {
    headers: {
      usertoken: token ?? "",
    },
  };

  return handleFetch<GetUserLabelsResponse>(url, undefined, options);
};

export const useUserLabels = (token: string) =>
  useQuery({
    queryKey: ["user-labels", token],
    queryFn: () => getUserLabels(token),
    staleTime: 120000,
    enabled: !!token,
  });

export const updateUserLabels = (
  token: string,
  body?: UserLabels["labels"],
) => {
  const apiUrl = "/user/labels";

  const options = {
    method: "POST",
    headers: {
      usertoken: token,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  return handleFetch(apiUrl, undefined, options);
};
