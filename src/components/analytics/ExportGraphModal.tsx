import type { FC } from "react";

import { Download } from "lucide-react";
import { Modal } from "@vellumlabs/cexplorer-sdk";

import { useState } from "react";

interface ExportGraphModalProps {
  onClose: () => void;
  onPNG: () => void;
  onCSV: () => void;
}

export const ExportGraphModal: FC<ExportGraphModalProps> = ({
  onClose,
  onPNG,
  onCSV,
}) => {
  const [selectedItem, setSelectedItem] = useState<"csv" | "png">();

  const exportData = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem === "png") {
      onPNG();
      return;
    }

    onCSV();
  };

  return (
    <Modal minWidth='95%' maxWidth='400px' maxHeight='95%' onClose={onClose}>
      <div className='flex flex-col gap-3'>
        <div className='flex h-full w-full flex-col gap-3'>
          <span className='text-text-lg font-semibold'>Export graph</span>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-start gap-1/2'>
            <input
              type='radio'
              id='csv'
              className='my-[2px] h-[15px] w-[15px]'
              checked={selectedItem === "csv"}
              onChange={() => setSelectedItem("csv")}
            />
            <div className='flex h-full flex-col'>
              <span className='text-text-sm font-medium'>CSV</span>
              <span className='text-text-sm text-grayTextPrimary'>
                Great for easy viewing in spreadsheet tools.
              </span>
            </div>
          </div>
          <div className='flex items-start gap-1/2'>
            <input
              type='radio'
              id='json'
              className='my-[2px] h-[15px] w-[15px]'
              checked={selectedItem === "png"}
              onChange={() => setSelectedItem("png")}
            />
            <div className='flex h-full flex-col'>
              <span className='text-text-sm font-medium'>PNG</span>
              <span className='text-text-sm text-grayTextPrimary'>
                Ideal for sharing high-quality images with lossless compression.
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between gap-1.5'>
          <button
            className='flex h-[40px] w-full max-w-[170px] flex-1 cursor-pointer items-center justify-center rounded-s border border-border'
            onClick={onClose}
          >
            <span className='text-text-md font-semibold'>Cancel</span>
          </button>
          <button
            className={`flex h-[40px] w-full max-w-[170px] flex-1 items-center justify-center gap-1/2 rounded-s border border-border transition-all duration-100 ${selectedItem ? "cursor-pointer" : "text-grayTextPrimary"}`}
            disabled={!selectedItem}
            onClick={exportData}
          >
            <Download size={20} className='text-inherit' />
            <span className='text-text-sm font-medium'>Export</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
