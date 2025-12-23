import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useFetchCommitteeDetail } from "@/services/governance";
import type { TableColumns } from "@/types/tableTypes";
import type {
  CommitteeMember,
  CommitteeMemberRegistration,
} from "@/types/governanceTypes";
import { Image } from "@vellumlabs/cexplorer-sdk";
import type { FC } from "react";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import { PulseDot } from "@vellumlabs/cexplorer-sdk";

const getFirstRegistration = (
  reg: CommitteeMemberRegistration | CommitteeMemberRegistration[] | null,
): CommitteeMemberRegistration | null => {
  if (!reg) return null;
  if (Array.isArray(reg)) return reg[0] ?? null;
  return reg;
};

const isActiveMember = (member: CommitteeMember): boolean => {
  const deReg = getFirstRegistration(member.de_registration);
  if (!deReg) {
    return true;
  }
  const deRegistrationDate = new Date(deReg.time);
  return deRegistrationDate > new Date();
};

export const CCMembersTab: FC = () => {
  const query = useFetchCommitteeDetail();
  const members =
    query.data?.data?.member.filter(
      m => m.expiration_epoch === null || m.expiration_epoch >= 0,
    ) ?? [];

  const indexedMembers = members.map((m, index) => ({
    ...m,
    _rowIndex: index,
    _isActive: isActiveMember(m),
  }));
  const columns: TableColumns<
    CommitteeMember & { _rowIndex: number; _isActive: boolean }
  > = [
    {
      key: "index",
      title: "#",
      widthPx: 40,
      visible: true,
      render: item => <span>{item._rowIndex + 1}</span>,
    },
    {
      key: "status",
      title: "Status",
      widthPx: 100,
      visible: true,
      render: item => (
        <div className='relative flex h-[24px] w-fit items-center justify-end gap-1 rounded-m border border-border px-[10px]'>
          <PulseDot color={!item._isActive ? "bg-redText" : undefined} />
          <span className='text-text-xs font-medium'>
            {item._isActive ? "Active" : "Retired"}
          </span>
        </div>
      ),
    },
    {
      key: "member",
      title: "CC member",
      widthPx: 200,
      visible: true,
      render: item => {
        const name = item.registry?.name ?? "Unknown";
        const identCold = item.ident?.cold;
        const identRaw = item.ident?.raw ?? "";

        const displayIdent = identCold || identRaw || "N/A";

        const fallbackletters = [...name]
          .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
          .join("");

        const toPath = identCold ? `/gov/cc/${identCold}` : undefined;

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
              {name &&
                name !== "Unknown" &&
                (toPath ? (
                  <Link to={toPath} className='w-fit text-primary'>
                    {name.length > 50 ? `${name.slice(0, 50)}...` : name}
                  </Link>
                ) : (
                  <span className='w-fit text-text'>
                    {name.length > 50 ? `${name.slice(0, 50)}...` : name}
                  </span>
                ))}
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
                    {formatString(displayIdent, "long")}
                  </Link>
                ) : (
                  <span className='text-text-xs'>
                    {formatString(displayIdent, "long")}
                  </span>
                )}
                <Copy
                  copyText={displayIdent}
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
        const reg = getFirstRegistration(item.registration);
        const hash = reg?.hash ?? "N/A";
        const time = reg?.time;

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
      render: item => (
        <EpochCell no={item.expiration_epoch ?? undefined} justify='start' />
      ),
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
