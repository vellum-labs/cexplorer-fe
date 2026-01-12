import type { FC } from "react";
import { useState } from "react";
import { FileJson } from "lucide-react";

import { Modal } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { createPortal } from "react-dom";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface MetadataCellProps {
  metadata: any;
}

export const MetadataCell: FC<MetadataCellProps> = ({ metadata }) => {
  const { t } = useAppTranslation("common");
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

      {open &&
        createPortal(
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
              noDataLabel={t("sdk.jsonDisplay.noDataLabel")}
            />
          </Modal>,
          document.body,
        )}
    </>
  );
};
