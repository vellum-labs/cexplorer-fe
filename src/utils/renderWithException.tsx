import type { ReactNode } from "react";

export const renderWithException = (
  value: ReactNode,
  component: ReactNode,
): ReactNode => {
  if (!value) {
    return "-";
  }

  return component;
};
