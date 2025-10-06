import { useEffect, useState, type FC } from "react";

import { Calendar } from "lucide-react";

import { useFetchGlobalPoolAwards } from "@/services/pools";

import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image0 from "@/resources/images/awards/0.svg";
import Image1 from "@/resources/images/awards/1.svg";
import Image10 from "@/resources/images/awards/10.svg";
import Image11 from "@/resources/images/awards/11.svg";
import Image12 from "@/resources/images/awards/12.svg";
import Image13 from "@/resources/images/awards/13.svg";
import Image14 from "@/resources/images/awards/14.svg";
import Image15 from "@/resources/images/awards/15.svg";
import Image16 from "@/resources/images/awards/16.svg";
import Image17 from "@/resources/images/awards/17.svg";
import Image18 from "@/resources/images/awards/18.svg";
import Image19 from "@/resources/images/awards/19.svg";
import Image2 from "@/resources/images/awards/2.svg";
import Image20 from "@/resources/images/awards/20.svg";
import Image21 from "@/resources/images/awards/21.svg";
import Image22 from "@/resources/images/awards/22.svg";
import Image23 from "@/resources/images/awards/23.svg";
import Image24 from "@/resources/images/awards/24.svg";
import Image25 from "@/resources/images/awards/25.svg";
import Image26 from "@/resources/images/awards/26.svg";
import Image27 from "@/resources/images/awards/27.svg";
import Image28 from "@/resources/images/awards/28.svg";
import Image29 from "@/resources/images/awards/29.svg";
import Image3 from "@/resources/images/awards/3.svg";
import Image30 from "@/resources/images/awards/30.svg";
import Image31 from "@/resources/images/awards/31.svg";
import Image32 from "@/resources/images/awards/32.svg";
import Image33 from "@/resources/images/awards/33.svg";
import Image34 from "@/resources/images/awards/34.svg";
import Image35 from "@/resources/images/awards/35.svg";
import Image36 from "@/resources/images/awards/36.svg";
import Image37 from "@/resources/images/awards/37.svg";
import Image38 from "@/resources/images/awards/38.svg";
import Image39 from "@/resources/images/awards/39.svg";
import Image4 from "@/resources/images/awards/4.svg";
import Image40 from "@/resources/images/awards/40.svg";
import Image41 from "@/resources/images/awards/41.svg";
import Image42 from "@/resources/images/awards/42.svg";
import Image43 from "@/resources/images/awards/43.svg";
import Image5 from "@/resources/images/awards/5.svg";
import Image6 from "@/resources/images/awards/6.svg";
import Image7 from "@/resources/images/awards/7.svg";
import Image8 from "@/resources/images/awards/8.svg";
import Image9 from "@/resources/images/awards/9.svg";
import { formatNumber, formatString } from "@/utils/format/format";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { PageBase } from "@/components/global/pages/PageBase";

