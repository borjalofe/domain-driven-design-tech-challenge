import {
  dimensions,
  isDimensionKey,
  isMetricKey,
  metrics,
  type MetricKey,
} from "./catalog";
import type { CatalogQuery, Filter } from "./query";
import { err, ok, type Result } from "./result";
import type { ServiceEvent } from "./types";

function dimensionValue(event: ServiceEvent, key: string): string | null {
  if (!isDimensionKey(key)) return null;
  const field = dimensions[key].field;
  if (field === "date") {
    return event.occurred_at.slice(0, 10);
  }
  return event[field];
}

function matchesFilter(event: ServiceEvent, filter: Filter): boolean {
  const left = dimensionValue(event, filter.dimension);
  if (left === null) return false;

  switch (filter.op) {
    case "eq":
      return left === filter.value;
    case "neq":
      return left !== filter.value;
    case "gte":
      return left >= String(filter.value);
    case "lte":
      return left <= String(filter.value);
    case "in":
      return Array.isArray(filter.value) && filter.value.includes(left);
    default:
      return false;
  }
}

function countMetric(events: ServiceEvent[], metricKey: MetricKey): number {
  const def = metrics[metricKey];
  if (def.kind !== "count") return 0;
  return events.filter((e) => e.event_type === def.eventType).length;
}

function rateMetric(events: ServiceEvent[], metricKey: MetricKey): number {
  const def = metrics[metricKey];
  if (def.kind !== "rate") return 0;
  const num = countMetric(events, def.numerator as MetricKey);
  const den = countMetric(events, def.denominator as MetricKey);
  if (den === 0) return 0;
  return num / den;
}

function aggregate(events: ServiceEvent[], metricKeys: string[]): Record<string, number> {
  const row: Record<string, number> = {};
  for (const key of metricKeys) {
    if (!isMetricKey(key)) continue;
    const def = metrics[key];
    row[key] = def.kind === "count" ? countMetric(events, key) : rateMetric(events, key);
  }
  return row;
}

export function execute(
  query: CatalogQuery,
  events: ServiceEvent[],
): Result<Record<string, unknown>[]> {
  if (!query.metrics || query.metrics.length === 0) {
    return err("empty_metrics", "metrics must not be empty");
  }

  for (const key of query.metrics) {
    if (!isMetricKey(key)) {
      return err("unknown_metric", `Unknown metric: ${key}`);
    }
  }

  const dimKeys = query.dimensions ?? [];
  for (const key of dimKeys) {
    if (!isDimensionKey(key)) {
      return err("unknown_dimension", `Unknown dimension: ${key}`);
    }
  }

  for (const filter of query.filters ?? []) {
    if (!isDimensionKey(filter.dimension)) {
      return err("unknown_dimension", `Unknown filter dimension: ${filter.dimension}`);
    }
  }

  const filtered = events.filter((event) =>
    (query.filters ?? []).every((f) => matchesFilter(event, f)),
  );

  const groups = new Map<string, { dims: Record<string, string>; events: ServiceEvent[] }>();

  for (const event of filtered) {
    const dims: Record<string, string> = {};
    for (const key of dimKeys) {
      dims[key] = dimensionValue(event, key) ?? "";
    }
    const groupKey = JSON.stringify(dims);
    const existing = groups.get(groupKey);
    if (existing) {
      existing.events.push(event);
    } else {
      groups.set(groupKey, { dims, events: [event] });
    }
  }

  // No dimensions → one aggregate over the filtered set
  let rows: Record<string, unknown>[];
  if (dimKeys.length === 0) {
    rows = [{ ...aggregate(filtered, query.metrics) }];
  } else {
    rows = [];
    for (const { dims, events: groupEvents } of groups.values()) {
      rows.push({ ...dims, ...aggregate(groupEvents, query.metrics) });
    }
  }

  if (typeof query.limit === "number") {
    rows = rows.slice(0, query.limit);
  }

  return ok(rows);
}
