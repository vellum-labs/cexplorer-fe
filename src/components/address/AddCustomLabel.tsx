import { colors } from "@/constants/colors";
import { useFetchUserInfo } from "@/services/user";
import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useCustomLabelModalState } from "@/stores/states/customLabelModalState";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "../global/badges/Badge";
import { Tooltip } from "../ui/tooltip";

export const AddCustomLabel = ({ address }: { address: string }) => {
  const { data: userData } = useFetchUserInfo();
  const proNfts = userData?.data.membership.nfts || 0;
  const sliceIndex = proNfts === 0 ? 5 : proNfts * 100;
  const { labels, setLabels } = useAddressLabelStore();
  const label = labels
    .slice(0, sliceIndex)
    .find(label => label.ident === address)?.label;
  const { setAddressToEdit, setIsOpen } = useCustomLabelModalState();
  const isAddingDisabled =
    !label &&
    ((proNfts === 0 && labels.length >= 5) ||
      (proNfts > 0 && labels.length > proNfts * 100));
  const tooltipText =
    proNfts === 0
      ? "You can only add 10 labels with the free version of Cexplorer"
      : "You can only add 100 labels per NFT with the PRO version of Cexplorer";

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

  return (
    <Tooltip
      content={<div className='w-[150px]'>{tooltipText}</div>}
      hide={!isAddingDisabled}
    >
      <div className='flex items-center gap-2'>
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
