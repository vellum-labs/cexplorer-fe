import SortBy from "@/components/ui/sortBy";
import { useFetchTxDetail } from "@/services/tx";
import { useTxSortStore } from "@/stores/tx/txSortStore";
import { getRouteApi } from "@tanstack/react-router";
import TxContentTable from "../TxContentTable";
import { useState } from "react";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import TableSearchInput from "@/components/global/inputs/SearchInput";

const selectItems = [
  {
    key: "value",
    value: "Value",
  },
  {
    key: "index",
    value: "Index",
  },
];

const ContentTabItem = () => {
  const { setSort, sort } = useTxSortStore();
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const data = query.data?.data;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const inputsCount = data?.all_inputs?.length || 0;
  const outputsCount = data?.all_outputs?.length || 0;
  const showSearch = inputsCount > 10 || outputsCount > 10;

  return (
    <>
      <div className='mb-2 flex w-full items-center gap-2'>
        {showSearch && (
          <TableSearchInput
            placeholder='Search in inputs/outputs...'
            value={searchQuery}
            onchange={setSearchQuery}
            showSearchIcon
            wrapperClassName='flex-1'
          />
        )}
        <SortBy
          selectItems={selectItems}
          setSelectedItem={setSort as any}
          selectedItem={sort}
          className='ml-auto w-fit'
        />
      </div>
      <div className='flex w-full flex-col gap-1 md:flex-row'>
        <TxContentTable
          title='Inputs'
          data={data}
          sort={sort as "value" | "index"}
          isOutput={false}
          searchQuery={debouncedSearch}
        />
        <TxContentTable
          title='Outputs'
          data={data}
          sort={sort as "value" | "index"}
          isOutput={true}
          searchQuery={debouncedSearch}
        />
      </div>
    </>
  );
};

export default ContentTabItem;
