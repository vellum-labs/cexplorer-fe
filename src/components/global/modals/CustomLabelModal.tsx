import { useAddressLabelStore } from "@/stores/addressLabelStore";
import { useCustomLabelModalState } from "@/stores/states/customLabelModalState";
import { Address } from "@/utils/address/getStakeAddress";
import { useEffect, useState } from "react";
import Button from "../Button";
import TextInput from "../inputs/TextInput";
import Modal from "../Modal";

export const CustomLabelModal = () => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const { labels, setLabels } = useAddressLabelStore();
  const [isAddressValid, setIsAddressValid] = useState(true);
  const { addressToEdit, setAddressToEdit, isOpen, setIsOpen } =
    useCustomLabelModalState();
  const labelChannel = new BroadcastChannel("label_channel");

  const onClose = () => {
    setIsOpen(false);
    setAddressToEdit(null);
  };

  const isEdit = () => {
    return labels.find(label => label.ident === address)?.label;
  };

  const handleSave = () => {
    try {
      Address.from(address);
    } catch (e) {
      setIsAddressValid(false);
      return;
    }

    if (labels.find(label => label.ident === address)) {
      setLabels([
        ...labels.filter(label => label.ident !== address),
        { ident: address, label: name },
      ]);

      labelChannel.postMessage({
        type: "label",
        labels: [
          ...labels.filter(label => label.ident !== address),
          { ident: address, label: name },
        ],
      });

      onClose();
      return;
    }

    setLabels([...labels, { ident: address, label: name }]);

    labelChannel.postMessage({
      type: "label",
      labels: [...labels, { ident: address, label: name }],
    });
    onClose();
  };

  const handleDelete = () => {
    setLabels(labels.filter(label => label.ident !== address));

    labelChannel.postMessage({
      type: "label",
      labels: labels.filter(label => label.ident !== address),
    });

    onClose();
  };

  useEffect(() => {
    setAddress(addressToEdit ?? "");
    setName(labels.find(label => label.ident === addressToEdit)?.label ?? "");
  }, [addressToEdit, labels]);

  if (!isOpen) return null;

  return (
    <Modal minHeight='260px' minWidth='400px' maxWidth='95%' onClose={onClose}>
      <p className='mb-5 pr-7 font-medium'>
        {isEdit() ? "Edit label:" : "Create new label:"}
      </p>
      <TextInput
        placeholder='Address'
        onchange={value => setAddress(value)}
        value={address}
        wrapperClassName='mb-1'
        disabled={!!addressToEdit}
        inputClassName={isAddressValid ? "" : "border-redText"}
      />
      <p className='mb-3 h-3 text-xs text-redText'>
        {isAddressValid ? "" : "Please enter a valid address"}
      </p>
      <TextInput
        placeholder='Label name'
        onchange={value => setName(value)}
        value={name}
        wrapperClassName='mb-6'
      />
      <div className='mt-auto flex justify-between gap-2'>
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
