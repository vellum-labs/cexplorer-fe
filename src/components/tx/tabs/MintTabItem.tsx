import AssetCell from "@/components/asset/AssetCell";
import { useFetchTxDetail } from "@/services/tx";
import { formatDate, formatNumber, formatString } from "@/utils/format/format";
import { Link, getRouteApi } from "@tanstack/react-router";
import Copy from "../../global/Copy";
import { DateCell, getNodeText } from "@vellumlabs/cexplorer-sdk";
import GlobalTable from "../../table/GlobalTable";

const MintTabItem = () => {
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);

  const columns = [
    {
      key: "date",
      render: () => (
        <p
          title={getNodeText(
            formatDate(
              query.data?.data.block.time
                ? query.data?.data.block.time
                : undefined,
            ),
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
              className='mr-1 block overflow-hidden text-ellipsis text-primary'
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
            className='mr-1 block overflow-hidden text-ellipsis text-primary'
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
    {
      key: "quantity",
      render: item => {
        if (!item?.quantity) {
          return <p className='w-full text-right'>-</p>;
        }

        return (
          <p className='w-full text-right'>{formatNumber(item.quantity)}</p>
        );
      },
      title: <p className='w-full text-right'>Quantity</p>,
      visible: true,
      widthPx: 40,
    },
  ];

  if (!query.data?.data.mints && !query.isLoading) {
    return <div className='text-center text-text-sm'>No mints found</div>;
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
