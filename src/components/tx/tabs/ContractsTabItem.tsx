import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import ConstLabelBadge from "@/components/global/badges/ConstLabelBadge";
import { LabelBadge } from "@/components/global/badges/LabelBadge";
import { PurposeBadge } from "@/components/global/badges/PurposeBadge";
import Copy from "@/components/global/Copy";
import { JsonDisplay } from "@/components/global/JsonDisplay";
import { TextDisplay } from "@/components/global/TextDisplay";
import { useFetchTxDetail } from "@/services/tx";
import { formatNumber } from "@/utils/format/format";
import { Link, getRouteApi } from "@tanstack/react-router";
import LoadingSkeleton from "../../global/skeletons/LoadingSkeleton";

export const ContractsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);

  const totalSize = query.data?.data.plutus_contracts
    ?.reduce((acc, contract) => acc + contract.size / 1024, 0)
    .toFixed(2);

  if (!query.data?.data.plutus_contracts && !query.isLoading) {
    return <p className='w-full text-center text-sm'>No contracts found</p>;
  }

  if (query.isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        <LoadingSkeleton height='28px' width='120px' rounded='full' />
        <LoadingSkeleton rounded='xl' height='380px' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex w-fit gap-2 rounded-full border border-border bg-darker px-3 py-1 text-xs font-medium shadow'>
        Total Script Size {totalSize}kB
      </div>
      {query.data?.data.plutus_contracts?.map((contract, index) => (
        <section
          key={index}
          className='flex flex-col rounded-xl border border-b border-border bg-darker px-4 py-3 shadow'
        >
          <div className='flex flex-wrap items-center gap-2'>
            {contract.label && (
              <LabelBadge variant='lg' label={contract?.label} />
            )}
            <div className='w-fit rounded-md border border-border bg-background px-2 py-1 text-xs font-medium'>
              Script #{index + 1}
            </div>
            <PurposeBadge purpose={contract.input.redeemer.purpose} />
            <span className='flex h-[25px] items-center rounded-full border border-border bg-blue-200/15 px-2 text-xs font-medium'>
              {contract.type.slice(0, 1).toUpperCase() + contract.type.slice(1)}
            </span>
            <span className='flex h-[25px] items-center rounded-full border border-border bg-secondaryBg px-2 text-xs font-medium'>
              Size {(contract.size / 1024).toFixed(2)}kB
            </span>
            <span className='flex h-[25px] items-center rounded-full border border-border bg-secondaryBg px-2 text-xs font-medium'>
              Fee <AdaWithTooltip data={contract.input.redeemer.fee} />
            </span>
          </div>

          <div className='mt-4 flex flex-col gap-2 text-sm'>
            <span>
              Mem: {formatNumber(contract?.input?.redeemer?.unit.mem)}
            </span>
            <span>
              Steps: {formatNumber(contract?.input?.redeemer?.unit.steps)}
            </span>
            <span className='mt-2'>
              Redeemer Data Hash:{" "}
              <span className='flex items-center gap-2'>
                <Link
                  to='/datum'
                  search={{
                    hash: contract.input.redeemer.datum.hash,
                  }}
                  className='block overflow-hidden text-ellipsis text-primary'
                >
                  {contract?.input?.redeemer.datum.hash}
                </Link>
                <Copy copyText={contract?.input?.redeemer.datum.hash} />
              </span>
            </span>
            <JsonDisplay
              isError={query.isError}
              isLoading={query.isLoading}
              data={contract?.input.redeemer.datum.value}
              search
            />
            <span>
              <span className='mt-2 flex items-center gap-1'>
                Script hash:{" "}
                <ConstLabelBadge type='sc' name={contract?.script_hash} />
              </span>
              <span className='flex items-center gap-2'>
                <Link
                  to='/script/$hash'
                  params={{ hash: contract?.script_hash }}
                  className='block overflow-hidden text-ellipsis text-primary'
                >
                  {contract?.script_hash}
                </Link>
                <Copy copyText={contract?.script_hash} />
              </span>
            </span>
            <span className='mt-2'>Bytes:</span>
            <TextDisplay text={contract?.bytecode} />
            {contract.output && (
              <span className='mt-2'>
                Datum hash:{" "}
                <span className='flex items-center gap-2'>
                  <Link
                    to='/datum'
                    search={{
                      hash: contract.output.hash,
                    }}
                    className='mb-2 block overflow-hidden text-ellipsis text-primary'
                  >
                    {contract?.output?.hash}
                  </Link>
                  <Copy copyText={contract?.output?.hash} />
                </span>
                <JsonDisplay
                  isError={query.isError}
                  isLoading={query.isLoading}
                  search
                  data={contract?.output?.value}
                />
              </span>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
