import AssetCell from "@/components/asset/AssetCell";
import { useFetchTxDetail } from "@/services/tx";
import { formatDate, formatString } from "@/utils/format/format";
import { Link, getRouteApi } from "@tanstack/react-router";
import Copy from "../../global/Copy";
import DateCell from "../../table/DateCell";
import GlobalTable from "../../table/GlobalTable";

const MintTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  // const mints = query.data?.data?.mints[0].p;

  const columns = [
    {
      key: "date",
      render: () => (
        <p
          title={formatDate(
            query.data?.data.block.time
              ? new Date(query.data?.data.block.time)
              : undefined,
          )}
          className=''
        >
          <DateCell time={query.data?.data.block.time || ""} />
        </p>
      ),
      title: "Date",
      visible: true,
      widthPx: 45,
    },
    {
      key: "asset",
      render: item => <AssetCell asset={item} />,
      title: "Asset",
      visible: true,
      widthPx: 80,
    },
    {
      key: "policy_id",
      render: item => {
        return (
          <div className='flex items-center'>
            <Link
              className='mr-2 block overflow-hidden text-ellipsis text-primary'
              to='/policy/$policyId'
              params={{
                policyId: item.name.slice(0, 56),
              }}
            >
              {formatString(item.name.slice(0, 56), "long")}
            </Link>
            <Copy copyText={item.name.slice(0, 56)} />
          </div>
        );
      },
      title: "Policy ID",
      visible: true,
      widthPx: 80,
    },
    {
      key: "tx_hash",
      render: () => (
        <div className='flex items-center'>
          <Link
            to='/tx/$hash'
            params={{ hash: query.data?.data.hash || "" }}
            className='mr-2 block overflow-hidden text-ellipsis text-primary'
          >
            {formatString(query.data?.data.hash ?? "", "long")}
          </Link>
          <Copy copyText={query.data?.data.hash || ""} />
        </div>
      ),
      title: "Tx Hash",
      visible: true,
      widthPx: 80,
    },
  ];

  if (!query.data?.data.mints && !query.isLoading) {
    return <div className='text-center text-sm'>No mints found</div>;
  }

  return (
    <div>
      <GlobalTable
        type='default'
        items={query.data?.data.mints}
        columns={columns}
        query={query}
        scrollable
        itemsPerPage={20}
        minContentWidth={700}
        disableDrag
      />
    </div>
  );
};

export default MintTabItem;
