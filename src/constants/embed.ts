export enum EMBED_TYPES {
  GRAPH = "graph",
  SIMPLE_LINK = "simpleLink",
  BANNERS = "banners",
}

export enum EMBED_DATA_DOMAIN {
  POOL = "pool",
  DREP = "drep",
  TOKEN = "token",
}

export enum EMBED_CONFIG_GRAPH {
  GRAPH = "graph",
  NAME = "name",
  HASH = "hash",
}

export enum EMBED_CONFIG_SIMPLE_LINK {
  NAME = "name",
  HASH = "hash",
}

export enum EMBED_CONFIG_BANNERS {
  NAME = "name",
  HASH = "hash",
  LIVE_STAKE = "liveStake",
  CURRENT = "current",
  LIFETIME = "lifetime",
  STAT = "stat",
  PRICE_ADA = "priceAda",
  PRICE_USD = "priceUsd",
  DAILY_VOLUME = "dailyVolume",
  MARKET_CAP = "marketCap",
  HOLDERS = "holders",
  AGE = "age",
  POOLED_ADA = "pooledAda",
  TOTAL_SUPPLY = "totalSupply",
  COMPACT = "compact",
}

export enum EMBED_CONFIG_EXTRA_FORMAT {
  JSX = "jsx",
  PNG = "png",
}

export enum EMBED_CONFIG_EXTRA_THEME {
  DARK = "dark",
  LIGHT = "light",
}

export enum EMBED_CONFIG_EXTRA_NETWORK {
  MAINNET = "mainnet",
  PREPROD = "preprod",
  PREVIEW = "preview",
}

export const ALLOWED_PARAMS = {
  type: Object.values(EMBED_TYPES),
  data: Object.values(EMBED_DATA_DOMAIN),
  config: {
    [EMBED_TYPES.GRAPH]: Object.values(EMBED_CONFIG_GRAPH),
    [EMBED_TYPES.SIMPLE_LINK]: Object.values(EMBED_CONFIG_SIMPLE_LINK),
    [EMBED_TYPES.BANNERS]: {
      [EMBED_DATA_DOMAIN.POOL]: [
        EMBED_CONFIG_BANNERS.NAME,
        EMBED_CONFIG_BANNERS.HASH,
        EMBED_CONFIG_BANNERS.LIVE_STAKE,
        EMBED_CONFIG_BANNERS.CURRENT,
        EMBED_CONFIG_BANNERS.LIFETIME,
        EMBED_CONFIG_BANNERS.COMPACT,
      ],
      [EMBED_DATA_DOMAIN.DREP]: [
        EMBED_CONFIG_BANNERS.NAME,
        EMBED_CONFIG_BANNERS.HASH,
        EMBED_CONFIG_BANNERS.STAT,
        EMBED_CONFIG_BANNERS.COMPACT,
      ],
      [EMBED_DATA_DOMAIN.TOKEN]: [
        EMBED_CONFIG_BANNERS.NAME,
        EMBED_CONFIG_BANNERS.HASH,
        EMBED_CONFIG_BANNERS.PRICE_ADA,
        EMBED_CONFIG_BANNERS.PRICE_USD,
        EMBED_CONFIG_BANNERS.DAILY_VOLUME,
        EMBED_CONFIG_BANNERS.MARKET_CAP,
        EMBED_CONFIG_BANNERS.HOLDERS,
        EMBED_CONFIG_BANNERS.AGE,
        EMBED_CONFIG_BANNERS.POOLED_ADA,
        EMBED_CONFIG_BANNERS.TOTAL_SUPPLY,
      ],
    },
    extra: [
      ...Object.values(EMBED_CONFIG_EXTRA_THEME),
      ...Object.values(EMBED_CONFIG_EXTRA_NETWORK),
      ...Object.values(EMBED_CONFIG_EXTRA_FORMAT),
    ],
  },
};
