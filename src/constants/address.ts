import Plankton from "@/resources/images/icons/plankton.svg";
import Shrimp from "@/resources/images/icons/shrimp.svg";
import Crab from "@/resources/images/icons/crab.svg";
import Fish from "@/resources/images/icons/fish.svg";
import Dolphin from "@/resources/images/icons/dolphin.svg";
import Shark from "@/resources/images/icons/shark.svg";
import Whale from "@/resources/images/icons/whale.svg";
import Humpback from "@/resources/images/icons/humpback.svg";
import Dino from "@/resources/images/icons/dino.svg";
import Tuna from "@/resources/images/icons/tuna.svg";
import { AnimalName } from "./animals";

export const addressIcons: Record<AnimalName, string> = {
  [AnimalName.Plankton]: Plankton,
  [AnimalName.Shrimp]: Shrimp,
  [AnimalName.Crab]: Crab,
  [AnimalName.Fish]: Fish,
  [AnimalName.Dolphin]: Dolphin,
  [AnimalName.Shark]: Shark,
  [AnimalName.Whale]: Whale,
  [AnimalName.Humpback]: Humpback,
  [AnimalName.Leviathan]: Dino,
  [AnimalName.Tuna]: Tuna,
};
