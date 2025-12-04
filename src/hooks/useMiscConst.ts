import { useFetchMiscConst } from "@/services/misc";

export const useMiscConst = (basicVersion: number | undefined) => {
  const query = useFetchMiscConst(basicVersion);

  return query.data?.data;
};
