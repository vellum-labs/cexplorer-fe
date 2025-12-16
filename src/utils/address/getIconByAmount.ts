import Crab from "@/resources/images/icons/crab.svg";
import Dino from "@/resources/images/icons/dino.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Plankton from "@/resources/images/icons/plankton.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Tuna from "@/resources/images/icons/tuna.svg";
import Whale from "@/resources/images/icons/whale.svg";

export const getIconByAmount = (amount: number): string => {
  switch (true) {
    case amount >= 20_000_000:
      return Dino;
    case amount >= 5_000_000:
      return Humpback;
    case amount >= 1_000_000:
      return Whale;
    case amount >= 250_000:
      return Shark;
    case amount >= 100_000:
      return Dolphin;
    case amount >= 25_000:
      return Tuna;
    case amount >= 5_000:
      return Fish;
    case amount >= 1_000:
      return Crab;
    case amount >= 10:
      return Shrimp;
    default:
      return Plankton;
  }
};
