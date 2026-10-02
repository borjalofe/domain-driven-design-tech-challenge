export type FilterOp = "eq" | "in" | "gte" | "lte" | "neq";

export type Filter = {
  dimension: string;
  op: FilterOp;
  value: string | string[];
};

export type CatalogQuery = {
  metrics: string[];
  dimensions?: string[];
  filters?: Filter[];
  limit?: number;
};
