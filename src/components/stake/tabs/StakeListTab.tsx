import type { TableColumns } from "@/types/tableTypes";
import { type FC } from "react";

import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AdaHandleBadge } from "@vellumlabs/cexplorer-sdk";
import { TokenSelectCombobox } from "@/components/asset/TokenSelect";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchAccountList } from "@/services/user";
import type { StakeKeyData } from "@/types/userTypes";
import { configJSON } from "@/constants/conf";
import AddressCell from "@/components/address/AddressCell";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const StakeListTab: FC = () => {
  const { t } = useAppTranslation("common");
  const token = useAuthToken();
  const accountListQuery = useFetchAccountList(token);

  const policyId = configJSON.integration[0].adahandle[0].policy;

  const data = accountListQuery?.data?.data?.data ?? [];

  if (!token) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>{t("stake.list.connectWallet")}</div>
      </div>
    );
  }

  const columns: TableColumns<StakeKeyData> = [
    {
      key: "view",
      render: item => {
        if (!item?.view) {
          return <span className='text-grayTextPrimary'>-</span>;
        }

        return (
          <div className='flex flex-col gap-1/2'>
            <AddressCell address={item.view} />
            {item.adahandle && (
              <AdaHandleBadge
                hex={item.adahandle}
                link
                policyId={policyId}
              />
            )}
          </div>
        );
      },
      title: t("stake.list.table.stakeAddress"),
      visible: true,
      widthPx: 200,
    },
    {
      key: "live_stake",
      render: item => {
        if (!item) return <span className='text-grayTextPrimary'>-</span>;
        return <AdaWithTooltip data={item.stake?.live?.amount ?? 0} />;
      },
      title: t("stake.list.table.liveStake"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "active_stake",
      render: item => {
        if (!item) return <span className='text-grayTextPrimary'>-</span>;
        return <AdaWithTooltip data={item.stake?.active?.amount ?? 0} />;
      },
      title: t("stake.list.table.activeStake"),
      visible: true,
      widthPx: 120,
    },
    {
      key: "accounts",
      render: item => {
        if (!item) return <span className='text-grayTextPrimary'>-</span>;
        return (
          <span className='font-medium'>
            {item.stake?.active?.accounts ?? 0}
          </span>
        );
      },
      title: t("stake.list.table.accounts"),
      visible: true,
      widthPx: 80,
    },
    {
      key: "assets",
      render: item => {
        if (!item) return <span className='text-grayTextPrimary'>-</span>;

        const assets = item.asset ?? [];
        if (assets.length === 0) {
          return <span className='text-grayTextPrimary'>{t("stake.list.table.noAssets")}</span>;
        }

        const transformedAssets = assets.map(asset => ({
          ...asset,
          registry: asset.registry ? { name: asset.registry } : undefined,
        }));

        try {
          return <TokenSelectCombobox items={transformedAssets as any} />;
        } catch (error) {
          return (
            <span className='text-text-sm font-medium'>
              {t("stake.list.table.assetsCount", { count: assets.length })}
            </span>
          );
        }
      },
      title: t("stake.list.table.assets"),
      visible: true,
      widthPx: 110,
    },
  ];

  if (accountListQuery?.isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-grayTextPrimary'>{t("stake.list.loading")}</div>
      </div>
    );
  }

  if (accountListQuery?.isError) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-red-500'>{t("stake.list.error")}</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-end gap-2'>
      <GlobalTable
        type='default'
        query={accountListQuery}
        itemsPerPage={data.length}
        totalItems={data.length}
        rowHeight={65}
        scrollable
        minContentWidth={650}
        items={data}
        columns={columns}
      />
    </div>
  );
};
