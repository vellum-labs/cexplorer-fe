import AssetCell from "@/components/asset/AssetCell";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { EmptyState } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { WatchlistStar } from "@/components/global/watchlist/WatchlistStar";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import ConnectWalletModal from "@/components/wallet/ConnectWalletModal";
import {
  fetchWatchlist,
  setCexplorerNff,
  useFetchCexplorerNfts,
} from "@/services/user";
import { useAuthTokensStore } from "@/stores/authTokensStore";
import { useCexplorerNftsTableStore } from "@/stores/tables/cexplorerNftsTableStore";
import { useWalletStore } from "@/stores/walletStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import type { CexplorerNftsColumns, TableColumns } from "@/types/tableTypes";
import type { CexplorerNftsData } from "@/types/userTypes";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { convertUtcToLocal } from "@/utils/convertUtcToLocal";
import { formatString, formatTimeIn } from "@vellumlabs/cexplorer-sdk";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Star, X, Zap, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProBadge } from "@vellumlabs/cexplorer-sdk";
import { useSearchTable } from "@/hooks/tables/useSearchTable";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ProfilePro = () => {
  const { t } = useAppTranslation("common");
  const { address } = useWalletStore();
  const { tokens } = useAuthTokensStore();
  const { columnsVisibility, columnsOrder, setColumsOrder } =
    useCexplorerNftsTableStore();

  const [totalItems, setTotalItems] = useState(0);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [clickedIdent, setClickedIdent] = useState("");
  const { watchlist, setWatchlist } = useWatchlistStore();
  const token = tokens[address || ""]?.token;
  const query = useFetchCexplorerNfts(token);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [modalData, setModalData] = useState<{
    name: string;
    type: "pool" | "asset" | "drep" | "collection" | "";
    ident: string;
    error: string;
  }>({
    name: "",
    type: "",
    ident: "",
    error: "",
  });
  const totalCount = query.data?.data?.count;
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();

  const [
    { debouncedTableSearch: debouncedSearch, tableSearch: nftSearch },
    setNftSearch,
  ] = useSearchTable();

  const items = query.data?.data.data
    .flatMap(item => item)
    .filter(item => checkNftName(item.name));

  const typeColor = {
    pool: "blue",
    asset: "purple",
    drep: "yellow",
  };
  const isLaterThanDay = (
    date: string,
  ): {
    isLaterThanDay: boolean;
    remainingTime: string;
  } => {
    const [datePart, timePart] = date.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    const specifiedDate = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds,
    );

    const compareDate = new Date(specifiedDate);
    compareDate.setDate(specifiedDate.getDate() + 1);

    const now = new Date();

    return {
      isLaterThanDay: now > compareDate,
      remainingTime: formatTimeIn(convertUtcToLocal(compareDate.toString())),
    };
  };

  function checkNftName(name: string) {
    return (
      name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      getAssetFingerprint(name)
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );
  }

  const checkIdent = () => {
    let error = "";
    if (modalData.type === "pool" && !modalData.ident.startsWith("pool1")) {
      error = t("profile.pro.invalidPoolId");
    } else if (
      modalData.type === "asset" &&
      !modalData.ident.startsWith("asset1")
    ) {
      error = t("profile.pro.invalidAssetFingerprint");
    } else if (
      modalData.type === "drep" &&
      !modalData.ident.startsWith("drep1")
    ) {
      error = t("profile.pro.invalidDrepId");
    }
    return error;
  };

  const handleOpenModify = (item: CexplorerNftsData) => {
    setOpenModifyModal(true);
    setModalData({
      ...modalData,
      name: item.name,
      ident: item.ident,
      type: item.type as "pool" | "asset" | "drep",
    });
  };

  const handleModify = async () => {
    if (!modalData.type || !modalData.ident) return;

    setModalData({ ...modalData, error: "" });

    const error = checkIdent();

    if (error) {
      setModalData({ ...modalData, error });
      return;
    }

    try {
      const res = await setCexplorerNff({
        token,
        ident: modalData.ident,
        name: modalData.name.slice(56),
        type: modalData.type,
      });

      if (typeof res.data === "number") {
        throw new Error("Failed to modify NFT");
      }

      if (typeof res.data === "string" && res.data === "invalid_ident") {
        setModalData({ ...modalData, error: t("profile.pro.invalidIdent") });
        throw new Error("Invalid ident");
      }

      toast.success(t("profile.pro.nftModifiedSuccess"), {
        action: {
          label: <X size={15} className='stroke-text' />,
          onClick: () => undefined,
        },
      });
      query.refetch();
      setOpenModifyModal(false);
    } catch (e) {
      toast.error(t("profile.pro.nftModifiedFailed"), {
        action: {
          label: <X size={15} className='stroke-text' />,
          onClick: () => undefined,
        },
      });
    }
  };

  const handleUnlike = async () => {
    if (!token) return;

    setShowRemoveModal(false);

    const data = await fetchWatchlist({
      token,
      remove: clickedIdent,
    });

    setWatchlist(data?.data?.data);
  };

  const handleStarClick = async (ident: string) => {
    const isLiked = !!watchlist?.some(item => item.ident === ident);
    setClickedIdent(ident);
    if (isLiked) {
      setShowRemoveModal(true);
    } else {
      const data = await fetchWatchlist({
        token,
        add: ident,
      });
      setWatchlist(data?.data?.data);
    }
  };

  const columns: TableColumns<CexplorerNftsData> = [
    {
      key: "star",
      render: item => {
        return (
          <WatchlistStar
            onClick={() => handleStarClick(getAssetFingerprint(item.name))}
            listView
            ident={getAssetFingerprint(item.name)}
          />
        );
      },
      title: <Star size={18} />,
      visible: columnsVisibility.star,
      widthPx: 30,
    },
    {
      key: "index",
      render: () => {
        return <></>;
      },
      title: <p>#</p>,
      standByRanking: true,
      visible: columnsVisibility.index,
      widthPx: 30,
    },
    {
      key: "nft",
      render: item => <AssetCell isNft name={item.name} />,
      title: t("profile.pro.nft"),
      visible: columnsVisibility.nft,
      widthPx: 125,
    },
    {
      key: "type",
      render: item => (
        <>
          {item.type && (
            <Badge rounded color={typeColor[item.type]}>
              {item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}
            </Badge>
          )}
        </>
      ),
      title: <p className=''>{t("profile.pro.type")}</p>,
      visible: columnsVisibility.type,
      widthPx: 30,
    },
    {
      key: "power",
      render: item => (
        <div title={item.ident}>{formatString(item.ident, "longer")}</div>
      ),
      title: <p className=''>{t("profile.pro.delegatedSuperpowers")}</p>,
      visible: columnsVisibility.power,
      widthPx: 80,
    },
    {
      key: "modify",
      render: item => {
        return (
          <div className='flex justify-end'>
            <Tooltip
              hide={isLaterThanDay(item.modified_power_date).isLaterThanDay}
              content={
                <div className='w-[200px]'>
                  {t("profile.pro.modifyTooltip", { time: isLaterThanDay(item.modified_power_date).remainingTime })}
                </div>
              }
            >
              <Button
                label={t("profile.pro.modify")}
                variant='primary'
                size='md'
                onClick={() => handleOpenModify(item)}
                disabled={
                  !isLaterThanDay(item.modified_power_date).isLaterThanDay
                }
              />
            </Tooltip>
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("profile.pro.modify")}</p>,
      visible: columnsVisibility.modify,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (totalCount !== undefined && totalCount !== totalItems) {
      setTotalItems(totalCount);
    }
  }, [totalCount, totalItems]);

  useEffect(() => {
    if (debouncedSearch) {
      navigate({
        search: {
          ...search,
          page: 1,
        } as any,
      });
    }
  }, [debouncedSearch, search, navigate]);

  if (!address)
    return (
      <>
        {showConnectModal && (
          <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
        )}
        <div className='flex min-h-minHeight w-full flex-col'>
          <EmptyState
            icon={<Wallet size={24} />}
            primaryText={t("profile.walletNotConnected")}
            secondaryText={t("profile.pro.connectToAccess")}
            button={
              <Button
                label={t("profile.connectWallet")}
                variant='primary'
                size='md'
                onClick={() => setShowConnectModal(true)}
              />
            }
          />
        </div>
      </>
    );

  return (
    <>
      {showRemoveModal && (
        <Modal onClose={() => setShowRemoveModal(false)}>
          <p className='mt-4 text-text-sm'>
            {t("profile.pro.removeFromWatchlist")}
          </p>
          <div className='mt-3 flex w-full justify-between'>
            <Button
              onClick={() => setShowRemoveModal(false)}
              className='mr-1'
              variant='secondary'
              label={t("profile.cancel")}
              size='md'
            />
            <Button
              onClick={handleUnlike}
              className='mr-1'
              variant='primary'
              label={t("profile.pro.remove")}
              size='md'
            />
          </div>
        </Modal>
      )}
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
      {openModifyModal && (
        <Modal
          minHeight='300px'
          minWidth='400px'
          maxWidth='95%'
          onClose={() => {
            setOpenModifyModal(false);
            setModalData({
              name: "",
              type: "",
              ident: "",
              error: "",
            });
          }}
        >
          <p className='mb-3 pr-4'>{t("profile.pro.fillFields")}</p>
          <RadioGroup
            onValueChange={value => {
              setModalData({
                ...modalData,
                type: value as "pool" | "asset" | "drep",
              });
            }}
            defaultValue='m'
            className='mb-4 mt-2 flex gap-2'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='drep' id='drep' />
              <Label htmlFor='drep'>{t("profile.pro.drep")}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='pool' id='pool' />
              <Label htmlFor='pool'>{t("profile.pro.pool")}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='asset' id='asset' />
              <Label htmlFor='asset'>{t("profile.pro.asset")}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='collection' id='collection' />
              <Label htmlFor='collection'>{t("profile.pro.collection")}</Label>
            </div>
          </RadioGroup>
          <TextInput
            placeholder={
              modalData.type !== "collection"
                ? modalData.type + "1..."
                : t("profile.pro.policyId")
            }
            value={modalData.ident}
            onchange={value => setModalData({ ...modalData, ident: value })}
          />
          <p className='mt-1/2 h-4 text-text-xs font-medium text-red-500'>
            {modalData.error && modalData.error}
          </p>
          <div className='mt-2 flex w-full items-center justify-center'>
            <Button
              label={t("profile.pro.modify")}
              variant='primary'
              size='md'
              onClick={handleModify}
              disabled={!modalData.type || !modalData.ident}
            />
          </div>
        </Modal>
      )}
      <div className='flex min-h-minHeight w-full flex-col'>
        <div className='flex w-full flex-wrap justify-between gap-1'>
          <div className='flex flex-col'>
            <h2>{t("profile.pro.promotion")}</h2>
            <p className='text-grayTextPrimary'>
              {t("profile.pro.promotionDescription")}
            </p>
            <p className='mb-1 mt-1/2 text-grayTextPrimary'>
              {t("profile.pro.displayFrequency")}
            </p>
          </div>
          <div className='flex h-[40px] gap-1'>
            <Button
              label={t("profile.pro.getProNft")}
              size='md'
              variant='purple'
              href='/pro'
            />
          </div>
        </div>
        {totalCount && totalCount > 0 ? (
          <>
            {query.isLoading ? (
              <LoadingSkeleton
                width='100px'
                height='24px'
                className='mr-auto mt-2'
              />
            ) : (
              <section className='mt-2 flex flex-wrap items-center gap-1.5 text-text-sm md:gap-5'>
                <span className='mr-1'>{t("profile.yourAccount")}</span>
                <span className='flex items-center gap-1/2 text-grayTextPrimary'>
                  {t("profile.yourPlan")}:{" "}
                  {!totalCount ? (
                    <Badge color={!totalCount ? "gray" : "purple"}>Basic</Badge>
                  ) : (
                    <ProBadge />
                  )}
                </span>
                {!totalCount ? (
                  <ProBadge />
                ) : (
                  <Link
                    to={
                      "/profile?tab=pro" as FileRoutesByPath[keyof FileRoutesByPath]["path"]
                    }
                    className='gold-shimmer flex items-center gap-1/2 bg-purpleText bg-clip-text font-medium text-transparent underline hover:text-transparent'
                  >
                    {t("profile.nftsHeld")}: <span className=''>{totalCount}</span>
                  </Link>
                )}
                <span className='flex items-center gap-1/2 text-grayTextPrimary'>
                  {t("profile.apiKeyLimit")}: <span className='text-text'>1</span>
                </span>
              </section>
            )}
            <TableSearchInput
              placeholder={t("profile.pro.searchNft")}
              wrapperClassName='w-full mb-1 mt-1 max-w-desktop'
              showPrefixPopup={false}
              value={nftSearch}
              onchange={setNftSearch}
            />
            <GlobalTable
              type='default'
              scrollable
              items={items}
              rowHeight={65}
              minContentWidth={1000}
              query={query}
              totalItems={totalItems}
              columns={columns.sort((a, b) => {
                return (
                  columnsOrder.indexOf(a.key as keyof CexplorerNftsColumns) -
                  columnsOrder.indexOf(b.key as keyof CexplorerNftsColumns)
                );
              })}
              onOrderChange={setColumsOrder}
            />
          </>
        ) : (
          <div className='mt-2'>
            <EmptyState
              icon={<Zap size={24} />}
              primaryText={t("profile.pro.noNftsOwned")}
              secondaryText={t("profile.pro.getOneToUnlock")}
              button={
                <Button
                  label={t("profile.pro.getProNft")}
                  variant='purple'
                  size='md'
                  href='/pro'
                />
              }
            />
          </div>
        )}
      </div>
    </>
  );
};
