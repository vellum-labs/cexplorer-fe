import preprodJSON from "../../conf/preprod-stage.json";
import mainnetJSON from "../../conf/mainnet-stage.json";
import previewJSON from "../../conf/preview-stage.json";

export const configJSON = (() => {
  const config = import.meta.env.VITE_APP_CONFIG ?? "preprod-stage";

  switch (config) {
    case "preprod-stage":
      return preprodJSON;
    case "mainnet-stage":
      return mainnetJSON;
    case "preview-stage":
      return previewJSON;
    default:
      return preprodJSON;
  }
})();
