import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useCustomLabelModalState } from "@/stores/states/customLabelModalState";
import { Address } from "@/utils/address/getStakeAddress";
import { useEffect, useState } from "react";
import Button from "../Button";
import TextInput from "../inputs/TextInput";
import Modal from "../Modal";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useFetchUserInfo, updateUserLabels } from "@/services/user";
import type { AddressLabel } from "@/types/commonTypes";

export const CustomLabelModal = () => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const { labels, setLabels, updateHistoryLabels } = useAddressLabelStore();
  const [isAddressValid, setIsAddressValid] = useState(true);
  const { addressToEdit, setAddressToEdit, isOpen, setIsOpen } =
    useCustomLabelModalState();
  const token = useAuthToken();
  const { data: userData } = useFetchUserInfo();
  const userAddress = userData?.data.address;
  const labelChannel = new BroadcastChannel("label_channel");

  const onClose = () => {
    setIsOpen(false);
    setAddressToEdit(null);
  };

  const isEdit = () => {
    return labels.find(label => label.ident === address)?.label;
  };

  const syncWithApi = async (updatedLabels: AddressLabel[]) => {
    if (token && userAddress) {
      try {
        const formattedLabels = updatedLabels.map(l => ({
          ident: l.ident,
          label: l.label
        }));
        await updateUserLabels(token, formattedLabels);
      } catch (error) {
        console.error("Failed to sync with API:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      Address.from(address);
    } catch (e) {
      setIsAddressValid(false);
      return;
    }

    let updatedLabels: AddressLabel[];

    if (labels.find(label => label.ident === address)) {
      updatedLabels = [
        ...labels.filter(label => label.ident !== address),
        { ident: address, label: name },
      ];
    } else {
      updatedLabels = [...labels, { ident: address, label: name }];
    }

    setLabels(updatedLabels);
    updateHistoryLabels(token ? userAddress || null : null, updatedLabels);

    labelChannel.postMessage({
      type: "label",
      labels: updatedLabels,
    });

    await syncWithApi(updatedLabels);
    onClose();
  };

  const handleDelete = async () => {
    const updatedLabels = labels.filter(label => label.ident !== address);

    setLabels(updatedLabels);
    updateHistoryLabels(token ? userAddress || null : null, updatedLabels);

    labelChannel.postMessage({
      type: "label",
      labels: updatedLabels,
    });

    await syncWithApi(updatedLabels);
    onClose();
  };

  useEffect(() => {
    setAddress(addressToEdit ?? "");
    setName(labels.find(label => label.ident === addressToEdit)?.label ?? "");
  }, [addressToEdit, labels]);

  if (!isOpen) return null;

  return (
    <Modal minHeight='260px' minWidth='400px' maxWidth='95%' onClose={onClose}>
      <p className='mb-3 pr-4 font-medium'>
        {isEdit() ? "Edit label:" : "Create new label:"}
      </p>
      <TextInput
        placeholder='Address'
        onchange={value => setAddress(value)}
        value={address}
        wrapperClassName='mb-1/2'
        disabled={!!addressToEdit}
        inputClassName={isAddressValid ? "" : "border-redText"}
      />
      <p className='mb-1.5 h-3 text-xs text-redText'>
        {isAddressValid ? "" : "Please enter a valid address"}
      </p>
      <TextInput
        placeholder='Label name'
        onchange={value => setName(value)}
        value={name}
        wrapperClassName='mb-3'
      />
      <div className='mt-auto flex justify-between gap-1'>
        <Button
          onClick={onClose}
          variant='secondary'
          size='md'
          label='Cancel'
        />
        {isEdit() && (
          <Button
            onClick={handleDelete}
            variant='red'
            size='md'
            label='Delete'
            className='ml-auto'
          />
        )}
        <Button onClick={handleSave} variant='primary' size='md' label='Save' />
      </div>
    </Modal>
  );
};
