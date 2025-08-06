import GlobalTable from "@/components/table/GlobalTable";
import { useFetchCommitteeDetail } from "@/services/governance";
import type { TableColumns } from "@/types/tableTypes";
import { Image } from "@/components/global/Image";
import type { FC } from "react";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { Link } from "@tanstack/react-router";
import Copy from "@/components/global/Copy";
import { alphabetWithNumbers } from "@/constants/alphabet";

export const CCMembersTab: FC = () => {
  const query = useFetchCommitteeDetail();
  const members =
    query.data?.data?.member.filter(
      m => m.expiration_epoch === null || m.expiration_epoch >= 0,
    ) ?? [];

  const indexedMembers = members.map((m, index) => ({
    ...m,
    _rowIndex: index,
  }));
  const columns: TableColumns<any> = [
    {
      key: "index",
      title: "#",
      widthPx: 40,
      visible: true,
      render: item => <span>{item._rowIndex + 1}</span>,
    },
    {
      key: "member",
      title: "CC member",
      widthPx: 200,
      visible: true,
      render: item => {
        const name = item.registry?.name ?? "Unknown";
        const coldKey = item.key?.cold ?? "N/A";

        const fallbackletters = [...name]
          .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
          .join("");

        return (
          <div className='flex items-center gap-3'>
            <div className='min-w-[32px]'>
              <Image
                src={generateImageUrl(coldKey, "ico", "cc")}
                alt='member'
                className='rounded-full'
                width={32}
                height={32}
                fallbackletters={fallbackletters}
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-textPrimary font-medium'>{name}</span>

              {coldKey !== "N/A" ? (
                <div className='flex gap-2'>
                  <Link
                    to='/gov/cc/:coldKey'
                    params={{ coldKey }}
                    className='text-primary'
                  >
                    {formatString(coldKey, "long")}
                  </Link>
                  <Copy copyText={coldKey} />
                </div>
              ) : (
                <span className='break-all text-xs text-grayTextSecondary'>
                  N/A
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "registration",
      title: "Registration",
      widthPx: 250,
      visible: true,
      render: item => {
        const hash = item.registration?.hash ?? "N/A";
        const time = item.registration?.time;

        return (
          <div className='flex flex-col text-sm'>
            {hash !== "N/A" ? (
              <div className='flex gap-2'>
                <Link
                  to='/tx/$hash'
                  params={{
                    hash,
                  }}
                  className='text-primary'
                >
                  {formatString(hash, "long")}
                </Link>
                <Copy copyText={hash} />
              </div>
            ) : (
              <span className='text-grayTextSecondary'>N/A</span>
            )}
            {time && <TimeDateIndicator time={time} />}
          </div>
        );
      },
    },
    {
      key: "expiration_epoch",
      title: "Expiration Epoch",
      widthPx: 120,
      visible: true,
      render: item => {
        const epoch = item.expiration_epoch;

        return epoch !== undefined && epoch !== null ? (
          <Link
            to='/epoch/$no'
            params={{
              no: epoch,
            }}
            className='text-primary'
          >
            {epoch}
          </Link>
        ) : (
          <span>N/A</span>
        );
      },
    },
  ];

  return (
    <GlobalTable
      type='default'
      totalItems={members.length}
      minContentWidth={800}
      query={query}
      items={indexedMembers}
      columns={columns}
    />
  );
};
