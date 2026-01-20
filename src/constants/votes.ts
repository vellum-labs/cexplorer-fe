export const VOTE_OPTIONS = ["Yes", "No", "Abstain"] as const;

export type Vote = (typeof VOTE_OPTIONS)[number] | null;
