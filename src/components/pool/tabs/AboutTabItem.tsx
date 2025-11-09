import { AdaWithTooltip, DateCell } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import {
  useFetchPoolAbout,
  useFetchPoolRetirment,
  useFetchPoolUpdate,
} from "@/services/pools";
import type { PoolDetailResponseData } from "@/types/poolTypes";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock, Download } from "lucide-react";
import { useState, type FC } from "react";
import { HashCell } from "@/components/tx/HashCell";

interface AboutTabItemProps {
  id: string;
  description: string;
  detailData: PoolDetailResponseData;
}

const AboutTabItem: FC<AboutTabItemProps> = ({
  id,
  description,
  detailData,
}) => {
  const [activeUrl, setActiveUrl] = useState<string>("");
  const updateQuery = useFetchPoolUpdate(id);
  const aboutQuery = useFetchPoolAbout(id);
  const retirmentQuery = useFetchPoolRetirment(id);

  const updateItem = (updateQuery.data?.data.data || []).sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  )[0];

  const relayItems = aboutQuery.data?.data?.relay;

  const retirmentItems = retirmentQuery.data?.data?.data;

  const liveStake = detailData?.live_stake ?? 0;
  const pledged = detailData?.pledged ?? 0;

  const ownerColumns = [
    {
      key: "address",
      render: item => {
        if (!item?.account?.owner[0]?.view) {
          return "-";
        }

        const isStake = item.account.owner[0].view.includes("stake");

        return isStake ? (
          <Link
            to='/stake/$stakeAddr'
            params={{ stakeAddr: item.account.owner[0].view }}
            className='text-primary'
          >
            {formatString(item?.account?.owner[0]?.view, "longer")}
          </Link>
        ) : (
          <Link
            to='/address/$address'
            params={{ address: item.account.owner[0].view }}
            className='text-primary'
          >
            {formatString(item?.account?.owner[0]?.view, "longer")}
          </Link>
        );
      },
      title: "Address",
      visible: true,
      widthPx: 40,
    },
    {
      key: "active_stake",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.account.owner[0].active_stake} />
        </p>
      ),
      title: <p className='w-full text-right'>Active Stake</p>,
      visible: true,
      widthPx: 20,
    },
    {
      key: "live_stake",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.account.owner[0].live_stake} />
        </p>
      ),
      title: <p className='w-full text-right'>Live Stake</p>,
      visible: true,
      widthPx: 20,
    },
    {
      key: "relative_pledge",
      render: item => {
        const liveStakeOwn = item?.account?.owner[0].live_stake ?? 0;

        const relativePledge = (pledged / liveStakeOwn) * 100;

        const displayValue =
          relativePledge < 1 && relativePledge > 0
            ? relativePledge.toFixed(4)
            : Math.floor(relativePledge).toString();

        return relativePledge && !isNaN(Number(relativePledge)) ? (
          <div className='flex items-center justify-end'>
            <div className='flex w-2/3 items-center gap-1.5'>
              <div className='relative h-2 w-full overflow-hidden rounded-[4px] bg-[#FEC84B]'>
                <span
                  className='absolute left-0 block h-2 rounded-bl-[4px] rounded-tl-[4px] bg-[#47CD89]'
                  style={{ width: `${Math.min(relativePledge, 100)}%` }}
                />
              </div>
              <span className='self-end text-text-sm text-grayTextPrimary'>
                {displayValue}%
              </span>
            </div>
          </div>
        ) : (
          "-"
        );
      },
      title: <p className='w-full text-right'>Relative Pledge</p>,
      visible: true,
      widthPx: 30,
    },
    {
      key: "pledge_staked",
      render: () => {
        const pledgeStakedRatio = (pledged / liveStake) * 100;

        return pledgeStakedRatio ? (
          <div className='update flex h-full w-full justify-end'>
            <div className='relative h-full w-1/3'>
              <svg viewBox='0 0 36 18'>
                <path
                  d='M2 16a16 14 0 0 1 32 0'
                  fill='none'
                  stroke='#FEC84B'
                  strokeWidth='3'
                  strokeLinecap='round'
                />
                <path
                  d='M2 16a16 14 0 0 1 32 0'
                  fill='none'
                  stroke='#47CD89'
                  strokeWidth='3'
                  strokeDasharray='100'
                  strokeDashoffset={100 - pledgeStakedRatio}
                  strokeLinecap='round'
                />
              </svg>
              <span className='update absolute inset-0 left-1 top-2 flex items-center justify-center text-text-xs text-grayTextPrimary'>
                {!isNaN(pledgeStakedRatio)
                  ? `${pledgeStakedRatio.toFixed(2)}%`
                  : "?"}
              </span>
            </div>
          </div>
        ) : (
          "-"
        );
      },
      title: <p className='w-full text-right'>Pledge / Staked</p>,
      visible: true,
      widthPx: 30,
    },
  ];

  const rewardsColumns = [
    {
      key: "address",
      render: item => {
        if (!item?.account?.reward?.view) {
          return "-";
        }

        return (
          <Link
            to='/stake/$stakeAddr'
            params={{ stakeAddr: item.account.reward.view }}
            className='text-primary'
          >
            {formatString(item.account.reward.view, "longer")}
          </Link>
        );
      },
      title: "Address",
      visible: true,
      widthPx: 110,
    },
    {
      key: "active_stake",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.account.reward.active_stake} />
        </p>
      ),
      title: <p className='w-full text-right'>Active Stake</p>,
      visible: true,
      widthPx: 20,
    },
    {
      key: "live_stake",
      render: item => (
        <p className='text-right'>
          <AdaWithTooltip data={item.account.reward.live_stake} />
        </p>
      ),
      title: <p className='w-full text-right'>Live Stake</p>,
      visible: true,
      widthPx: 20,
    },
  ];

  const relayColumns = [
    {
      key: "address",
      render: item => {
        if (item?.dns_name) {
          return <p>{item.dns_name}</p>;
        }

        if (item?.dns_srv_name) {
          return <p>{item.dns_srv_name}</p>;
        }

        if (item?.ipv4) {
          return <p>{item.ipv4}</p>;
        }
        if (item?.ipv6) {
          return <p>{item.ipv6}</p>;
        }

        return <p>-</p>;
      },
      title: "Address",
      visible: true,
      widthPx: 150,
    },
    {
      key: "port",
      render: item => <p className='text-right'>{item.port}</p>,
      title: <p className='w-full text-right'>Port</p>,
      visible: true,
      widthPx: 150,
    },
  ];

  const certificatesColumns = [
    {
      key: "date",
      render: item => {
        const time = item.time.split(" ")[0];

        return (
          <div className='updateItems-center flex items-center gap-1/2'>
            <Clock size={10} color='grayText' />
            {format(time, "dd.MM.yy")}
          </div>
        );
      },
      title: "Date",
      visible: true,
      widthPx: 20,
    },
    {
      key: "tx",
      render: item => {
        return (
          <Link
            to='/tx/$hash'
            className='text-primary'
            params={{ hash: item.tx_hash }}
          >
            {formatString(item.tx_hash, "short")}
          </Link>
        );
      },
      title: "Tx",
      visible: true,
      widthPx: 40,
    },
    {
      key: "active_in",
      render: item => {
        return <p className='text-right'>{item.active_epoch_no}</p>;
      },
      title: <p className='w-full text-right'>Active in</p>,
      visible: true,
      widthPx: 20,
    },
    {
      key: "rewards_address",
      render: item => {
        if (!item?.account?.reward?.view) {
          return "-";
        }

        return (
          <Link
            className='text-primary'
            to='/stake/$stakeAddr'
            params={{
              stakeAddr: item.account.reward.view,
            }}
          >
            {formatString(item.account.reward.view, "longer")}
          </Link>
        );
      },
      title: <p>Rewards Address</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "owner_address",
      render: item => {
        if (!item?.account?.owner[0]?.view) {
          return "-";
        }

        return (
          <Link
            className='text-primary'
            to='/stake/$stakeAddr'
            params={{
              stakeAddr: item.account.owner[0].view,
            }}
          >
            {formatString(item.account.owner[0].view, "longer")}
          </Link>
        );
      },
      title: <p>Owner Address</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "params",
      render: item => {
        return (
          <div className='flex flex-col'>
            <span>
              Pledge: <AdaWithTooltip data={item.pledge} />
            </span>
            <span>
              Fixed Costs: <AdaWithTooltip data={item.fixed_cost} />
            </span>
            <span>Margin: {(item.margin * 100).toFixed(2)}%</span>
          </div>
        );
      },
      title: <p>Params</p>,
      visible: true,
      widthPx: 50,
    },
    {
      key: "metadata",
      render: item => {
        return (
          <div className='flex flex-col items-end'>
            <Tooltip content={item?.meta?.url}>
              <div
                onClick={() => setActiveUrl(item?.meta?.url)}
                className='flex w-fit cursor-pointer items-center justify-end gap-1/2'
              >
                <Download className='text-primary' size={11} />
                <span className='text-primary'>Download</span>
              </div>
            </Tooltip>
            <div className='flex items-center justify-end gap-1/2'>
              <span>{formatString(item?.meta?.hash, "long")}</span>
              <Copy
                copyText={item?.meta?.hash}
                className='translate-y-[1px]'
                size={11}
              />
            </div>
          </div>
        );
      },
      title: <p className='w-full text-right'>Metadata</p>,
      visible: true,
      widthPx: 50,
    },
  ];

  const retirmentColumns = [
    {
      key: "date",
      render: item => {
        if (!item?.time) {
          return "-";
        }

        return <DateCell time={item.time} />;
      },
      title: "Date",
      visible: true,
      widthPx: 60,
    },
    {
      key: "tx",
      render: item => {
        if (!item?.tx_hash) {
          return "-";
        }

        return <HashCell hash={item.tx_hash} formatType='longer' />;
      },
      title: "Transaction ID",
      visible: true,
      widthPx: 180,
    },
    {
      key: "epoch",
      render: item => {
        if (!item?.retiring_epoch) {
          return "-";
        }

        return (
          <Link
            to='/epoch/$no'
            params={{
              no: item?.retiring_epoch,
            }}
          >
            <p className='w-full text-end'>{item?.retiring_epoch}</p>
          </Link>
        );
      },
      title: <p className='w-full text-end'>Retiring epoch</p>,
      visible: true,
      widthPx: 180,
    },
  ];

  return (
    <>
      {activeUrl && (
        <SafetyLinkModal url={activeUrl} onClose={() => setActiveUrl("")} />
      )}
      <div className='flex flex-col gap-2'>
        {description && (
          <>
            <h3>About Pool</h3>
            <p className='text-text-sm text-grayTextPrimary'>{description}</p>
          </>
        )}
        <div className='flex flex-col gap-2'>
          <h3>Owners (Pledge)</h3>
          <GlobalTable
            type='default'
            pagination={false}
            scrollable
            query={updateQuery}
            items={[updateItem]}
            columns={ownerColumns}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h3>Rewards</h3>
          <GlobalTable
            type='default'
            pagination={false}
            scrollable
            query={updateQuery}
            items={[updateItem]}
            columns={rewardsColumns}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h3>Relays</h3>
          <GlobalTable
            type='default'
            pagination={false}
            scrollable
            query={aboutQuery}
            items={relayItems}
            columns={relayColumns}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h3>Pool Certificates</h3>
          <GlobalTable
            type='default'
            scrollable
            pagination={false}
            minContentWidth={1100}
            query={updateQuery}
            items={[updateItem]}
            columns={certificatesColumns}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h3>Retirement</h3>
          <GlobalTable
            type='default'
            scrollable
            pagination={false}
            minContentWidth={1100}
            query={retirmentQuery}
            items={retirmentItems}
            columns={retirmentColumns}
          />
        </div>
      </div>
    </>
  );
};

export default AboutTabItem;
