import type { ReactNode } from "@tanstack/react-router";

export const renderWithException = (
  value: ReactNode,
  component: ReactNode,
): ReactNode => {
  if (!value) {
    return "-";
  }

  return component;
};
