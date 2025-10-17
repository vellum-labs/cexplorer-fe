import { AnimalName, isAnimalName } from "@/constants/animals";

const animalRanges: Record<AnimalName, string> = {
  [AnimalName.Plankton]: "₳ 0 - ₳ 10",
  [AnimalName.Shrimp]: "₳ 10 - ₳ 1K",
  [AnimalName.Crab]: "₳ 1K - ₳ 5K",
  [AnimalName.Fish]: "₳ 5K - ₳ 25K",
  [AnimalName.Tuna]: "₳ 25K - ₳ 100K",
  [AnimalName.Dolphin]: "₳ 100K - ₳ 250K",
  [AnimalName.Shark]: "₳ 250K - ₳ 1M",
  [AnimalName.Whale]: "₳ 1M - ₳ 5M",
  [AnimalName.Humpback]: "₳ 5M - ₳ 20M",
  [AnimalName.Leviathan]: "₳ 20M+",
};

export const getAnimalRangeByName = (name: string): string => {
  if (isAnimalName(name)) {
    return animalRanges[name];
  }

  return "";
};
