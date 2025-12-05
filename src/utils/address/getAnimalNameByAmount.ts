import { AnimalName } from "@/constants/animals";

export const getAnimalNameByAmount = (amount: number): AnimalName => {
  const ada = amount / 1_000_000;

  switch (true) {
    case ada >= 20_000_000:
      return AnimalName.Leviathan;
    case ada >= 5_000_000:
      return AnimalName.Humpback;
    case ada >= 1_000_000:
      return AnimalName.Whale;
    case ada >= 250_000:
      return AnimalName.Shark;
    case ada >= 100_000:
      return AnimalName.Dolphin;
    case ada >= 25_000:
      return AnimalName.Tuna;
    case ada >= 5_000:
      return AnimalName.Fish;
    case ada >= 1_000:
      return AnimalName.Crab;
    case ada >= 10:
      return AnimalName.Shrimp;
    default:
      return AnimalName.Plankton;
  }
};
