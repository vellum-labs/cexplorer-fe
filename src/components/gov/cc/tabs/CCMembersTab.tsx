import GlobalTable from "@/components/table/GlobalTable";
import { useFetchCommitteeDetail } from "@/services/governance";
import type { TableColumns } from "@/types/tableTypes";
import type { CommitteeMember } from "@/types/governanceTypes";
import { Image } from "@/components/global/Image";
import type { FC } from "react";
import { formatString } from "@/utils/format/format";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { TimeDateIndicator } from "@/components/global/TimeDateIndicator";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
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
  const columns: TableColumns<CommitteeMember & { _rowIndex: number }> = [
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
        const identRaw = item.ident?.raw ?? "N/A";

        const fallbackletters = [...name]
          .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
          .join("");

        const toPath = identRaw !== "N/A" ? `/gov/cc/${identRaw}` : undefined;

        return (
          <div className='relative flex max-h-[75px] w-full items-center gap-1'>
            <Image
              src={generateImageUrl(identRaw, "ico", "cc")}
              type='user'
              className='h-8 w-8 rounded-max'
              height={32}
              width={32}
              fallbackletters={fallbackletters}
            />
            <div className='flex w-[calc(100%-40px)] flex-col text-text-sm'>
              {name && name !== "Unknown" && toPath && (
                <Link to={toPath} className='w-fit text-primary'>
                  {name.length > 50 ? `${name.slice(0, 50)}...` : name}
                </Link>
              )}
              <div className='flex items-center gap-1/2'>
                {toPath ? (
                  <Link
                    to={toPath}
                    className={
                      name && name !== "Unknown"
                        ? "text-text-xs hover:text-grayTextPrimary"
                        : "text-text-sm text-primary"
                    }
                    disabled={!!(name && name !== "Unknown")}
                  >
                    {formatString(identRaw, "long")}
                  </Link>
                ) : (
                  <span>{formatString(identRaw, "long")}</span>
                )}
                <Copy
                  copyText={identRaw}
                  size={name && name !== "Unknown" ? 10 : 13}
                />
              </div>
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
          <div className='flex flex-col text-text-sm'>
            {hash !== "N/A" ? (
              <div className='flex gap-1'>
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
              no: String(epoch),
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
