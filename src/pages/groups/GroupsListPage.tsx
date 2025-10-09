import TableSearchInput from "@/components/global/inputs/SearchInput";
import GlobalTable from "@/components/table/GlobalTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useFetchGroupsList } from "@/services/analytics";
import type { GroupsListData } from "@/types/analyticsTypes";
import type { TableColumns } from "@/types/tableTypes";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

export const GroupsListPage = () => {
  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable();

  const [filteredItems, setFilteredItems] = useState<GroupsListData[]>([]);
  const query = useFetchGroupsList();

  const data = query.data?.data.data ?? [];

  const columns: TableColumns<GroupsListData> = [
    {
      key: "name",
      title: "Name",
      render: item => (
        <Link
          className='text-primary'
          to='/groups/$url'
          params={{ url: item.url }}
        >
          {item.name}
        </Link>
      ),
      widthPx: 30,
      visible: true,
    },
    {
      key: "description",
      title: "Description",
      render: item => item.description,
      widthPx: 180,
      visible: true,
    },
    {
      key: "items",
      title: <span className='flex w-full justify-end'>Items</span>,
      render: item => (
        <span className='flex w-full justify-end'>{item.data?.count}</span>
      ),
      widthPx: 50,
      visible: true,
    },
  ];

  useEffect(() => {
    if (debouncedTableSearch) {
      setFilteredItems(
        data.filter(item =>
          item.name.toLowerCase().includes(debouncedTableSearch.toLowerCase()),
        ),
      );
    } else {
      setFilteredItems(data);
    }
  }, [debouncedTableSearch, data]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {<title>{metadata.groupsList.title}</title>}
        <meta name='description' content={metadata.groupsList.description} />
        <meta name='keywords' content={metadata.groupsList.keywords} />
      </Helmet>
      <main className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center justify-center px-mobile md:px-desktop'>
          <Breadcrumb className='mb-2 w-full'>
            <BreadcrumbList className='flex items-center'>
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to='/'>
                  Home
                </Link>
              </BreadcrumbItem>
              /<BreadcrumbItem className='text-text'>Groups</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className='flex min-h-minHeight w-full flex-col items-center'>
            <TableSearchInput
              placeholder='Search your results...'
              value={tableSearch}
              onchange={setTableSearch}
              wrapperClassName='mb-2 ml-auto md:w-[320px] w-full '
              showSearchIcon
              showPrefixPopup={false}
            />
            <GlobalTable
              type='default'
              scrollable
              totalItems={filteredItems.length}
              columns={columns}
              items={filteredItems}
              query={query}
            />
          </section>
        </div>
      </main>
    </>
  );
};
