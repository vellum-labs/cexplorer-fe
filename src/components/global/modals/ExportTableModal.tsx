import type { TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { Download } from "lucide-react";
import Modal from "../Modal";

import { useState } from "react";

import { convertJSONToCSV } from "@/utils/convertJSONToCSV";
import { getExportJSON } from "@/utils/getExportJSON";

interface ExportTableModalProps {
  onClose: () => void;
  columns?: TableColumns<any>;
  items?: any[];
  currentPage?: number;
}

export const ExportTableModal: FC<ExportTableModalProps> = ({
  onClose,
  columns,
  items,
  currentPage,
}) => {
  const [selectedItem, setSelectedItem] = useState<"csv" | "json">();

  const exportData = () => {
    if (!columns || !items) {
      return;
    }

    const json = getExportJSON(columns, items, currentPage ?? 1);

    if (!json) {
      return;
    }
    const link = document.createElement("a");

    if (selectedItem === "json") {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(json),
      )}`;
      link.href = jsonString;
      link.download = "table.json";
      link.click();
      return;
    }

    const csv: string = convertJSONToCSV(json);
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.href = csvString;
    link.download = "table.csv";
    link.click();
  };

  return (
    <Modal minWidth='95%' maxWidth='400px' maxHeight='95%' onClose={onClose}>
      <div className='flex flex-col gap-3'>
        <div className='flex h-full w-full flex-col gap-3'>
          <span className='text-text-lg font-semibold'>Export table</span>
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
              <span className='text-grayTextPrimary text-text-sm'>
                Great for easy viewing in spreadsheet tools.
              </span>
            </div>
          </div>
          <div className='flex items-start gap-1/2'>
            <input
              type='radio'
              id='json'
              className='my-[2px] h-[15px] w-[15px]'
              checked={selectedItem === "json"}
              onChange={() => setSelectedItem("json")}
            />
            <div className='flex h-full flex-col'>
              <span className='text-text-sm font-medium'>JSON</span>
              <span className='text-grayTextPrimary text-text-sm'>
                Best for structured data and app integration.
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
