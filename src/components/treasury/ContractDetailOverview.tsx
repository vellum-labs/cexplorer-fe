import type { FC } from "react";
import type { VendorContractDetail } from "@/services/vendorContracts";
import {
  OverviewCard,
  LoadingSkeleton,
  formatString,
  formatNumber,
  formatDate,
  Copy,
} from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { ContractStatusBadge } from "./ContractStatusBadge";

interface ContractDetailOverviewProps {
  contract: VendorContractDetail | undefined;
  isLoading: boolean;
  labels: {
    details: {
      title: string;
      projectId: string;
      vendor: string;
      contractAddress: string;
      fundingTx: string;
      fundDate: string;
      initialAmount: string;
      status: string;
    };
    description: {
      title: string;
      noDescription: string;
      contractUrl: string;
    };
    statusLabels: {
      completed: string;
      active: string;
      paused: string;
      cancelled: string;
      pending_approval: string;
    };
  };
}

export const ContractDetailOverview: FC<ContractDetailOverviewProps> = ({
  contract,
  isLoading,
  labels,
}) => {
  if (isLoading) {
    return (
      <div className='flex w-full flex-wrap gap-2'>
        <div className='min-h-[200px] flex-1 basis-[400px] rounded-l border border-border bg-cardBg p-2'>
          <LoadingSkeleton height='24px' width='80px' />
          <div className='mt-2 space-y-1'>
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
            <LoadingSkeleton height='20px' width='100%' />
          </div>
        </div>
        <div className='min-h-[200px] flex-1 basis-[400px] rounded-l border border-border bg-cardBg p-2'>
          <LoadingSkeleton height='24px' width='120px' />
          <div className='mt-2'>
            <LoadingSkeleton height='100px' width='100%' />
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  const getVendorDisplay = () => {
    if (contract.vendor_address?.startsWith("addr")) {
      return (
        <div className='flex items-center gap-1/2'>
          <Link
            to='/address/$address'
            params={{ address: contract.vendor_address }}
            className='text-primary'
          >
            {formatString(contract.vendor_address, "long")}
          </Link>
          <Copy copyText={contract.vendor_address} />
        </div>
      );
    }
    if (contract.vendor_address) {
      return <span>{contract.vendor_address}</span>;
    }
    if (contract.vendor_name) {
      return <span>{contract.vendor_name}</span>;
    }
    return <span>-</span>;
  };

  const detailsList = [
    {
      label: labels.details.projectId,
      value: (
        <div className='flex items-center gap-1/2'>
          <span>{contract.project_id}</span>
          <Copy copyText={contract.project_id} />
        </div>
      ),
    },
    {
      label: labels.details.vendor,
      value: getVendorDisplay(),
    },
    {
      label: labels.details.contractAddress,
      value: (
        <div className='flex items-center gap-1/2'>
          <Link
            to='/address/$address'
            params={{ address: contract.contract_address }}
            className='text-primary'
          >
            {formatString(contract.contract_address, "long")}
          </Link>
          <Copy copyText={contract.contract_address} />
        </div>
      ),
    },
    {
      label: labels.details.fundingTx,
      value: (
        <div className='flex items-center gap-1/2'>
          <Link
            to='/tx/$hash'
            params={{ hash: contract.fund_tx_hash }}
            className='text-primary'
          >
            {formatString(contract.fund_tx_hash, "long")}
          </Link>
          <Copy copyText={contract.fund_tx_hash} />
        </div>
      ),
    },
    {
      label: labels.details.fundDate,
      value: contract.fund_time ? formatDate(contract.fund_time * 1000) : "-",
    },
    {
      label: labels.details.initialAmount,
      value: (
        <span className='font-medium'>
          ₳{formatNumber(contract.initial_amount_ada ?? 0)}
        </span>
      ),
    },
    {
      label: labels.details.status,
      value: (
        <ContractStatusBadge
          status={contract.status}
          labels={labels.statusLabels}
        />
      ),
    },
  ];

  return (
    <div className='flex w-full flex-wrap gap-2'>
      <div className='flex-1 basis-[400px]'>
        <OverviewCard
          title={labels.details.title}
          overviewList={detailsList}
          className='h-full'
        />
      </div>

      <div className='flex-1 basis-[400px]'>
        <OverviewCard
          title={labels.description.title}
          className='h-full'
          overviewList={
            contract.contract_url
              ? [
                  {
                    label: labels.description.contractUrl,
                    value: (
                      <a
                        href={contract.contract_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline'
                      >
                        {formatString(contract.contract_url, "long")}
                      </a>
                    ),
                  },
                ]
              : []
          }
          endContent={
            <div className='mt-1 text-text-sm text-grayTextPrimary'>
              {contract.description || labels.description.noDescription}
            </div>
          }
        />
      </div>
    </div>
  );
};
