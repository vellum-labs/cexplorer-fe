import { vi } from "vitest";

/**
 * Controllable auth tokens store mock state.
 * Mutate `mockAuthTokensState.tokens` in `beforeEach` to simulate different auth states.
 */
export const mockAuthTokensState = {
  tokens: {} as Record<string, { token: string }>,
  setTokens: vi.fn(),
};

vi.mock("@/stores/authTokensStore", () => ({
  useAuthTokensStore: vi.fn(() => mockAuthTokensState),
}));
