import { useCheckUserDelegation } from "@/services/account";
import type { useFetchPoolDetail } from "@/services/pools";
import { useFetchUserInfo } from "@/services/user";
import { useWalletStore } from "@/stores/walletStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import Button from "../global/Button";
import Modal from "../global/Modal";
import SpinningLoader from "../global/SpinningLoader";

interface Props {
  onClose: () => void;
  poolQuery: ReturnType<typeof useFetchPoolDetail>;
}

const DelegationModal = ({ onClose, poolQuery }: Props) => {
  const { lucid } = useWalletStore();

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
          You are already delegating to this pool.
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
          <p className='text-text-sm text-center'>{poolName?.description}</p>

          <Button
            className='mt-5'
            label='Delegate'
            size='lg'
            variant='primary'
            onClick={() =>
              handleDelegation({ type: "pool", poolId, donation: true }, lucid)
            }
          />
        </div>
      )}
    </Modal>
  );
};

export default DelegationModal;
