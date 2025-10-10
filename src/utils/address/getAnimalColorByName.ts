export const getAnimalColorByName = (name: string): string => {
  switch (name) {
    case "plankton":
      return "#c4f69c";
    case "shrimp":
      return "#f69972";
    case "crab":
      return "#47CD89";
    case "fish":
      return "#92c7e4";
    case "dolphin":
      return "#d2d8dc";
    case "shark":
      return "#3a8dde";
    case "whale":
      return "#22366c";
    case "tuna":
      return "#3a8dde";
    case "humpback":
      return "#527381";
    case "leviathan":
      return "#81ba71";
    default:
      return "#d2d8dc"; // default gray color
  }
};
