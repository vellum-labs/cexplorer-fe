import { useFetchUserInfo, useUserLabels, updateUserLabels } from "@/services/user";
import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useCustomLabelModalState } from "@/stores/states/customLabelModalState";
import { formatString } from "@/utils/format/format";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  Edit,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../global/Button";
import { EmptyState } from "../global/EmptyState";
import ConnectWalletModal from "../wallet/ConnectWalletModal";
import { useAuthToken } from "@/hooks/useAuthToken";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tooltip } from "../ui/tooltip";
import type { AddressLabel } from "@/types/commonTypes";

export const CustomLabels = () => {
  const token = useAuthToken();
  const { data } = useFetchUserInfo();
  const proNfts = data?.data.membership.nfts || 0;
  const userAddress = data?.data.address;
  const { labels, setLabels, updateHistoryLabels, getLabelsForWallet, mergeApiLabels } = useAddressLabelStore();
  const { setIsOpen, setAddressToEdit } = useCustomLabelModalState();
  const [currentPage, setCurrentPage] = useState(1);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const labelsPerPage = 10;
  const totalPages = Math.ceil(labels.length / labelsPerPage);
  const { data: apiLabelsData } = useUserLabels(token || "");

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () =>
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const startIndex = (currentPage - 1) * labelsPerPage;
  const currentLabels = labels.slice(startIndex, startIndex + labelsPerPage);

  const isAddingDisabled =
    (proNfts === 0 && labels.length >= 10) ||
    (proNfts > 0 && labels.length > proNfts * 100);

  const tooltipText =
    proNfts === 0
      ? "You can only add 10 labels with the free version of Cexplorer"
      : "You can only add 100 labels per NFT with the PRO version of Cexplorer";

  const syncWithApi = async (labelsToSync: AddressLabel[]) => {
    if (token && userAddress) {
      try {
        const formattedLabels = labelsToSync.map(l => ({
          ident: l.ident,
          label: l.label
        }));
        await updateUserLabels(token, formattedLabels);
      } catch (error) {
        console.error("Failed to sync with API:", error);
      }
    }
  };

  useEffect(() => {
    if (token && apiLabelsData?.data?.labels) {
      const apiLabels: AddressLabel[] = apiLabelsData.data.labels.map(l => ({
        ident: l.ident || l.address || "",
        label: l.label || ""
      })).filter(l => l.ident && l.label);

      mergeApiLabels(apiLabels, userAddress || null);
      const mergedLabels = getLabelsForWallet(userAddress || null);
      setLabels(mergedLabels);
    } else if (token && userAddress) {
      const walletLabels = getLabelsForWallet(userAddress);
      setLabels(walletLabels);
    } else if (!token) {
      const emptyLabels = getLabelsForWallet(null);
      setLabels(emptyLabels);
    }
  }, [token, userAddress, apiLabelsData, mergeApiLabels, getLabelsForWallet, setLabels]);

  useEffect(() => {
    updateHistoryLabels(token ? userAddress || null : null, labels);
    if (token) {
      syncWithApi(labels);
    }
  }, [labels, token, userAddress, updateHistoryLabels]);

  useEffect(() => {
    const labelChannel = new BroadcastChannel("label_channel");
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "label") {
        setLabels(event.data.labels);
      }
    };

    labelChannel.addEventListener("message", handleMessage);

    return () => {
      labelChannel.removeEventListener("message", handleMessage);
    };
  }, [setLabels]);

  // Show empty state when wallet is not connected
  if (!token) {
    return (
      <>
        {showConnectModal && (
          <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
        )}
        <div className='flex w-full max-w-desktop flex-col'>
          <EmptyState
            icon={<Wallet size={24} />}
            primaryText='Wallet not connected.'
            secondaryText='Connect your wallet to create and manage custom labels for addresses.'
            button={
              <Button
                label='Connect wallet'
                variant='primary'
                size='md'
                onClick={() => setShowConnectModal(true)}
              />
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className='flex w-full max-w-desktop flex-col'>
        <h2>Custom labels</h2>
        <p className='border-b border-border pb-2 text-grayTextPrimary'>
          Easily rename any address with custom text for better tracking and
          organization.
        </p>

        <div className='mb-1 mt-3 flex w-full items-center justify-between gap-1 text-text-sm'>
          <span className='flex items-center gap-1/2'>
            <ChevronsUp size={25} /> Unlock up to 5000 labels with{" "}
            <Link
              to={
                "/profile?tab=pro" as FileRoutesByPath[keyof FileRoutesByPath]["path"]
              }
              className='gold-shimmer bg-purpleText bg-clip-text font-bold text-transparent underline hover:text-transparent'
            >
              Cexplorer PRO
            </Link>
          </span>
          <Tooltip
            content={<div className='w-[150px]'>{tooltipText}</div>}
            hide={!isAddingDisabled}
          >
            <Button
              label='Add label'
              onClick={() => setIsOpen(true)}
              variant='primary'
              size='xs'
              disabled={isAddingDisabled}
              className='w-fit min-w-fit whitespace-nowrap'
            />
          </Tooltip>
        </div>
        <section
          className={`thin-scrollbar relative w-full max-w-desktop overflow-x-auto rounded-l border border-border xl:overflow-visible [&>div]:w-full`}
          style={{
            transform: "rotateX(180deg)",
          }}
        >
          <Table
            style={{
              transform: "rotateX(180deg)",
              minWidth: "450px",
            }}
            className='thin-scrollbar'
          >
            <TableHeader
              className={`relative top-0 z-10 ${labels.length === 0 ? "border-none" : ""}`}
            >
              <tr className={labels.length ? "border-border" : "border-none"}>
                <TableHead>Address</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className='text-right text-text-xs leading-[13px]'>
                  {labels.length}/{proNfts === 0 ? 10 : proNfts * 100} labels
                  created
                </TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {currentLabels.map(({ ident: address, label }, index) => (
                <TableRow
                  key={index}
                  className={`${index % 2 !== 0 ? "bg-darker" : ""} group duration-150`}
                >
                  <TableCell
                    className={`${index === currentLabels.length - 1 ? "rounded-bl-l" : ""} table-cell w-[35%] min-w-[230px] py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover`}
                  >
                    <Link
                      to={
                        address.includes("stake")
                          ? "/stake/$stakeAddr"
                          : "/address/$address"
                      }
                      params={{ address: address }}
                      className={`block w-fit overflow-hidden overflow-ellipsis whitespace-nowrap text-text-sm text-primary`}
                    >
                      {formatString(address, "longer")}
                    </Link>
                  </TableCell>
                  <TableCell
                    className={`table-cell py-1 text-left duration-200 first:pl-4 last:pr-4 group-hover:bg-tableHover`}
                  >
                    {label}
                  </TableCell>
                  <TableCell
                    className={`${index === currentLabels.length - 1 ? "rounded-br-l" : ""} flex items-center justify-end gap-1 duration-200 group-hover:bg-tableHover`}
                  >
                    <button
                      onClick={() => {
                        setAddressToEdit(address);
                        setIsOpen(true);
                      }}
                    >
                      <Edit size={15} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <div className='ml-auto mt-4 flex h-7 items-center gap-2 text-text-xs [&>button]:h-full'>
          <button
            className='rounded-m border border-border px-1 py-1/2 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className='rounded-m border border-border px-1 py-1/2 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='rounded-m border border-border px-1 py-1/2 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={15} />
          </button>
          <button
            className='rounded-m border border-border px-1 py-1/2 disabled:cursor-not-allowed disabled:opacity-60'
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
};
