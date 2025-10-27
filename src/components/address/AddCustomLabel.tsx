import { colors } from "@/constants/colors";
import { useFetchUserInfo } from "@/services/user";
import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useCustomLabelModalState } from "@/stores/states/customLabelModalState";
import { Edit } from "lucide-react";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";

export const AddCustomLabel = ({ address }: { address: string }) => {
  const { data: userData } = useFetchUserInfo();
  const proNfts = userData?.data.membership.nfts || 0;
  const sliceIndex = proNfts === 0 ? 10 : proNfts * 100;
  const { labels } = useAddressLabelStore();
  const label = labels
    .slice(0, sliceIndex)
    .find(label => label.ident === address)?.label;
  const { setAddressToEdit, setIsOpen } = useCustomLabelModalState();
  const isAddingDisabled =
    !label &&
    ((proNfts === 0 && labels.length >= 10) ||
      (proNfts > 0 && labels.length > proNfts * 100));
  const tooltipText =
    proNfts === 0
      ? "You can only add 10 labels with the free version of Cexplorer"
      : "You can only add 100 labels per NFT with the PRO version of Cexplorer";

  return (
    <Tooltip
      content={<div className='w-[150px]'>{tooltipText}</div>}
      hide={!isAddingDisabled}
    >
      <div className='flex items-center gap-1'>
        {label ? (
          <Badge className='italic' color='gray'>
            {label}
          </Badge>
        ) : (
          <button
            onClick={() => {
              setAddressToEdit(address);
              setIsOpen(true);
            }}
            className='text-primary disabled:cursor-not-allowed disabled:text-grayTextPrimary disabled:opacity-60'
            disabled={isAddingDisabled}
          >
            Add custom name
          </button>
        )}

        <button
          onClick={() => {
            setAddressToEdit(address);
            setIsOpen(true);
          }}
          disabled={isAddingDisabled}
          className='disabled:cursor-not-allowed disabled:text-grayTextPrimary disabled:opacity-60'
        >
          <Edit
            size={15}
            color={isAddingDisabled ? colors.grayTextPrimary : colors.primary}
          />
        </button>
      </div>
    </Tooltip>
  );
};