export const PoolAwardsPage: FC = () => {
  const { page } = useSearch({ from: "/pool-awards/" });

  const poolAwardsQuery = useFetchGlobalPoolAwards(20, (page ?? 1) * 20 - 20);

  const { data, isLoading, isError } = poolAwardsQuery;
  const navigate = useNavigate();

  const awards = data?.pages.flatMap(page => page.data.data);
  const totalPools = poolAwardsQuery.data?.pages[0].data.count;

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil((totalPools ?? 0) / 20),
  );

  useEffect(() => {
    setTotalPages(Math.ceil((totalPools ?? 0) / 20));
  }, [awards]);

  const imageMap = {
    block_no_1: Image0,
    block_no_10: Image1,
    block_no_100: Image2,
    block_no_1000: Image3,
    block_no_10000: Image4,
    block_no_100000: Image5,
    pool_created: Image6,
    anniversary_year_1: Image7,
    anniversary_year_2: Image8,
    anniversary_year_3: Image9,
    anniversary_year_4: Image10,
    anniversary_year_5: Image11,
    anniversary_year_6: Image12,
    anniversary_year_7: Image13,
    anniversary_year_8: Image14,
    anniversary_year_9: Image15,
    anniversary_year_10: Image16,
    stake_1m: Image17,
    stake_3m: Image18,
    stake_5m: Image19,
    stake_10m: Image20,
    stake_20m: Image21,
    stake_30m: Image22,
    stake_40m: Image23,
    stake_50m: Image24,
    stake_60m: Image25,
    stake_70m: Image26,
    stake_80m: Image27,
    stake_90m: Image28,
    stake_100m: Image29,
    delegator_10: Image30,
    delegator_50: Image31,
    delegator_100: Image32,
    delegator_200: Image33,
    delegator_300: Image34,
    delegator_500: Image35,
    delegator_1000: Image36,
    delegator_2000: Image37,
    delegator_3000: Image38,
    delegator_5000: Image39,
    delegator_10000: Image40,
    delegator_20000: Image41,
    delegator_30000: Image42,
    delegator_40000: Image43,
  };

  const renderDetails = item => {
    switch (item.category) {
      case "block":
        return (
          <>
            <div className='flex w-full flex-col'>
              <span>Hash: </span>
              {formatString(item.detail.hash, "short")}
            </div>
            <div className='flex flex-col'>
              <span>Height:</span>
              <Link
                className='text-primary'
                to='/block/$hash'
                params={{
                  hash: item.detail.hash,
                }}
              >
                {item.detail.height}
              </Link>
            </div>
          </>
        );
      case "pool":
        return (
          <>
            <div className='flex w-full flex-col'>
              <span>Hash: </span>
              <span>{formatString(item.detail.hash, "short")}</span>
            </div>
            <div className='flex flex-col'>
              <span>Height:</span>
              <Link
                className='text-primary'
                to='/block/$hash'
                params={{
                  hash: item.detail.hash,
                }}
              >
                {item.detail.height}
              </Link>
            </div>
          </>
        );
      case "anniversary":
        return null;
      case "stake":
      case "delegator":
        return (
          <>
            <div className='flex w-full flex-col'>
              <span>Epoch: </span>
              {item.detail.epoch_no}
            </div>
            <div className='flex min-w-fit flex-col'>
              <span>Stake:</span>
              <AdaWithTooltip data={item.detail.epoch_stake} />
            </div>
            <div className='flex flex-col'>
              <span>Delegators:</span> {item.detail.delegator}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageBase
      metadataTitle='poolAwards'
      title='Pool Awards'
      breadcrumbItems={[{ label: "Pool Awards" }]}
    >
      <section className='flex w-full max-w-desktop flex-col gap-3 px-mobile pb-3 md:px-desktop'>
        <div className='flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap'>
          {isLoading || poolAwardsQuery.isFetching ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (totalPools ?? 0) > 0 ? (
            <h3 className='basis-[230px] text-nowrap'>
              Total of {formatNumber(totalPools ?? 0)} awards
            </h3>
          ) : (
            ""
          )}
        </div>
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-3'>
          {isLoading || isError
            ? Array.from({ length: 8 }, () => "skeleton").map((_, i) => (
                <div
                  key={i}
                  className='flex w-[240px] flex-col gap-1 rounded-lg border border-border'
                >
                  <LoadingSkeleton width='100%' height='280px' />
                </div>
              ))
            : awards?.map((item, i) => (
                <div
                  key={`${item.time}_${i}`}
                  className='flex flex-col gap-1 rounded-lg border border-border bg-cardBg px-1.5 py-1'
                >
                  <img
                    src={imageMap[`${item.category}_${item.type}`]}
                    alt='Pool Created'
                  />
                  <h3 className='text-center'>
                    {item.category.replace("_", " ").slice(0, 1).toUpperCase() +
                      item.category.replace("_", " ").slice(1)}{" "}
                    {String(item.type)
                      .replace("_", " ")
                      .slice(0, 1)
                      .toUpperCase() +
                      String(item.type).replace("_", " ").slice(1)}
                  </h3>
                  <div className='mb-1/2 flex items-center justify-center gap-2'>
                    <Calendar size={12} className='text-grayTextPrimary' />
                    <span className='text-sm text-grayTextPrimary'>
                      {format(new Date(item.time), "dd.MM.yyyy")}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm text-grayTextPrimary [&>div]:w-1/3'>
                    {renderDetails(item)}
                  </div>
                </div>
              ))}
        </div>
      </section>
      <Pagination className='my-2'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={(page ?? 1) === 1}
              onClick={() =>
                navigate({
                  search: { page: (page ?? 1) - 1 } as any,
                })
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              isActive={(page ?? 1) === 1}
              onClick={() => navigate({ search: { page: 1 } } as any)}
            >
              1
            </PaginationLink>
          </PaginationItem>
          {(page ?? 1) > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {(page ?? 1) > 1 && (page ?? 1) < totalPages && (
            <PaginationItem>
              <PaginationLink
                isActive
                onClick={() =>
                  navigate({
                    // search: { offset: ((page ?? 1) - 1) * itemsPerPage },
                    search: { page: page ?? 1 } as any,
                  })
                }
              >
                {page ?? 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {(page ?? 1) < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {totalPages > 1 && (
            <PaginationItem className=''>
              <PaginationLink
                isActive={(page ?? 1) === totalPages}
                onClick={() =>
                  navigate({
                    search: { page: totalPages } as any,
                  })
                }
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={(page ?? 1) >= totalPages}
              onClick={() =>
                navigate({
                  search: {
                    page: (page ?? 1) + 1,
                  } as any,
                })
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </PageBase>
  );
};
