import Button from "@/components/global/Button";
import TextInput from "@/components/global/inputs/TextInput";
import Modal from "@/components/global/Modal";
import SpinningLoader from "@/components/global/SpinningLoader";
import GlobalTable from "@/components/table/GlobalTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useAuthToken } from "@/hooks/useAuthToken";
import { createAdminGroup, useFetchAdminGroups } from "@/services/user";
import type { TableColumns } from "@/types/tableTypes";
import type { AdminGroupListResponse } from "@/types/userTypes";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const AdminGroupsPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>("");
  const token = useAuthToken();

  const query = useFetchAdminGroups();

  const data = query.data?.data.data ?? [];

  const handleCreate = async () => {
    createAdminGroup({ token, name }).then(data => {
      query.refetch();
      setShowModal(false);
      navigate({
        to: `/admin/groups/${data.data.url}`,
      });
    });
  };

  const columns: TableColumns<AdminGroupListResponse["data"]["data"][number]> =
    [
      {
        key: "name",
        title: "Name",
        render: item => (
          <Link
            className='text-primary'
            to='/admin/groups/$url'
            params={{ url: item.url }}
          >
            {item.name}
          </Link>
        ),
        widthPx: 100,
        visible: true,
      },
      {
        key: "description",
        title: "Description",
        render: item => item.description,
        widthPx: 100,
        visible: true,
      },
      {
        key: "items",
        title: <span className='flex justify-end'>Items</span>,
        render: item => (
          <span className='flex justify-end'>{item.members}</span>
        ),
        widthPx: 40,
        visible: true,
      },
    ];

  return (
    <>
      {showModal && (
        <Modal
          minWidth='95%'
          maxWidth='400px'
          maxHeight='95%'
          onClose={() => setShowModal(false)}
        >
          <div className='mt-4'>
            <TextInput
              placeholder='Group name'
              value={name}
              onchange={value => setName(value)}
            />
          </div>
          <Button
            label='Create'
            variant='primary'
            size='md'
            className='ml-auto mt-3'
            onClick={handleCreate}
          />
        </Modal>
      )}
      <main className='flex min-h-minHeight flex-col items-center gap-2 p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col items-center justify-center'>
          <Breadcrumb className='mb-2 w-full'>
            <BreadcrumbList className='flex items-center'>
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to='/'>
                  Home
                </Link>
              </BreadcrumbItem>
              /
              <BreadcrumbItem>
                <Link className='underline underline-offset-2' to={"/admin"}>
                  Admin
                </Link>
              </BreadcrumbItem>
              /
              <BreadcrumbItem className='text-text'>
                Admin groups
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {query.isLoading ? (
            <div className='mt-4 flex w-full justify-center'>
              <SpinningLoader />
            </div>
          ) : !data && !query.isLoading ? (
            <p className='mt-4 flex w-full justify-center'>
              You don't have admin permission.
            </p>
          ) : (
            <>
              <GlobalTable
                type='default'
                scrollable
                totalItems={data?.length}
                columns={columns}
                items={data}
                query={query}
              />
              <Button
                label='Create'
                variant='primary'
                size='md'
                className='mt-4'
                onClick={() => setShowModal(true)}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};
