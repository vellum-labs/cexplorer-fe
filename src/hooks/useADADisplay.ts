import { useGeekConfigStore } from "@/stores/geekConfigStore";
import { formatNumberWithSuffix } from "@vellumlabs/cexplorer-sdk";

/**
 * Hook for displaying ADA/lovelace values based on user preferences.
 *
 * When displayADAInTooltips is true: shows values in ADA (₳)
 * When displayADAInTooltips is false: shows values in lovelace
 */
export const useADADisplay = () => {
  const { displayADAInTooltips } = useGeekConfigStore();

  /**
   * Converts lovelace to display value based on user preference
   * @param lovelace - Amount in lovelace
   * @param includeSymbol - Whether to include the unit symbol (default: true)
   * @returns Formatted string with value and optional symbol
   */
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

  /**
   * Converts lovelace to numeric value based on user preference
   * @param lovelace - Amount in lovelace
   * @returns Number in ADA or lovelace based on preference
   */
  const convertLovelace = (lovelace: number): number => {
    return displayADAInTooltips ? lovelace / 1e6 : lovelace;
  };

  /**
   * Formats an ADA value (already converted from lovelace) based on preference
   * If preference is lovelace, converts back to lovelace
   * @param ada - Amount in ADA
   * @param includeSymbol - Whether to include the unit symbol (default: true)
   * @returns Formatted string with value and optional symbol
   */
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

  /**
   * Converts ADA value to display value based on user preference
   * @param ada - Amount in ADA
   * @returns Number in ADA or lovelace based on preference
   */
  const convertADA = (ada: number): number => {
    return displayADAInTooltips ? ada : ada * 1e6;
  };

  /**
   * Gets the current unit label
   * @returns "₳" or "lovelace"
   */
  const getUnitLabel = (): string => {
    return displayADAInTooltips ? "₳" : "lovelace";
  };

  /**
   * Gets the current unit name
   * @returns "ADA" or "lovelace"
   */
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
