export enum AnimalName {
  Plankton = "plankton",
  Shrimp = "shrimp",
  Crab = "crab",
  Fish = "fish",
  Tuna = "tuna",
  Dolphin = "dolphin",
  Shark = "shark",
  Whale = "whale",
  Humpback = "humpback",
  Leviathan = "leviathan",
}

export const ANIMAL_ORDER: AnimalName[] = [
  AnimalName.Plankton,
  AnimalName.Shrimp,
  AnimalName.Crab,
  AnimalName.Fish,
  AnimalName.Tuna,
  AnimalName.Dolphin,
  AnimalName.Shark,
  AnimalName.Whale,
  AnimalName.Humpback,
  AnimalName.Leviathan,
];

const animalValues = Object.values(AnimalName) as string[];

export const isAnimalName = (value: string): value is AnimalName =>
  animalValues.includes(value);
