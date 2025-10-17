import { addressIcons } from "@/constants/address";
import { isAnimalName } from "@/constants/animals";

export const getAnimalImageByName = (name: string) => {
  if (isAnimalName(name)) {
    return addressIcons[name];
  }

  return undefined;
};
