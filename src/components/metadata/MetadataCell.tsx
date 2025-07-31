import type { FC } from "react";
import { useState } from "react";
import { FileJson } from "lucide-react";

import Modal from "../global/Modal";
import { JsonDisplay } from "../global/JsonDisplay";

interface MetadataCellProps {
  metadata: any;
}

export const MetadataCell: FC<MetadataCellProps> = ({ metadata }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className='flex w-full justify-end'>
        <FileJson
          size={20}
          className='cursor-pointer text-grayTextPrimary'
          onClick={() => setOpen(true)}
        />
      </div>

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          minWidth='95%'
          maxWidth='900px'
          maxHeight='90vh'
          className='p-0'
        >
          <JsonDisplay
            data={metadata}
            isLoading={false}
            isError={false}
            search
            onClose={() => setOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};
