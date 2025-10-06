import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type RealPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage?: never;
};

type FakePaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: RealPaginationProps | FakePaginationProps) => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const [pageJumpValue, setPageJumpValue] = useState("");

  useEffect(() => {
    setPageJumpValue(String(currentPage));
  }, [currentPage]);

  const handlePrevClick = () => {
    if (setCurrentPage === undefined) {
      navigate({
        search: { ...search, page: currentPage - 1 },
      } as any);
      return;
    }
    setCurrentPage(prev => prev - 1);
  };

  const handleNextClick = () => {
    if (setCurrentPage === undefined) {
      navigate({
        search: { ...search, page: currentPage + 1 },
      } as any);
      return;
    }
    setCurrentPage(prev => prev + 1);
  };

  const handlePageClick = (page: number) => {
    if (setCurrentPage === undefined) {
      navigate({
        search: { ...search, page },
      } as any);
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className='flex w-full flex-col items-center gap-5'>
      <PaginationComponent className='mt-2'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={handlePrevClick}
            />
          </PaginationItem>
          {currentPage !== 1 ? (
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === 1}
                onClick={() => handlePageClick(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PageJump
              setCurrentPage={setCurrentPage}
              pageJumpValue={pageJumpValue}
              setPageJumpValue={setPageJumpValue}
              totalPages={totalPages}
            />
          )}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {currentPage > 1 && currentPage < totalPages && (
            <PageJump
              setCurrentPage={setCurrentPage}
              pageJumpValue={pageJumpValue}
              setPageJumpValue={setPageJumpValue}
              totalPages={totalPages}
            />
          )}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {totalPages > 1 && (
            <>
              {currentPage === totalPages ? (
                <PageJump
                  setCurrentPage={setCurrentPage}
                  pageJumpValue={pageJumpValue}
                  setPageJumpValue={setPageJumpValue}
                  totalPages={totalPages}
                />
              ) : (
                <PaginationItem className=''>
                  <PaginationLink
                    isActive={currentPage === totalPages}
                    onClick={() => handlePageClick(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={currentPage >= totalPages}
              onClick={handleNextClick}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};

const PageJump = ({
  setCurrentPage,
  pageJumpValue,
  setPageJumpValue,
  totalPages,
}) => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const handlePageJump = (value: string) => {
    if (isNaN(Number(value))) {
      return;
    }
    if (Number(value) > totalPages) {
      setPageJumpValue(String(totalPages));
      return;
    } else if (value && Number(value) < 1) {
      setPageJumpValue("1");
      return;
    }

    setPageJumpValue(value);
  };

  const handleChange = (value: string) => {
    if (setCurrentPage) {
      setCurrentPage(Number(value));
      return;
    }

    navigate({
      search: { ...search, page: Number(value) },
    } as any);
  };

  return (
    <div className='flex items-center gap-2 text-sm'>
      {/* <span>Jump to:</span>{" "} */}
      <input
        className='h-8 w-16 rounded-lg border border-border bg-background p-1/2 text-center text-text'
        value={pageJumpValue}
        onChange={e => handlePageJump(e.target.value)}
        onBlur={e => handleChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleChange(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
};
