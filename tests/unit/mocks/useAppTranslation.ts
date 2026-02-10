import { vi } from "vitest";

export const mockChangeLanguage = vi.fn();

export const mockUseAppTranslation = () => ({
  t: (key: string) => key,
  locale: "en" as const,
  changeLanguage: mockChangeLanguage,
  i18n: {
    language: "en",
    changeLanguage: mockChangeLanguage,
  },
});

vi.mock("@/hooks/useAppTranslation", () => ({
  useAppTranslation: mockUseAppTranslation,
  default: mockUseAppTranslation,
}));
