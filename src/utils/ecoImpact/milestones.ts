import { MILESTONES } from "@/constants/ecoImpact";

export function getNextMilestone(trees: number): number {
  const idx = MILESTONES.findIndex(m => m > trees);
  return idx === -1 ? MILESTONES[MILESTONES.length - 1] : MILESTONES[idx];
}

export function getPrevMilestone(trees: number): number {
  const idx = MILESTONES.findIndex(m => m > trees);
  return idx <= 0 ? 0 : MILESTONES[idx - 1];
}

export function calcProgress(trees: number): number {
  const next = getNextMilestone(trees);
  const prev = getPrevMilestone(trees);
  if (next === prev) return 99;
  return Math.min(((trees - prev) / (next - prev)) * 100, 99);
}
