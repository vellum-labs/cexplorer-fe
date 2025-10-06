import SortBy from "@/components/ui/sortBy";
import { useFetchTxDetail } from "@/services/tx";
import { useTxSortStore } from "@/stores/tx/txSortStore";
import { getRouteApi } from "@tanstack/react-router";
import TxContentTable from "../TxContentTable";

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

  return (
    <>
      <SortBy
        selectItems={selectItems}
        setSelectedItem={setSort as any}
        selectedItem={sort}
        className='mb-2 ml-auto w-fit sm:mt-[-62px]'
      />
      <div className='flex w-full flex-col gap-1 md:flex-row'>
        <TxContentTable
          title='Inputs'
          data={data}
          sort={sort as "value" | "index"}
          isOutput={false}
        />
        <TxContentTable
          title='Outputs'
          data={data}
          sort={sort as "value" | "index"}
          isOutput={true}
        />
      </div>
    </>
  );
};

export default ContentTabItem;
