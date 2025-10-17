import { AnimalName, isAnimalName } from "@/constants/animals";

const animalColors: Record<AnimalName, string> = {
  [AnimalName.Plankton]: "#c4f69c",
  [AnimalName.Shrimp]: "#f69972",
  [AnimalName.Crab]: "#47CD89",
  [AnimalName.Fish]: "#92c7e4",
  [AnimalName.Tuna]: "#3a8dde",
  [AnimalName.Dolphin]: "#d2d8dc",
  [AnimalName.Shark]: "#3a8dde",
  [AnimalName.Whale]: "#22366c",
  [AnimalName.Humpback]: "#527381",
  [AnimalName.Leviathan]: "#81ba71",
};

export const getAnimalColorByName = (name: string): string => {
  if (isAnimalName(name)) {
    return animalColors[name];
  }

  return "#d2d8dc";
};
