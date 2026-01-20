import SortBy from "@/components/ui/sortBy";
import { useFetchTxDetail } from "@/services/tx";
import { useGeekConfigStore } from "@/stores/geekConfigStore";
import { getRouteApi } from "@tanstack/react-router";
import TxContentTable from "../TxContentTable";
import { useState } from "react";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const getSelectItems = (t: (key: string) => string) => [
  {
    key: "value",
    value: t("tx.sortBy.value"),
  },
  {
    key: "index",
    value: t("tx.sortBy.index"),
  },
];

const ContentTabItem = () => {
  const { t } = useAppTranslation("common");
  const { sortUTxOs, setSortUTxOs } = useGeekConfigStore();
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const data = query.data?.data;
  const selectItems = getSelectItems(t);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const inputsCount = data?.all_inputs?.length || 0;
  const outputsCount = data?.all_outputs?.length || 0;
  const showSearch = inputsCount > 5 || outputsCount > 5;

  return (
    <>
      <div className='mb-2 flex w-full items-center gap-2'>
        {showSearch && (
          <TableSearchInput
            placeholder={t("tx.searchInputsOutputs")}
            value={searchQuery}
            onchange={setSearchQuery}
            showSearchIcon
            wrapperClassName='flex-1'
          />
        )}
        <SortBy
          selectItems={selectItems}
          setSelectedItem={setSortUTxOs as any}
          selectedItem={sortUTxOs}
          className='ml-auto w-fit'
        />
      </div>
      <div className='flex w-full flex-col gap-1 md:flex-row'>
        <TxContentTable
          title={t("tx.inputs")}
          data={data}
          sort={sortUTxOs}
          isOutput={false}
          searchQuery={debouncedSearch}
        />
        <TxContentTable
          title={t("tx.outputs")}
          data={data}
          sort={sortUTxOs}
          isOutput={true}
          searchQuery={debouncedSearch}
        />
      </div>
    </>
  );
};

export default ContentTabItem;
