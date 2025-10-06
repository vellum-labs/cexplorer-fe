import type { TableColumns } from "@/types/tableTypes";
import { type FC } from "react";

import GlobalTable from "@/components/table/GlobalTable";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { formatString, formatNumber } from "@/utils/format/format";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchPolicyList } from "@/services/user";
import type { PolicyData } from "@/types/userTypes";
import Copy from "@/components/global/Copy";
import DateCell from "@/components/table/DateCell";

export const PolicyListTab: FC = () => {
  const token = useAuthToken();
  const policyListQuery = useFetchPolicyList(token);

  const data = policyListQuery?.data?.data?.data ?? [];

  if (!token) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>Please connect your wallet</div>
      </div>
    );
  }

  const columns: TableColumns<PolicyData> = [
    {
      key: "collection",
      render: item => (
        <div className='flex items-center gap-1'>
          <div className='flex flex-col'>
            <span className='font-medium text-primary'>
              {item.collection.name}
            </span>
            <span className='text-xs text-grayTextPrimary'>
              {formatString(item.id, "long")}
            </span>
          </div>
          <Copy copyText={item.id} />
        </div>
      ),
      title: "Collection",
      visible: true,
      widthPx: 200,
    },
    {
      key: "quantity",
      render: item => (
        <span className='font-medium'>
          {formatNumber(item.policy.quantity)}
        </span>
      ),
      title: "Quantity",
      visible: true,
      widthPx: 100,
    },
    {
      key: "owners",
      render: item => (
        <span className='font-medium'>
          {formatNumber(item.collection.stats.owners)}
        </span>
      ),
      title: "Owners",
      visible: true,
      widthPx: 100,
    },
    {
      key: "floor",
      render: item => (
        <AdaWithTooltip data={item.collection.stats.floor} />
      ),
      title: "Floor Price",
      visible: true,
      widthPx: 120,
    },
    {
      key: "volume",
      render: item => (
        <AdaWithTooltip data={item.collection.stats.volume} />
      ),
      title: "Volume",
      visible: true,
      widthPx: 120,
    },
    {
      key: "last_mint",
      render: item => (
        <DateCell time={item.policy.last_mint} />
      ),
      title: "Last Mint",
      visible: true,
      widthPx: 120,
    },
  ];

  if (policyListQuery?.isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>Loading policies...</div>
      </div>
    );
  }

  if (policyListQuery?.isError) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-red-500'>Error loading policies</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-end gap-2'>
      <GlobalTable
        type='default'
        query={policyListQuery}
        itemsPerPage={data.length}
        totalItems={data.length}
        rowHeight={65}
        scrollable
        minContentWidth={820}
        items={data}
        columns={columns}
      />
    </div>
  );
};