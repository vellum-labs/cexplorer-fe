import { jamUrl } from "@/constants/confVariables";
import { ShoppingBasket } from "lucide-react";
import Button from "../Button";
import { ShareButton } from "../ShareButton";
import LoadingSkeleton from "../skeletons/LoadingSkeleton";
import { WatchlistStar } from "./WatchlistStar";
import type { useFetchPoolDetail } from "@/services/pools";
import { useWalletStore } from "@/stores/walletStore";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import { useFetchUserInfo } from "@/services/user";

export const WatchlistSection = ({
  ident,
  isLoading,
  collection,
  ticker,
  poolDetailQuery,
}: {
  ident: string | undefined;
  isLoading: boolean;
  collection?: string | null;
  ticker?: string;
  poolDetailQuery?: ReturnType<typeof useFetchPoolDetail>;
}) => {
  const { job } = useWalletStore();

  const userQuery = useFetchUserInfo();

  const livePool =
    userQuery.data?.data?.account && userQuery.data?.data?.account.length > 0
      ? userQuery.data?.data?.account[0].live_pool?.id
      : undefined;

  const delegatedToThisPool = livePool === ident;

  if (isLoading)
    return (
      <section className='ml-auto flex w-full max-w-desktop items-center justify-end gap-2'>
        {collection && (
          <LoadingSkeleton
            height='32px'
            width='117px'
            rounded='lg'
            className='h-8'
          />
        )}
        <LoadingSkeleton
          height='32px'
          width='32px'
          rounded='lg'
          className='h-8'
        />
        <LoadingSkeleton
          height='32px'
          width='32px'
          rounded='lg'
          className='h-8'
        />
      </section>
    );

  return (
    <div className='ml-auto flex w-full items-center justify-end gap-2'>
      {collection && (
        <Button
          href={`${jamUrl}collections/${collection}` as any}
          targetBlank
          size='sm'
          leftIcon={<ShoppingBasket size={18} />}
          variant='primary'
          label='Marketplace'
          className='h-[32px]'
        />
      )}
      <ShareButton />
      <WatchlistStar ident={ident} />
      <Button label='Promote' variant='tertiary' size='md' href='/pro' />
      {poolDetailQuery && (
        <Button
          label={
            delegatedToThisPool
              ? "Delegated 🥳"
              : job
                ? !ticker
                  ? "Delegate"
                  : `Delegate to [${ticker}]`
                : "Connect wallet to Delegate"
          }
          disabled={!job || delegatedToThisPool}
          variant='primary'
          size='md'
          onClick={() => handleDelegation(ident ?? "", job)}
        />
      )}
    </div>
  );
};
