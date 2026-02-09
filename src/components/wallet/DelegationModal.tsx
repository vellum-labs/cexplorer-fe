import { useCheckUserDelegation } from "@/services/account";
import type { useFetchPoolDetail } from "@/services/pools";
import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { SpinningLoader } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  onClose: () => void;
  poolQuery: ReturnType<typeof useFetchPoolDetail>;
}

const DelegationModal = ({ onClose, poolQuery }: Props) => {
  const { t } = useAppTranslation("common");
  const { wallet } = useWalletStore();

  const poolId = poolQuery?.data?.data?.pool_id ?? "";

  const poolData = poolQuery.data?.data;
  const poolName = poolData?.pool_name;
  const userQuery = useFetchUserInfo();
  const view =
    userQuery.data?.data?.account && userQuery.data?.data?.account.length > 0
      ? userQuery.data?.data?.account[0].view
      : undefined;
  const delegationQuery = useCheckUserDelegation(view);

  const livePool =
    userQuery.data?.data?.account && userQuery.data?.data?.account.length > 0
      ? userQuery.data?.data?.account[0].live_pool
      : undefined;

  if (poolQuery.isLoading || delegationQuery.isLoading) {
    return (
      <Modal
        minHeight='400px'
        minWidth='400px'
        maxWidth='95%'
        onClose={onClose}
      >
        <div className='flex h-full w-full items-center justify-center'>
          <SpinningLoader />
        </div>
      </Modal>
    );
  }

  return (
    <Modal minHeight='400px' minWidth='400px' maxWidth='95%' onClose={onClose}>
      {livePool === poolData?.pool_id ? (
        <div className='flex h-full w-full items-center justify-center text-center'>
          {t("wallet.alreadyDelegating")}
        </div>
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-around'>
          {poolName?.ticker && poolName.name ? (
            <h2 className='mt-1'>
              [{poolName?.ticker}] {poolName?.name}
            </h2>
          ) : (
            <h3 className='mt-1 break-all text-center'>{poolId}</h3>
          )}
          <p className='text-center text-text-sm'>{poolName?.description}</p>

          <Button
            className='mt-5'
            label={t("wallet.delegate")}
            size='lg'
            variant='primary'
            onClick={() =>
              handleDelegation(
                { type: "pool", ident: poolId, donation: true },
                wallet,
              )
            }
          />
        </div>
      )}
    </Modal>
  );
};

export default DelegationModal;
