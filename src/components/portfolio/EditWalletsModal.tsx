import type { FC } from "react";
import { useState } from "react";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Modal, Button, TextInput } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";

interface EditWalletsModalProps {
  onClose: () => void;
}

export const EditWalletsModal: FC<EditWalletsModalProps> = ({ onClose }) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { wallets, updateWalletName, removeWallet } = usePortfolioStore();
  const [editedNames, setEditedNames] = useState<Record<string, string>>(
    () => Object.fromEntries(wallets.map(w => [w.id, w.name])),
  );

  const handleSave = () => {
    for (const wallet of wallets) {
      const newName = editedNames[wallet.id];
      if (newName && newName !== wallet.name) {
        updateWalletName(wallet.id, newName);
      }
    }
    onClose();
  };

  const handleDelete = (id: string) => {
    removeWallet(id);
    setEditedNames(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <Modal minHeight='420px' minWidth='500px' maxWidth='95%' onClose={onClose}>
      <p className='mb-2 pr-4 text-text-lg font-medium'>
        {t("portfolio.editWallets.title")}
      </p>

      <div className='flex flex-col gap-2'>
        {wallets.map(wallet => (
          <div key={wallet.id} className='flex items-center gap-2'>
            <div className='flex-1'>
              <TextInput
                placeholder={t("portfolio.addWallet.namePlaceholder")}
                onchange={value =>
                  setEditedNames(prev => ({ ...prev, [wallet.id]: value }))
                }
                value={editedNames[wallet.id] ?? wallet.name}
              />
              <p className='mt-0.5 text-text-xs text-grayTextPrimary'>
                {formatString(wallet.stakeAddress, "long")}
              </p>
            </div>
            <Button
              onClick={() => handleDelete(wallet.id)}
              variant='red'
              size='sm'
              label={t("common:actions.delete")}
            />
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <p className='py-4 text-center text-text-sm text-grayTextPrimary'>
          {t("portfolio.editWallets.noWallets")}
        </p>
      )}

      <div className='mt-3 flex justify-end gap-1'>
        <Button
          onClick={onClose}
          variant='secondary'
          size='md'
          label={t("common:actions.cancel")}
        />
        <Button
          onClick={handleSave}
          variant='primary'
          size='md'
          label={t("common:actions.save")}
        />
      </div>
    </Modal>
  );
};
