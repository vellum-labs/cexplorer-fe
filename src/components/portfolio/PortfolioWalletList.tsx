import type { FC } from "react";
import { useState } from "react";
import { Wallet, Pencil, Plus, Trash2, X, Check, Copy } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import {
  formatNumberWithSuffix,
  formatString,
  Button,
  Badge,
  TextInput,
} from "@vellumlabs/cexplorer-sdk";

interface PortfolioWalletListProps {
  onAddWallet: () => void;
}

export const PortfolioWalletList: FC<PortfolioWalletListProps> = ({
  onAddWallet,
}) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const {
    wallets,
    selectedWalletId,
    setSelectedWallet,
    removeWallet,
    updateWalletName,
  } = usePortfolioStore();
  const { walletDataList } = usePortfolioData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string, address: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSelectWallet = (id: string) => {
    if (isEditing) return;
    setSelectedWallet(selectedWalletId === id ? null : id);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingWalletId(id);
    setEditName(currentName);
  };

  const handleConfirmRename = () => {
    if (editingWalletId && editName.trim()) {
      updateWalletName(editingWalletId, editName.trim());
    }
    setEditingWalletId(null);
    setEditName("");
  };

  const handleCancelRename = () => {
    setEditingWalletId(null);
    setEditName("");
  };

  const handleDelete = (id: string) => {
    removeWallet(id);
    if (wallets.length <= 1) {
      setIsEditing(false);
    }
  };

  return (
    <div className='flex h-full flex-col rounded-l border border-border bg-cardBg p-4'>
      <div className='mb-1'>
        <div className='flex items-center gap-1.5'>
          <h2 className='text-text-lg font-semibold'>
            {t("portfolio.wallets.title")}
          </h2>
          <Badge color='blue' rounded>
            {wallets.length} {t("portfolio.wallets.added")}
          </Badge>
        </div>
        <p className='text-text-sm text-grayTextPrimary'>
          {isEditing
            ? t("portfolio.wallets.editHint")
            : t("portfolio.wallets.clickToDisplay")}
        </p>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='flex flex-col divide-y divide-border'>
          {wallets.map(wallet => {
            const data = walletDataList.find(w => w.walletId === wallet.id);
            const adaBalance = (data?.adaBalance ?? 0) / 1e6;
            const isSelected = selectedWalletId === wallet.id;
            const isRenaming = editingWalletId === wallet.id;

            return (
              <div
                key={wallet.id}
                onClick={() => handleSelectWallet(wallet.id)}
                className={`flex items-center gap-3 py-3 text-left transition-colors ${
                  !isEditing ? "cursor-pointer" : ""
                } ${isSelected && !isEditing ? "bg-primary/5" : !isEditing ? "hover:bg-primary/5" : ""}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-m ${
                    isSelected && !isEditing
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Wallet size={18} />
                </div>
                <div className='min-w-0 flex-1'>
                  {isRenaming ? (
                    <div className='flex items-center gap-1'>
                      <TextInput
                        placeholder={t("portfolio.addWallet.namePlaceholder")}
                        onchange={value => setEditName(value)}
                        value={editName}
                      />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleConfirmRename();
                        }}
                        className='rounded-m p-1 text-green-500 hover:bg-green-500/10'
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleCancelRename();
                        }}
                        className='rounded-m p-1 text-grayTextPrimary hover:bg-grayTextPrimary/10'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className='truncate text-text-sm font-medium'>
                        {wallet.name}
                      </p>
                      <p className='flex items-center gap-1 truncate text-text-xs text-primary'>
                        {formatString(wallet.stakeAddress, "long")}
                        <button
                          onClick={e => handleCopy(e, wallet.id, wallet.stakeAddress)}
                          className='shrink-0 text-grayTextPrimary hover:text-primary'
                          title={t("common:actions.copy")}
                        >
                          {copiedId === wallet.id ? (
                            <Check size={12} className='text-green-500' />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </p>
                    </>
                  )}
                </div>
                {isEditing && !isRenaming ? (
                  <div className='flex shrink-0 items-center gap-1'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleStartRename(wallet.id, wallet.name);
                      }}
                      className='rounded-m p-1.5 text-grayTextPrimary hover:bg-primary/10 hover:text-primary'
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(wallet.id);
                      }}
                      className='rounded-m p-1.5 text-grayTextPrimary hover:bg-red-500/10 hover:text-redText'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : !isEditing ? (
                  <div className='shrink-0 text-right'>
                    <p className='text-text-sm font-semibold'>
                      ₳{formatNumberWithSuffix(adaBalance)}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className='mt-3 flex gap-2 border-t border-border pt-3'>
        {wallets.length > 0 && (
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              setEditingWalletId(null);
            }}
            variant={isEditing ? "primary" : "secondary"}
            size='sm'
            label={
              isEditing
                ? t("portfolio.wallets.done")
                : t("portfolio.wallets.editWallets")
            }
            leftIcon={isEditing ? <Check size={14} /> : <Pencil size={14} />}
          />
        )}
        {!isEditing && (
          <Button
            onClick={onAddWallet}
            variant='primary'
            size='sm'
            label={t("portfolio.wallets.addWallet")}
            leftIcon={<Plus size={14} />}
            disabled={wallets.length >= 10}
          />
        )}
      </div>
    </div>
  );
};
