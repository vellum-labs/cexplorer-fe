import { jamUrl } from "@/constants/confVariables";
import { ShoppingBasket } from "lucide-react";
import Button from "../Button";
import { ShareButton } from "../ShareButton";
import LoadingSkeleton from "../skeletons/LoadingSkeleton";
import { WatchlistStar } from "./WatchlistStar";

export const WatchlistSection = ({
  ident,
  isLoading,
  collection,
}: {
  ident: string | undefined;
  isLoading: boolean;
  collection?: string | null;
}) => {
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
    </div>
  );
};
