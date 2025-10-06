import type { FC } from "react";

import LoadingSkeleton from "../global/skeletons/LoadingSkeleton";

import { useFetchPolicyDetail, useFetchPolicyOwner } from "@/services/policy";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";
import { usePolicyDetailOwnerTableStore } from "@/stores/tables/policyDetailOwnersTableStore";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { policyDetailOwnerOptions } from "@/constants/tables/policyDetailOwnerTableOptions";
import type { PolicyDetailOwnerTableColumns } from "@/types/tableTypes";
import { formatNumber } from "@/utils/format/format";
import AddressCell from "../address/AddressCell";
import TableSettingsDropdown from "../global/dropdowns/TableSettingsDropdown";
import ExportButton from "../table/ExportButton";
import GlobalTable from "../table/GlobalTable";

interface PolicyDetailTopWalletsProps {
  policyId: string;
}

export const PolicyDetailTopWallets: FC<PolicyDetailTopWalletsProps> = ({
  policyId,
}) => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/policy/$policyId" });
  const policyDetailQuery = useFetchPolicyDetail(policyId);
  const mintc = policyDetailQuery.data?.data?.policy?.quantity ?? 0;

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsOrder,
    columnsVisibility,
    rows,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = usePolicyDetailOwnerTableStore();

  const ownerQuery = useFetchPolicyOwner(
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    rows,
    policyId,
  );

  const totalOwners = ownerQuery.data?.pages[0].data.count;
  const items = ownerQuery.data?.pages.flatMap(page => page.data.data);

  const columns = [
    {
      key: "order",
      render: () => {},
      title: "#",
      standByRanking: true,
      visible: columnsVisibility.order,
      widthPx: 5,
    },
    {
      key: "address",
      render: item => {
        if (!item.address) {
          return "-";
        }

        return <AddressCell address={item.address} />;
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 60,
    },
    {
      key: "quantity",
      render: item => {
        if (!item.total_quantity) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='w-full text-right'>
            {formatNumber(item.total_quantity)}
          </p>
        );
      },
      title: <p className='w-full text-right'>Quantity</p>,
      visible: columnsVisibility.quantity,
      widthPx: 15,
    },
    {
      key: "share",
      title: <p className='w-full text-right'>Share</p>,
      render: item => (
        <p className='w-full text-right'>
          {((item.total_quantity / mintc) * 100).toFixed(2)}%
        </p>
      ),
      visible: columnsVisibility.share,
      widthPx: 15,
    },
  ];

  useEffect(() => {
    if (totalOwners && totalOwners !== totalItems) {
      setTotalItems(totalOwners);
    }
  }, [totalOwners, totalItems]);

  return (
    <>
      <div className='mb-2 flex w-full flex-row items-center justify-between gap-1'>
        <div className='py-1'>
          {ownerQuery.isLoading || ownerQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : totalItems > 0 ? (
            <h3 className='basis-[230px] text-nowrap'>
              Total of {formatNumber(totalItems)} owners
            </h3>
          ) : (
            ""
          )}
        </div>
        <div className='flex gap-1'>
          <div className='flex items-center gap-1'>
            <ExportButton
              columns={columns}
              items={items}
              currentPage={page ?? 1}
            />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={policyDetailOwnerOptions.map(item => {
                return {
                  label: item.name,
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={ownerQuery}
        items={items}
        minContentWidth={600}
        columns={
          columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(
                a.key as keyof PolicyDetailOwnerTableColumns,
              ) -
              columnsOrder.indexOf(b.key as keyof PolicyDetailOwnerTableColumns)
            );
          }) as any
        }
        onOrderChange={setColumsOrder}
      />
    </>
  );
};
