import { useGeekConfigStore } from "@/stores/geekConfigStore";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";

export const useADADisplay = () => {
  const { displayADAInTooltips } = useGeekConfigStore();

  const formatLovelace = (
    lovelace: number,
    includeSymbol: boolean = true,
  ): string => {
    if (displayADAInTooltips) {
      const ada = lovelace / 1e6;
      return includeSymbol
        ? `₳ ${formatNumberWithSuffix(ada)}`
        : formatNumberWithSuffix(ada);
    }
    return includeSymbol
      ? `${formatNumberWithSuffix(lovelace)} lovelace`
      : formatNumberWithSuffix(lovelace);
  };

  const convertLovelace = (lovelace: number): number => {
    return displayADAInTooltips ? lovelace / 1e6 : lovelace;
  };

  const formatADA = (ada: number, includeSymbol: boolean = true): string => {
    if (displayADAInTooltips) {
      return includeSymbol
        ? `₳ ${formatNumberWithSuffix(ada)}`
        : formatNumberWithSuffix(ada);
    }
    const lovelace = ada * 1e6;
    return includeSymbol
      ? `${formatNumberWithSuffix(lovelace)} lovelace`
      : formatNumberWithSuffix(lovelace);
  };

  const convertADA = (ada: number): number => {
    return displayADAInTooltips ? ada : ada * 1e6;
  };

  const getUnitLabel = (): string => {
    return displayADAInTooltips ? "₳" : "lovelace";
  };

  const getUnitName = (): string => {
    return displayADAInTooltips ? "ADA" : "lovelace";
  };

  return {
    displayADAInTooltips,
    formatLovelace,
    convertLovelace,
    formatADA,
    convertADA,
    getUnitLabel,
    getUnitName,
  };
};
