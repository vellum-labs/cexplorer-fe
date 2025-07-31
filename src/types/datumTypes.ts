interface DatumCore<T> {
  code: number;
  data: T;
  tokens: number;
  ex: number;
  debug: boolean;
}

interface DatumHash {
  id: string;
}

interface DatumFields {
  fields: {
    int?: number;
    list: {
      fields: {
        bytes?: string;
        int?: number;
      }[];
      constructor: number;
    }[];
  }[];
  constructor: number;
}

interface DatumValue {
  fields: {
    fields: DatumFields[];
    constructor: number;
  }[];
  constructor: number;
}

interface DatumDetailData {
  hash: string;
  datum: string;
  tx: DatumHash[];
  datums_in_same_tx: DatumHash[];
  value: DatumValue;
}

export type DatumDetailResponse = DatumCore<DatumDetailData>;
