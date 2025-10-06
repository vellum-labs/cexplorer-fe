import { Fragment, type FC } from "react";

import { VoteBadge } from "../../global/badges/VoteBadge";
import type { Vote } from "@/constants/votes";
import { DrepNameCell } from "@/components/drep/DrepNameCell";
import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import { useFetchDrepListVote } from "@/services/governance";
import { Link, useSearch } from "@tanstack/react-router";

import govActions from "../../../../conf/governance-actions.json";
import { NoResultsFound } from "@/components/global/NoResultsFound";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Pagination } from "@/components/global/Pagination";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { useVotingTableStore } from "@/stores/tables/votingTableTableStore";
import { CircleHelp } from "lucide-react";
import { ActivityBadge } from "@/components/global/badges/ActivityBadge";

interface VotingTableProps {}

export const VotingTable: FC<VotingTableProps> = () => {
  const { page } = useSearch({
    from: "/gov/drep-vote",
  });

  const { rows } = useVotingTableStore();

  const query = useFetchDrepListVote(
    rows,
    (page ?? 1) * rows - rows,
    JSON.stringify(govActions),
  );

  function buildDRepVoteArray(response) {
    const govActions = response.data?.pages.flatMap(page => page.data.map);
    const dreps = response.data?.pages.flatMap(page => page.data.data);

    if (!govActions || !dreps) {
      return [];
    }

    const actionMap = Object.fromEntries(govActions.map(a => [a.id, a.name]));
    const actionIds = govActions.map(a => a.id);

    return dreps.map(drep => {
      const name = drep.data?.given_name || "Unknown";
      const votedata = drep.votedata || [];

      const votes = Object.fromEntries(votedata.map(v => [v.ga, v.vote]));

      const result = { DRep: name };
      for (const gaId of actionIds) {
        result[actionMap[gaId]] = votes[gaId] || null;
      }
      return result;
    });
  }

  const staticColumns = [
    {
      key: "drep",
      title: "DRep",
      render: item => {
        return <DrepNameCell item={item} />;
      },
      widthPx: 300,
    },
    {
      key: "voting_power",
      title: "Voting power",
      render: item => {
        if (!item?.amount) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.amount} />
          </p>
        );
      },
      widthPx: 150,
    },
    {
      key: "activity",
      title: "Activity",
      render: item => {
        if (!actions || !Array.isArray(actions))
          return <p className='text-right'>-</p>;

        const total = actions.length;
        let voted = 0;

        for (const action of actions) {
          if (item?.votedata?.some(v => v.ga === action.id)) {
            voted++;
          }
        }

        const percent = (voted / total) * 100;

        return (
          <div className='flex w-full items-center gap-1/2'>
            <ActivityBadge percentage={percent} />
            <Tooltip content={<span>Voting activity across treasury withdrawal proposals</span>}>
              <CircleHelp size={11} />
            </Tooltip>
          </div>
        );
      },
      widthPx: 120,
    },
  ];

  const totalItems = query.data?.pages[0].data.count;
  const items = query.data?.pages.flatMap(page => page.data.data);
  const actions = query.data?.pages.flatMap(page => page.data.map);

  const actionsVotes = buildDRepVoteArray(query as any);

  return (
    <>
      <div className='relative w-full max-w-desktop overflow-x-auto rounded-l border border-border md:overflow-hidden'>
        <div className='inline-flex items-end md:flex'>
          <div
            role='rowgroup'
            className='h-fit w-fit shrink-0 border-r border-border bg-background md:sticky md:left-0 md:top-0'
          >
            <div role='row' className='flex items-center'>
              {staticColumns.map(({ key, title, widthPx }) => (
                <div
                  role='columnheader'
                  key={key}
                  className='relative box-border flex h-[60px] items-center border-b border-border bg-darker py-1 font-semibold text-text first:rounded-tl-xl first:pl-4 last:pr-4'
                  style={{
                    maxWidth: `${widthPx || 200}px`,
                    width: `${widthPx}px`,
                  }}
                >
                  {title}
                </div>
              ))}
            </div>
            <div role='row' className='text-grayTextPrimary'>
              {query.isLoading
                ? Array.from(
                    { length: rows },
                    (_, i) => i + (page ?? 1) * rows - rows,
                  ).map(index => (
                    <div
                      key={`tr${index}`}
                      className={`${index % 2 !== 0 ? "bg-darker" : ""} group flex h-[70px] border-b border-border duration-150 last:border-none`}
                    >
                      {staticColumns.map(({ widthPx }, i) => (
                        <Fragment key={`th${i}`}>
                          <div
                            role='cell'
                            className='flex items-center px-1 py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover'
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                            }}
                          >
                            <LoadingSkeleton height='20px' />
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  ))
                : (items ?? []).map((item, rowIdx) => (
                    <div
                      key={`tr${rowIdx}`}
                      className={`${rowIdx % 2 !== 0 ? "bg-darker" : ""} group flex h-[70px] border-b border-border duration-150 last:border-none`}
                    >
                      {staticColumns.map(({ widthPx, render }, colIdx) => (
                        <Fragment key={`td${colIdx}`}>
                          <div
                            role='cell'
                            className='flex items-center py-2 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover'
                            style={{
                              maxWidth: `${widthPx || 100}px`,
                              width: `${widthPx || 100}px`,
                            }}
                          >
                            {render ? render(item) : null}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
          {query.isLoading ? (
            <LoadingSkeleton height={`${rows * 70 + 70}px`} width='100%' />
          ) : (
            <div
              role='rowgroup'
              className='md:thin-scrollbar h-full w-full snap-x overflow-hidden scroll-smooth border-border md:overflow-x-auto md:[transform:rotateX(180deg)]'
            >
              <div className='md:[transform:rotateX(180deg)]'>
                <div
                  role='row'
                  className={`flex shrink-0 items-center ${(actions || []).length > 4 ? "w-max" : "w-full"}`}
                >
                  {(actions ?? []).map((action, i) => (
                    <div
                      role='columnheader'
                      key={`${action.id}_${i}`}
                      className='relative box-border flex h-[60px] min-w-[200px] flex-1 shrink-0 cursor-pointer snap-start items-center justify-center border-b border-border bg-darker px-1 text-sm text-primary first:pl-4 last:pr-4'
                    >
                      <Tooltip
                        content={<p className='w-[140px]'>{action.name}</p>}
                      >
                        <Link
                          to='/gov/action/$id'
                          params={{
                            id: action.id,
                          }}
                          target='_blank'
                        >
                          <p className='w-[140px]'>
                            {action.name && action.name.length > 30
                              ? `${action.name.slice(0, 30)}...`
                              : action.name}
                          </p>
                        </Link>
                      </Tooltip>
                    </div>
                  ))}
                </div>
                <div
                  role='row'
                  className={`text-grayTextPrimary ${(actions || []).length > 4 ? "w-max" : "w-full"}`}
                >
                  {actionsVotes.map((voteRow, rowIdx) => (
                    <div
                      key={`tr-scroll${rowIdx}`}
                      className={`${rowIdx % 2 !== 0 ? "bg-darker" : ""} group flex h-[70px] shrink-0 border-b border-border duration-150 last:border-none`}
                    >
                      {(actions ?? []).map((action, colIdx) => (
                        <Fragment key={`${voteRow.id ?? rowIdx}_${colIdx}`}>
                          <div
                            role='cell'
                            className='flex w-full min-w-[200px] flex-1 snap-start items-center justify-center py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover'
                          >
                            {voteRow[action.name] ? (
                              <VoteBadge vote={voteRow[action.name] as Vote} />
                            ) : (
                              "-"
                            )}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!query.isLoading && !items?.length && <NoResultsFound />}
      {totalItems > rows && (query as UseInfiniteQueryResult).fetchNextPage && (
        <Pagination
          currentPage={page ?? 1}
          totalPages={Math.ceil(totalItems / rows)}
        />
      )}
    </>
  );
};
