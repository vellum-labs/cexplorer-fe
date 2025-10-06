import ConstLabelBadge from "@/components/global/badges/ConstLabelBadge";
import { JsonDisplay } from "@/components/global/JsonDisplay";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { useFetchTxDetail } from "@/services/tx";
import type { TxMetadata } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";

const MetadataTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const metadata = query?.data?.data?.metadata;
  const metadataArr: TxMetadata[] = [];

  for (const obj in metadata) {
    metadataArr.push({ [obj]: metadata[obj] });
  }
  if (!metadata && !query.isLoading) {
    return <p className='w-full text-center text-sm'>No metadata found</p>;
  }

  if (query.isLoading) {
    return (
      <div className='flex flex-col gap-3'>
        <LoadingSkeleton rounded='xl' height='130px' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {metadataArr.map((item, index) => (
        <section
          key={index}
          className='flex flex-col rounded-xl border border-b border-border bg-darker px-2 py-1.5 shadow'
        >
          <div className='mb-1 flex items-center gap-1'>
            <div className='w-fit rounded-md border border-border bg-background px-1 py-1/2 text-xs font-medium'>
              {Object.values(item)[0].key}
            </div>
            <ConstLabelBadge
              type='metadatum'
              name={Object.values(item)[0].key}
              className='h-7'
            />
          </div>
          <JsonDisplay
            data={Object.values(item)[0]?.md ?? {}}
            isLoading={query.isLoading}
            isError={query.isError}
            search
          />
        </section>
      ))}
    </div>
  );
};

export default MetadataTabItem;
