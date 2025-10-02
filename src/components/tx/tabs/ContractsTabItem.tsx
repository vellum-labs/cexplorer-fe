import { useFetchTxDetail } from "@/services/tx";
import { getRouteApi } from "@tanstack/react-router";
import LoadingSkeleton from "../../global/skeletons/LoadingSkeleton";
import { ContractInput } from "../ContractInput";

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
          key={`${index}`}
          className='flex flex-col rounded-xl border border-b border-border bg-darker px-4 py-3 shadow'
        >
          <div className='w-fit rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium'>
            Script #{index + 1}
          </div>
          {(contract.input || []).map((input, inputIndex) => (
            <ContractInput
              contract={contract}
              input={input}
              key={inputIndex}
              inputIndex={inputIndex}
              isError={query.isError}
              isLoading={query.isLoading}
            />
          ))}
        </section>
      ))}
    </div>
  );
};
