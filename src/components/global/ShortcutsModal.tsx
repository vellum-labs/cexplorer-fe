import type { FC } from "react";
import { Modal } from "@vellumlabs/cexplorer-sdk";

interface ShortcutItem {
  label: string;
  keys: string[];
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutItem[];
}

interface ShortcutsModalProps {
  onClose: () => void;
}

export const ShortcutsModal: FC<ShortcutsModalProps> = ({ onClose }) => {
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "Navigation",
      shortcuts: [
        { label: "Homepage", keys: ["g", "then", "h"] },
        { label: "Transactions", keys: ["g", "then", "t"] },
        { label: "Blocks", keys: ["g", "then", "b"] },
        { label: "Epochs", keys: ["g", "then", "e"] },
        { label: "Pools", keys: ["g", "then", "p"] },
        { label: "DReps", keys: ["g", "then", "d"] },
        { label: "Assets", keys: ["g", "then", "a"] },
        { label: "Governance actions", keys: ["g", "then", "o"] },
      ],
    },
    {
      title: "Basics",
      shortcuts: [
        { label: "Open/Close shortcut help", keys: ["?"] },
        { label: "Focus search", keys: ["/"] },
        { label: "Refresh", keys: ["r"] },
        { label: "Next page", keys: ["j"] },
        { label: "Previous page", keys: ["k"] },
      ],
    },
  ];

  const renderKey = (key: string, index: number) => {
    if (key === "then") {
      return (
        <span key={index} className='px-1 text-text-sm text-grayTextPrimary'>
          then
        </span>
      );
    }
    return (
      <kbd
        key={index}
        className='min-w-[24px] rounded-s border border-border bg-darker px-1.5 py-0.5 text-center text-text-sm text-text'
      >
        {key}
      </kbd>
    );
  };

  return (
    <Modal minWidth='95%' maxWidth='660px' maxHeight='95%' onClose={onClose}>
      <div className='flex w-full flex-col gap-4 p-3 md:p-0'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-text-xl font-semibold text-text'>
            Keyboard shortcuts
          </h2>
          <p className='text-text-sm text-grayTextPrimary'>
            Navigate Cexplorer like a PRO with shortcuts.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className='flex flex-col gap-1'>
              <h3 className='text-text-md font-semibold text-text'>
                {group.title}
              </h3>
              <div className='flex flex-col gap-1'>
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className='flex items-center justify-between gap-1'
                  >
                    <span className='text-text-sm text-text'>
                      {shortcut.label}
                    </span>
                    <div className='flex flex-shrink-0 items-center'>
                      {shortcut.keys.map((key, keyIndex) =>
                        renderKey(key, keyIndex),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
