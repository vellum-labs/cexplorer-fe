import type { FC } from "react";
import { Loading } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetail } from "@/services/tx";
import { useGeekConfigStore } from "@/stores/geekConfigStore";
import TxContentTable from "./TxContentTable";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const TxExpandedContent: FC<{ hash: string }> = ({ hash }) => {
  const { t } = useAppTranslation("common");
  const query = useFetchTxDetail(hash);
  const data = query.data?.data;
  const { sortUTxOs } = useGeekConfigStore();

  if (query.isLoading) return <Loading />;

  return (
    <div className='p-3'>
      <div className='flex w-full flex-col gap-1 md:flex-row'>
        <TxContentTable
          title={t("tx.inputs")}
          data={data}
          sort={sortUTxOs}
          isOutput={false}
        />
        <TxContentTable
          title={t("tx.outputs")}
          data={data}
          sort={sortUTxOs}
          isOutput={true}
        />
      </div>
    </div>
  );
};
