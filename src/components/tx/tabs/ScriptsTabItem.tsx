import { JsonDisplay } from "@/components/global/JsonDisplay";
import { TextDisplay } from "@/components/global/TextDisplay";
import { ScriptCell } from "@/components/script/ScriptCell";
import { useFetchTxDetail } from "@/services/tx";
import { getRouteApi, Link } from "@tanstack/react-router";
import LoadingSkeleton from "../../global/skeletons/LoadingSkeleton";
import Copy from "@/components/global/Copy";

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
      <div className='flex flex-col gap-3'>
        <LoadingSkeleton height='28px' width='120px' rounded='full' />
        <LoadingSkeleton rounded='xl' height='380px' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex w-fit gap-2 rounded-full border border-border bg-darker px-1.5 py-1/2 text-xs font-medium shadow'>
        Total Script Size {totalSize}kB
      </div>
      {query.data?.data.all_outputs
        ?.filter(output => output.reference_script)
        .map((output, index) => (
          <section
            key={index}
            className='flex flex-col rounded-xl border border-b border-border bg-darker px-2 py-1.5 shadow'
          >
            <div className='flex flex-wrap items-center gap-2'>
              <div className='w-fit rounded-md border border-border bg-background px-1 py-1/2 text-xs font-medium'>
                Script #{index + 1}
              </div>
              {output.reference_script?.type && (
                <span className='flex h-[25px] items-center rounded-full border border-border bg-blue-200/15 px-1 text-xs font-medium'>
                  {output.reference_script?.type.slice(0, 1).toUpperCase() +
                    output.reference_script?.type.slice(1)}
                </span>
              )}
              {output.reference_script?.size && (
                <span className='flex h-[25px] items-center rounded-full border border-border bg-secondaryBg px-1 text-xs font-medium'>
                  Size {(output.reference_script?.size / 1024).toFixed(2)}kB
                </span>
              )}
            </div>

            <div className='mt-4 flex flex-col gap-2 text-sm'>
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
                <span className='mt-2'>
                  Redeemer Data Hash:{" "}
                  <span className='flex items-center gap-2'>
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
                  <p className='mt-2'>Bytes:</p>
                  <TextDisplay text={output.reference_script?.bytes} />
                </>
              )}
            </div>
          </section>
        ))}
    </div>
  );
};
