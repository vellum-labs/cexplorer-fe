import cfg_preprod_stage from "../../conf/preprod-stage.json";
import cfg_preprod_prod from "../../conf/preprod-prod.json";
import cfg_mainnet_stage from "../../conf/mainnet-stage.json";
import cfg_mainnet_prod from "../../conf/mainnet-prod.json";
import cfg_preview_stage from "../../conf/preview-stage.json";

export const configJSON = (() => {
  const config = import.meta.env.VITE_APP_CONFIG ?? "preprod-stage";

  switch (config) {
    case "preprod-stage":
      return cfg_preprod_stage;
    case "preprod-prod":
      return cfg_preprod_prod;
    case "mainnet-stage":
      return cfg_mainnet_stage;
    case "mainnet-prod":
      return cfg_mainnet_prod;
    case "preview-stage":
      return cfg_preview_stage;
    default:
      return cfg_preprod_stage;
  }
})();
