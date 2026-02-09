import type { TableColumns } from "@/types/tableTypes";
import { type FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { formatString, formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchPolicyList } from "@/services/user";
import type { PolicyData } from "@/types/userTypes";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PolicyListTab: FC = () => {
  const { t } = useAppTranslation("common");
  const token = useAuthToken();
  const policyListQuery = useFetchPolicyList(token);

  const data = policyListQuery?.data?.data?.data ?? [];

  if (!token) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>
          {t("policy.pleaseConnectWallet")}
        </div>
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
            <span className='text-text-xs text-grayTextPrimary'>
              {formatString(item.id, "long")}
            </span>
          </div>
          <Copy copyText={item.id} />
        </div>
      ),
      title: t("policy.collection"),
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
      title: t("policy.quantity"),
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
      title: t("policy.owners"),
      visible: true,
      widthPx: 100,
    },
    {
      key: "floor",
      render: item => <AdaWithTooltip data={item.collection.stats.floor} />,
      title: t("policy.floorPrice"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "volume",
      render: item => <AdaWithTooltip data={item.collection.stats.volume} />,
      title: t("policy.volume"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "last_mint",
      render: item => <DateCell time={item.policy.last_mint} />,
      title: t("policy.lastMint"),
      visible: true,
      widthPx: 120,
    },
  ];

  if (policyListQuery?.isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>
          {t("policy.loadingPolicies")}
        </div>
      </div>
    );
  }

  if (policyListQuery?.isError) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-red-500'>{t("policy.errorLoadingPolicies")}</div>
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
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("table.noItems")}
      />
    </div>
  );
};
