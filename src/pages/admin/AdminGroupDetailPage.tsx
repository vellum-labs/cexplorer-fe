import { DrepHashCell } from "@/components/drep/DrepHashCell";
import { Button } from "@vellumlabs/cexplorer-sdk";
import TextInput from "@/components/global/inputs/TextInput";
import Modal from "@/components/global/Modal";
import SpinningLoader from "@/components/global/SpinningLoader";
import GlobalTable from "@/components/table/GlobalTable";
import PoolCell from "@/components/table/PoolCell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthToken } from "@/hooks/useAuthToken";
import { miscValidate } from "@/services/misc";
import {
  addToGroup,
  removeFromGroup,
  updateAdminGroup,
  useFetchAdminGroupDetail,
} from "@/services/user";
import type { TableColumns } from "@/types/tableTypes";
import type { AdminGroupDetailResponse } from "@/types/userTypes";
import { getRouteApi, Link } from "@tanstack/react-router";
import { PencilIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const AdminGroupDetailPage = () => {
  const [deleteModalData, setDeleteModalData] = useState<{
    type: "pool" | "drep";
    ident: string;
  }>({ type: "pool", ident: "" });
  const [addModalData, setAddModalData] = useState<{
    type: "pool" | "drep";
    ident: string;
  }>({ type: "pool", ident: "" });
  const [updateModalData, setUpdateModalData] = useState<{
    description: string;
  }>({ description: "" });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const route = getRouteApi("/admin/groups/$url");
  const { url } = route.useParams();
  const token = useAuthToken();
  const query = useFetchAdminGroupDetail(url);

  const data = query.data?.data;
  const items = query.data?.data.members ?? [];

  const handleAdd = async () => {
    const res = await miscValidate(addModalData.type, addModalData.ident);
    if (!res.data.valid) {
      toast.error("Invalid ident");
      return;
    }

    addToGroup({
      group: url,
      type: addModalData.type,
      ident: addModalData.ident,
      token,
    }).then(() => {
      toast.success("Added successfully");
      query.refetch();
      setShowAddModal(false);
    });
  };

  const handleDelete = async () => {
    removeFromGroup({
      group: url,
      type: deleteModalData.type,
      ident: deleteModalData.ident,
      token,
    }).then(() => {
      toast.success("Deleted successfully");
      query.refetch();
      setDeleteModalData({ type: "pool", ident: "" });
    });
  };

  const handleUpdate = async () => {
    const res = await updateAdminGroup({
      group: url,
      description: updateModalData.description,
      token,
    });
    if (res.code === 200) {
      toast.success("Updated successfully");
      query.refetch();
      setShowUpdateModal(false);
    } else {
      toast.error("Failed to update");
    }
  };

  const columns: TableColumns<
    AdminGroupDetailResponse["data"]["members"][number]
  > = [
    {
      key: "type",
      title: "Type",
      render: item => <span>{item.type}</span>,
      widthPx: 50,
      visible: true,
    },
    {
      key: "name",
      title: "Name",
      render: item => {
        return item.type === "pool" ? (
          <PoolCell poolInfo={{ id: item.ident, meta: null }} />
        ) : (
          <DrepHashCell view={item.ident} />
        );
      },
      widthPx: 40,
      visible: true,
    },
    {
      key: "remove",
      title: "",
      render: item => {
        return (
          <div className='flex justify-end'>
            <button
              onClick={() => {
                setDeleteModalData({
                  type: item.type,
                  ident: item.ident,
                });
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      },
      widthPx: 10,
      visible: true,
    },
  ];

  return (
    <>
      {showUpdateModal && (
        <Modal
          minWidth='95%'
          maxWidth='350px'
          maxHeight='95%'
          onClose={() => setShowUpdateModal(false)}
        >
          <p className='mb-1 mt-4'>Update this group:</p>
          <textarea
            placeholder='Description'
            className='h-32 w-full rounded-l border border-border bg-background p-1 text-text-sm text-text'
            value={updateModalData.description}
            onChange={e => setUpdateModalData({ description: e.target.value })}
          />
          <div className='flex justify-between'>
            <Button
              label='Cancel'
              variant='tertiary'
              size='md'
              className='mt-3'
              onClick={() => setDeleteModalData({ type: "pool", ident: "" })}
            />
            <Button
              label='Update'
              variant='primary'
              size='md'
              className='ml-auto mt-3'
              onClick={handleUpdate}
            />
          </div>
        </Modal>
      )}
      {deleteModalData.ident && (
        <Modal
          minWidth='95%'
          maxWidth='350px'
          maxHeight='95%'
          onClose={() => setDeleteModalData({ type: "pool", ident: "" })}
        >
          <p className='mt-4'>Are you sure you want to delete this item?</p>
          <div className='flex justify-between'>
            <Button
              label='Cancel'
              variant='tertiary'
              size='md'
              className='mt-3'
              onClick={() => setDeleteModalData({ type: "pool", ident: "" })}
            />
            <Button
              label='Delete'
              variant='red'
              size='md'
              className='ml-auto mt-3'
              onClick={handleDelete}
            />
          </div>
        </Modal>
      )}
      {showAddModal && (
        <Modal
          minWidth='95%'
          maxWidth='400px'
          maxHeight='95%'
          onClose={() => setShowAddModal(false)}
        >
          <RadioGroup
            onValueChange={value => {
              setAddModalData({
                ...addModalData,
                type: value as "pool" | "drep",
              });
            }}
            defaultValue='m'
            className='mb-4 mt-2 flex gap-2'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='drep' id='drep' />
              <Label htmlFor='drep'>dRep</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='pool' id='pool' />
              <Label htmlFor='pool'>Pool</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='asset' id='asset' />
              <Label htmlFor='asset'>Asset</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='collection' id='collection' />
              <Label htmlFor='collection'>Collection</Label>
            </div>
          </RadioGroup>
          <div className=''>
            <TextInput
              placeholder='Group name'
              value={addModalData.ident}
              onchange={value =>
                setAddModalData({ ...addModalData, ident: value })
              }
            />
          </div>
          <Button
            label='Add'
            variant='primary'
            size='md'
            className='ml-auto mt-3'
            onClick={handleAdd}
          />
        </Modal>
      )}
      <main className='flex min-h-minHeight flex-col items-center gap-1 p-mobile md:p-desktop'>
        <div className='flex w-full max-w-desktop flex-col justify-center'>
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
              <BreadcrumbItem className=''>
                <Link
                  className='underline underline-offset-2'
                  to={"/admin/groups"}
                >
                  Admin groups
                </Link>
              </BreadcrumbItem>
              /
              <BreadcrumbItem className='text-text'>
                {data?.name}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className='text-left'>{data?.name}</h2>
          <p className='mb-2 flex items-center gap-1'>
            {data?.description}
            <button
              className=''
              onClick={() => {
                setShowUpdateModal(true);
                setUpdateModalData({ description: data?.description ?? "" });
              }}
            >
              <PencilIcon size={15} />
            </button>
          </p>
          {query.isLoading ? (
            <div className='mt-4 flex w-full justify-center'>
              <SpinningLoader />
            </div>
          ) : !items && !query.isLoading ? (
            <p className='mt-4 flex w-full justify-center'>
              You don't have admin permission.
            </p>
          ) : (
            <>
              <GlobalTable
                type='default'
                pagination
                scrollable
                totalItems={items?.length}
                minContentWidth={600}
                columns={columns}
                items={items}
                query={query}
              />
              <Button
                label='Add'
                variant='primary'
                size='md'
                className='ml-auto mt-2'
                onClick={() => setShowAddModal(true)}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};
