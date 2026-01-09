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
import { useAppTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useAppTranslation();

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
          <h2 className="text-text-xl font-semibold">{t("global.geekConfig.preferences")}</h2>
          <p className="text-text-sm text-grayTextPrimary">
            {t("global.geekConfig.preferencesDescription")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">{t("global.geekConfig.displayHandles")}</p>
              <p className="text-text-sm text-grayTextPrimary">
                {t("global.geekConfig.displayHandlesDescription")}
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
                {t("global.geekConfig.displayAdaTooltips")}
              </p>
              <p className="text-text-sm text-grayTextPrimary">
                {t("global.geekConfig.displayAdaTooltipsDescription")}
                <br />
                {t("global.geekConfig.adaLovelaceNote")}
              </p>
            </div>
            <Switch
              active={localDisplayADA}
              onChange={checked => setLocalDisplayADA(checked)}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-primary">{t("global.geekConfig.sortUtxos")}</p>
              <p className="text-text-sm text-grayTextPrimary">
                {t("global.geekConfig.sortUtxosDescription")}
              </p>
            </div>
            <Select
              value={localSortUTxOs}
              onValueChange={(value: UTxOSortOption) => setLocalSortUTxOs(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={t("global.geekConfig.index")} />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="index">{t("global.geekConfig.index")}</SelectItem>
                <SelectItem value="value">{t("global.geekConfig.value")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            label={t("actions.cancel")}
          />
          <Button
            onClick={handleSave}
            variant="primary"
            size="md"
            label={t("actions.save")}
          />
        </div>
      </div>
    </Modal>,
    document.body,
  );
};
