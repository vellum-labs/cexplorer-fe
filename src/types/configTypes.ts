import type { ResponseCore } from "./commonTypes";

interface ConfigSwText {
  message: {
    en: string;
    cs: string;
  };
}

export type ConfigSwTextResponse = ResponseCore<ConfigSwText>;
