import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Modal,
  Button,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vellumlabs/cexplorer-sdk";
import { useGeekConfigModalState } from "@/stores/states/geekConfigModalState";
import {
  useGeekConfigStore,
  type UTxOSortOption,
} from "@/stores/geekConfigStore";

export const GeekConfigModal = () => {
  const { isOpen, setIsOpen } = useGeekConfigModalState();
  const {
    displayHandles,
    displayADAInTooltips,
    sortUTxOs,
    setDisplayHandles,
    setDisplayADAInTooltips,
    setSortUTxOs,
  } = useGeekConfigStore();

  const [localDisplayHandles, setLocalDisplayHandles] = useState(displayHandles);
  const [localDisplayADA, setLocalDisplayADA] = useState(displayADAInTooltips);
  const [localSortUTxOs, setLocalSortUTxOs] = useState<UTxOSortOption>(sortUTxOs);

  const onClose = () => {
    setLocalDisplayHandles(displayHandles);
    setLocalDisplayADA(displayADAInTooltips);
    setLocalSortUTxOs(sortUTxOs);
    setIsOpen(false);
  };

  const handleSave = () => {
    setDisplayHandles(localDisplayHandles);
    setDisplayADAInTooltips(localDisplayADA);
    setSortUTxOs(localSortUTxOs);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal minWidth="400px" maxWidth="600px" onClose={onClose}>
      <div className="flex flex-col gap-4 p-2">
        <div>
          <h2 className="text-text-xl font-semibold">Preferences</h2>
          <p className="text-text-sm text-grayTextPrimary">
            Select preferences for your best experience on Cexplorer.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">Display $Handles</p>
              <p className="text-text-sm text-grayTextPrimary">
                Show readable $Handles instead of full wallet addresses where
                available.
              </p>
            </div>
            <Switch
              active={localDisplayHandles}
              onChange={checked => setLocalDisplayHandles(checked)}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">
                Display ADA in tooltips
              </p>
              <p className="text-text-sm text-grayTextPrimary">
                Show tooltip amounts in ADA rather than lovelace
                <br />
                (1 ADA = 1,000,000 lovelace).
              </p>
            </div>
            <Switch
              active={localDisplayADA}
              onChange={checked => setLocalDisplayADA(checked)}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">Sort UTxOs</p>
              <p className="text-text-sm text-grayTextPrimary">
                Sort UTxOs shown in transaction details by their index or value.
              </p>
            </div>
            <Select
              value={localSortUTxOs}
              onValueChange={(value: UTxOSortOption) => setLocalSortUTxOs(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Index" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index">Index</SelectItem>
                <SelectItem value="value">Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            label="Cancel"
          />
          <Button
            onClick={handleSave}
            variant="primary"
            size="md"
            label="Save"
          />
        </div>
      </div>
    </Modal>,
    document.body,
  );
};
