import type { AnimalName } from "@/constants/animals";

export const formatAnimalLabel = (name: AnimalName) =>
  name.charAt(0).toUpperCase() + name.slice(1);
