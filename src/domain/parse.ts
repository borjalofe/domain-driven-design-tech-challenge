import { err, ok, type Result } from "./result";
import type { CatalogQuery, Filter, FilterOp } from "./query";

const FILTER_OPS = new Set<FilterOp>(["eq", "in", "gte", "lte", "neq"]);
const QUERY_KEYS = new Set(["metrics", "dimensions", "filters", "limit"]);
const FILTER_KEYS = new Set(["dimension", "op", "value"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFilter(raw: unknown, index: number): Result<Filter> {
  if (!isPlainObject(raw)) {
    return err("invalid_filter", `filters[${index}] must be an object`);
  }
  for (const key of Object.keys(raw)) {
    if (!FILTER_KEYS.has(key)) {
      return err("unknown_key", `Unknown filter key: ${key}`);
    }
  }
  if (typeof raw.dimension !== "string" || raw.dimension.length === 0) {
    return err("invalid_filter", `filters[${index}].dimension must be a non-empty string`);
  }
  if (typeof raw.op !== "string" || !FILTER_OPS.has(raw.op as FilterOp)) {
    return err("invalid_filter", `filters[${index}].op must be eq|in|gte|lte|neq`);
  }
  const op = raw.op as FilterOp;
  if (op === "in") {
    if (!Array.isArray(raw.value) || !raw.value.every((v) => typeof v === "string")) {
      return err("invalid_filter", `filters[${index}].value must be string[] for op "in"`);
    }
    return ok({ dimension: raw.dimension, op, value: raw.value as string[] });
  }
  if (typeof raw.value !== "string") {
    return err("invalid_filter", `filters[${index}].value must be a string for op "${op}"`);
  }
  return ok({ dimension: raw.dimension, op, value: raw.value });
}

export function parseCatalogQuery(input: unknown): Result<CatalogQuery> {
  if (!isPlainObject(input)) {
    return err("invalid_shape", "CatalogQuery must be an object");
  }

  for (const key of Object.keys(input)) {
    if (!QUERY_KEYS.has(key)) {
      return err("unknown_key", `Unknown query key: ${key}`);
    }
  }

  if (!Array.isArray(input.metrics) || !input.metrics.every((m) => typeof m === "string")) {
    return err("invalid_metrics", "metrics must be an array of strings");
  }

  const query: CatalogQuery = {
    metrics: [...(input.metrics as string[])],
  };

  if ("dimensions" in input) {
    if (
      !Array.isArray(input.dimensions) ||
      !input.dimensions.every((d) => typeof d === "string")
    ) {
      return err("invalid_dimensions", "dimensions must be an array of strings");
    }
    query.dimensions = [...(input.dimensions as string[])];
  }

  if ("filters" in input) {
    if (!Array.isArray(input.filters)) {
      return err("invalid_filters", "filters must be an array");
    }
    const filters: Filter[] = [];
    for (let i = 0; i < input.filters.length; i++) {
      const parsed = parseFilter(input.filters[i], i);
      if (!parsed.ok) return parsed;
      filters.push(parsed.value);
    }
    query.filters = filters;
  }

  if ("limit" in input) {
    if (typeof input.limit !== "number" || !Number.isInteger(input.limit) || input.limit < 0) {
      return err("invalid_limit", "limit must be a non-negative integer");
    }
    query.limit = input.limit;
  }

  return ok(query);
}
