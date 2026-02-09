import type { FC } from "react";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation();

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t("global.shortcuts.navigation"),
      shortcuts: [
        { label: t("global.shortcuts.homepage"), keys: ["g", "+", "h"] },
        { label: t("global.shortcuts.transactions"), keys: ["g", "+", "t"] },
        { label: t("global.shortcuts.blocks"), keys: ["g", "+", "b"] },
        { label: t("global.shortcuts.epochs"), keys: ["g", "+", "e"] },
        { label: t("global.shortcuts.pools"), keys: ["g", "+", "p"] },
        { label: t("global.shortcuts.dreps"), keys: ["g", "+", "d"] },
        { label: t("global.shortcuts.assets"), keys: ["g", "+", "a"] },
        {
          label: t("global.shortcuts.governanceActions"),
          keys: ["g", "+", "o"],
        },
      ],
    },
    {
      title: t("global.shortcuts.basics"),
      shortcuts: [
        { label: t("global.shortcuts.openCloseHelp"), keys: ["?"] },
        { label: t("global.shortcuts.focusSearch"), keys: ["/"] },
        { label: t("global.shortcuts.refresh"), keys: ["r"] },
        { label: t("global.shortcuts.nextPage"), keys: ["j"] },
        { label: t("global.shortcuts.previousPage"), keys: ["k"] },
      ],
    },
  ];

  const renderKey = (key: string, index: number) => {
    if (key === "+") {
      return (
        <span key={index} className='px-1 text-text-sm text-grayTextPrimary'>
          +
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
            {t("global.shortcuts.title")}
          </h2>
          <p className='text-text-sm text-grayTextPrimary'>
            {t("global.shortcuts.description")}
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
