import { JsonDisplay } from "@/components/global/JsonDisplay";
import { TextDisplay } from "@vellumlabs/cexplorer-sdk";
import { ScriptCell } from "@/components/script/ScriptCell";
import { useFetchTxDetail } from "@/services/tx";
import { getRouteApi, Link } from "@tanstack/react-router";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";

export const ScriptsTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);

  const totalSize = query.data?.data.all_outputs
    ?.reduce(
      (acc, output) => acc + (output?.reference_script?.size || 0) / 1024,
      0,
    )
    .toFixed(2);

  if (query.isLoading) {
    return (
      <div className='flex flex-col gap-1.5'>
        <LoadingSkeleton height='28px' width='120px' rounded='full' />
        <LoadingSkeleton rounded='xl' height='380px' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex w-fit gap-1 rounded-max border border-border bg-darker px-1.5 py-1/2 text-text-xs font-medium shadow-md'>
        Total Script Size {totalSize}kB
      </div>
      {query.data?.data.all_outputs
        ?.filter(output => output.reference_script)
        .map((output, index) => (
          <section
            key={index}
            className='flex flex-col rounded-l border border-b border-border bg-darker px-2 py-1.5 shadow-md'
          >
            <div className='flex flex-wrap items-center gap-1'>
              <div className='w-fit rounded-s border border-border bg-background px-1 py-1/2 text-text-xs font-medium'>
                Script #{index + 1}
              </div>
              {output.reference_script?.type && (
                <span className='bg-blue-200/15 flex h-[25px] items-center rounded-max border border-border px-1 text-text-xs font-medium'>
                  {output.reference_script?.type.slice(0, 1).toUpperCase() +
                    output.reference_script?.type.slice(1)}
                </span>
              )}
              {output.reference_script?.size && (
                <span className='flex h-[25px] items-center rounded-max border border-border bg-secondaryBg px-1 text-text-xs font-medium'>
                  Size {(output.reference_script?.size / 1024).toFixed(2)}kB
                </span>
              )}
            </div>

            <div className='mt-2 flex flex-col gap-1 text-text-sm'>
              <span className=''>
                Script Hash:{" "}
                <ScriptCell hash={output.reference_script?.hash || ""} />
              </span>
              {output.reference_script?.value && (
                <JsonDisplay
                  isError={query.isError}
                  isLoading={query.isLoading}
                  data={output.reference_script.value}
                  search
                />
              )}
              {output?.datum_hash && (
                <span className='mt-1'>
                  Redeemer Data Hash:{" "}
                  <span className='flex items-center gap-1'>
                    <Link
                      to='/datum'
                      search={{
                        hash: output?.datum_hash ?? "",
                      }}
                      className='block overflow-hidden text-ellipsis text-primary'
                    >
                      {output?.datum_hash}
                    </Link>
                    <Copy copyText={output?.datum_hash} />
                  </span>
                </span>
              )}
              {output.reference_script?.bytes && (
                <>
                  <p className='mt-1'>Bytes:</p>
                  <TextDisplay text={output.reference_script?.bytes} />
                </>
              )}
            </div>
          </section>
        ))}
    </div>
  );
};
