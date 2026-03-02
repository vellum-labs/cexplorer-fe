import { vi } from "vitest";
import type { ReactNode } from "react";

export const mockNavigate = vi.fn();

export const defaultRouterParams: Record<string, string> = {
  id: "gov_action1qpx0qfnj6%230",
};

export const defaultSearchParams: Record<string, any> = {
  page: 1,
};

vi.mock("@tanstack/react-router", () => ({
  useParams: vi.fn(() => defaultRouterParams),
  useSearch: vi.fn(() => defaultSearchParams),
  useNavigate: vi.fn(() => mockNavigate),
  Link: ({ children, to, params }: { children: ReactNode; to: string; params?: any }) => {
    const href = params
      ? `${to}/${Object.values(params).join("/")}`
      : to;
    return <a href={href}>{children}</a>;
  },
}));
