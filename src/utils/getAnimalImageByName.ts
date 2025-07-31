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

export const getAnimalImageByName = (name: string) => {
  switch (name) {
    case "plankton":
      return Plankton;
    case "shrimp":
      return Shrimp;
    case "crab":
      return Crab;
    case "fish":
      return Fish;
    case "tuna":
      return Tuna;
    case "dolphin":
      return Dolphin;
    case "shark":
      return Shark;
    case "whale":
      return Whale;
    case "leviathan":
      return Leviathan;
    case "humpback":
      return Humpback;
  }
};
