import Crab from "@/resources/images/icons/crab.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Leviathan from "@/resources/images/icons/leviathan.svg";
import Plankton from "@/resources/images/icons/plankton.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Tuna from "@/resources/images/icons/tuna.svg";
import Whale from "@/resources/images/icons/whale.svg";

export const getAddressAnimalImage = (amount: number): string => {
  switch (true) {
    case amount <= 10000000:
      return Plankton;
    case amount <= 1000000000:
      return Shrimp;
    case amount <= 5000000000:
      return Crab;
    case amount <= 25000000000:
      return Fish;
    case amount <= 100000000000:
      return Tuna;
    case amount <= 250000000000:
      return Dolphin;
    case amount <= 1000000000000:
      return Shark;
    case amount <= 5000000000000:
      return Whale;
    case amount <= 20000000000000:
      return Humpback;
    case amount > 20000000000000:
      return Leviathan;
    default:
      return Plankton;
  }
};
