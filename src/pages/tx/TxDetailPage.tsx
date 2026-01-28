import { Badge } from "@vellumlabs/cexplorer-sdk";
import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import CollateralTabItem from "@/components/tx/tabs/CollateralTabItem";
import ContentTabItem from "@/components/tx/tabs/ContentTabItem";
import { ContractsTabItem } from "@/components/tx/tabs/ContractsTabItem";
import DelegationsTabItem from "@/components/tx/tabs/DelegationsTabItem";
import { GovernanceTabItem } from "@/components/tx/tabs/GovernanceTabItem";
import MetadataTabItem from "@/components/tx/tabs/MetadataTabItem";
import MintTabItem from "@/components/tx/tabs/MintTabItem";
import { OverviewTabItem } from "@/components/tx/tabs/OverviewTabItem";
import ReferenceInputsTabItem from "@/components/tx/tabs/ReferenceInputsTabItem";
import { ScriptsTabItem } from "@/components/tx/tabs/ScriptsTabItem";
import WithdrawalsTabItem from "@/components/tx/tabs/WithdrawalsTabItem";
import TxDetailOverview from "@/components/tx/TxDetailOverview";
import { useFetchTxDetail } from "@/services/tx";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { getRouteApi, useSearch } from "@tanstack/react-router";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { Fragment, useEffect, useState } from "react";
import { getAddonsForMetadata } from "@/utils/addons/getAddonsForMetadata";
import { PageBase } from "@/components/global/pages/PageBase";
import { LabelBadge } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const TxDetailPage = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const { t } = useAppTranslation("pages");

  const { page } = useSearch({
    from: "/tx/$hash",
  });

  const query = useFetchTxDetail(hash);
  const data = query.data?.data;

  const contractMap = new Map();
  data?.plutus_contracts?.forEach(contract => {
    const scriptHash = contract.label?.data?.scriptHash;
    if (!contractMap.has(scriptHash)) {
      contractMap.set(scriptHash, contract);
    }
  });

  const uniqueContracts = Array.from(contractMap.values());

  const [addonComponents, setAddonComponents] = useState<any[]>([]);

  const txTabItems = [
    {
      key: "content",
      label: t("transactions.tabs.content"),
      content: <ContentTabItem />,
      visible: true,
    },
    {
      key: "overview",
      label: t("transactions.tabs.overview"),
      content: <OverviewTabItem query={query} />,
      visible: true,
    },
    {
      key: "scripts",
      label: t("transactions.tabs.scripts"),
      content: <ScriptsTabItem />,
      visible: !!data?.all_outputs?.some(output => output.reference_script),
    },
    {
      key: "contracts",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.contracts")}{" "}
          <Badge small color='gray'>
            {data?.plutus_contracts?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.contracts"),
      content: <ContractsTabItem />,
      visible: !!data?.plutus_contracts?.length,
    },
    {
      key: "collateral",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.collateral")}
          <Badge small color='gray'>
            {data?.collateral_inputs?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.collateral"),
      content: <CollateralTabItem />,
      visible: !!data?.collateral_inputs?.length,
    },
    {
      key: "metadata",
      label: t("transactions.tabs.metadata"),
      content: <MetadataTabItem />,
      visible: !!data?.metadata?.length,
    },
    {
      key: "mint",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.mints")}
          <Badge small color='gray'>
            {data?.mints?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.mints"),
      content: <MintTabItem />,
      visible: !!data?.mints?.length,
    },
    {
      key: "withdrawals",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.withdrawals")}
          <Badge small color='gray'>
            {data?.all_withdrawals?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.withdrawals"),
      content: <WithdrawalsTabItem />,
      visible: !!data?.all_withdrawals?.length,
    },
    {
      key: "inputs",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.referenceInputs")}
          <Badge small color='gray'>
            {data?.reference_inputs?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.referenceInputs"),
      content: <ReferenceInputsTabItem />,
      visible: !!data?.reference_inputs?.length,
    },
    {
      key: "delegations",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.delegations")}
          <Badge small color='gray'>
            {data?.delegation?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.delegations"),
      content: <DelegationsTabItem />,
      visible: !!data?.delegation?.length,
    },
    {
      key: "governance",
      label: (
        <span className='flex items-center gap-1'>
          {t("transactions.tabs.governance")}
          <Badge small color='gray'>
            {data?.governance?.voting_procedure?.length}
          </Badge>
        </span>
      ),
      title: t("transactions.tabs.governance"),
      content: <GovernanceTabItem />,
      visible: !!data?.governance?.voting_procedure?.length,
    },
    {
      key: "trading",
      label: t("transactions.tabs.trading"),
      content: () => (
        <DeFiOrderList
          storeKey='tx_detail_page_defi_order'
          tx={data?.hash}
          page={page}
          tabName='trading'
        />
      ),
      visible:
        !!data?.defi && Array.isArray(data?.defi) && data?.defi.length > 0,
    },
    {
      key: "view",
      label: t("transactions.tabs.message"),
      content:
        addonComponents.length > 0 &&
        addonComponents.map(item => item.component),
      visible: addonComponents.some(item => item.component !== null),
    },
  ];

  useEffect(() => {
    if (!data?.metadata) return;

    getAddonsForMetadata(data?.metadata as any, "full-view").then(results => {
      setAddonComponents(results);
    });
  }, [data?.metadata]);

  return (
    <PageBase
      metadataTitle='transactionDetail'
      metadataReplace={{
        before: "%tx%",
        after: hash,
      }}
      breadcrumbItems={[
        {
          label: (
            <span className='inline pt-1/2'>
              {t("epochs.title")}{" "}
              {data?.epoch_param?.epoch_no &&
                `(${data?.epoch_param?.epoch_no})`}
            </span>
          ),
          ...(data?.epoch_param?.epoch_no
            ? {
                link: "/epoch/$no",
                params: {
                  no: String(data?.epoch_param?.epoch_no) || "",
                },
              }
            : {}),
        },
        {
          label: (
            <span className='inline pt-1/2'>
              {t("blocks.title")}{" "}
              {data?.block?.no && `(${formatNumber(data?.block?.no)})`}
            </span>
          ),
          ...(data?.block?.hash
            ? {
                link: "/block/$hash",
                params: {
                  hash: String(data?.block?.hash) || "",
                },
              }
            : {}),
        },
        {
          label: <span className=''>{formatString(hash ?? "", "long")}</span>,
          ident: hash,
        },
      ]}
      title={t("transactions.detail")}
      subTitle={
        <HeaderBannerSubtitle
          hashString={formatString(hash ?? "", "long")}
          hash={hash}
        />
      }
      adsCarousel={false}
      homepageAd
    >
      <div className='flex h-full w-full max-w-desktop flex-col gap-3 px-mobile py-1 lg:flex-row lg:px-desktop'>
        {uniqueContracts &&
          uniqueContracts.map((contract, index) => (
            <Fragment key={index}>
              {contract?.label && (
                <LabelBadge label={contract?.label} variant='lg' />
              )}
            </Fragment>
          ))}
      </div>
      <TxDetailOverview query={query} />
      {!query.isLoading && <Tabs items={txTabItems} mobileItemsCount={3} />}
    </PageBase>
  );
};

export default TxDetailPage;
