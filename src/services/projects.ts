import type {
  ProjectDetailResponse,
  ProjectListResponse,
} from "@/types/projectTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useQuery } from "@tanstack/react-query";

export const fetchProjectList = async () => {
  const url = "/project/list";
  return handleFetch<ProjectListResponse>(url, undefined, {});
};

export const useFetchProjectList = () =>
  useQuery({
    queryKey: ["project-list"],
    queryFn: () => fetchProjectList(),
    refetchOnWindowFocus: false,
  });

export const fetchProjectDetail = async (id: string) => {
  const url = "/project/detail";
  const options = { params: { id } };
  return handleFetch<ProjectDetailResponse>(url, undefined, options);
};

export const useFetchProjectDetail = (id: string) =>
  useQuery({
    queryKey: ["project-detail", id],
    queryFn: () => fetchProjectDetail(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
