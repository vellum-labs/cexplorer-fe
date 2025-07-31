import { useFetchMiscConst } from "@/services/misc";
import { useConstStore } from "@/stores/constStore";

export const useMiscConst = (basicVersion: number | undefined) => {
  const { constData } = useConstStore();

  const query = useFetchMiscConst(basicVersion);

  if (query.isSuccess) {
    return query.data?.data;
  }

  return constData;
};
