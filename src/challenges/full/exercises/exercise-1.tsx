import { useMemo } from "react";

export type EventType = "request" | "error" | "alert";

export type ServiceEvent = {
  event_id: string;
  service_id: string;
  host_id: string;
  env: string;
  event_type: EventType;
  occurred_at: string;
};

export type FilterOp = "eq";
export type Filter = { dimension: string; op: FilterOp; value: string };
export type CatalogQuery = {
  metrics: string[];
  dimensions?: string[];
  filters?: Filter[];
  limit?: number;
};

// Monolithic starter — split into clear catalog / parse / execute sections (or files).
const METRIC_LABELS: Record<string, string> = {
  requests: "Requests",
  errors: "Errors",
  alerts: "Alerts",
  error_rate: "Error rate",
  alert_rate: "Alert rate",
};

function dimValue(event: ServiceEvent, dim: string): string {
  if (dim === "service") return event.service_id;
  if (dim === "host") return event.host_id;
  if (dim === "env") return event.env;
  if (dim === "date") return event.occurred_at.slice(0, 10);
  throw new Error(`Unknown dimension: ${dim}`);
}

function countOf(events: ServiceEvent[], type: EventType): number {
  return events.filter((e) => e.event_type === type).length;
}

function metricValue(events: ServiceEvent[], key: string): number {
  if (key === "requests") return countOf(events, "request");
  if (key === "errors") return countOf(events, "error");
  if (key === "alerts") return countOf(events, "alert");
  if (key === "error_rate") {
    const den = countOf(events, "request");
    return den === 0 ? 0 : countOf(events, "error") / den;
  }
  if (key === "alert_rate") {
    const den = countOf(events, "request");
    return den === 0 ? 0 : countOf(events, "alert") / den;
  }
  throw new Error(`Unknown metric: ${key}`);
}

/** Shape check only — still mixed into this module. */
export function parseCatalogQuery(input: unknown): CatalogQuery {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("invalid shape");
  }
  const obj = input as Record<string, unknown>;
  if (!Array.isArray(obj.metrics)) throw new Error("metrics required");
  return {
    metrics: obj.metrics as string[],
    dimensions: obj.dimensions as string[] | undefined,
    filters: obj.filters as Filter[] | undefined,
    limit: obj.limit as number | undefined,
  };
}

export function execute(
  query: CatalogQuery,
  events: ServiceEvent[],
): Record<string, unknown>[] {
  if (!query.metrics.length) throw new Error("metrics must not be empty");
  let filtered = events;
  for (const f of query.filters ?? []) {
    filtered = filtered.filter((e) => dimValue(e, f.dimension) === f.value);
  }
  const dimKeys = query.dimensions ?? [];
  const groups = new Map<string, { dims: Record<string, string>; events: ServiceEvent[] }>();
  for (const event of filtered) {
    const dims: Record<string, string> = {};
    for (const d of dimKeys) dims[d] = dimValue(event, d);
    const key = JSON.stringify(dims);
    const bucket = groups.get(key);
    if (bucket) bucket.events.push(event);
    else groups.set(key, { dims, events: [event] });
  }
  const rows: Record<string, unknown>[] = [];
  if (dimKeys.length === 0) {
    const row: Record<string, number> = {};
    for (const m of query.metrics) row[m] = metricValue(filtered, m);
    rows.push(row);
  } else {
    for (const { dims, events: g } of groups.values()) {
      const row: Record<string, unknown> = { ...dims };
      for (const m of query.metrics) row[m] = metricValue(g, m);
      rows.push(row);
    }
  }
  return typeof query.limit === "number" ? rows.slice(0, query.limit) : rows;
}

// Intentionally not exported as `metrics` yet — tests expect a catalog export.
export const metricLabels = METRIC_LABELS;

const SAMPLE: ServiceEvent[] = [
  {
    event_id: "e1",
    service_id: "svc_api",
    host_id: "host_a",
    env: "prod",
    event_type: "request",
    occurred_at: "2026-09-01T10:00:00.000Z",
  },
  {
    event_id: "e2",
    service_id: "svc_api",
    host_id: "host_a",
    env: "prod",
    event_type: "error",
    occurred_at: "2026-09-01T11:00:00.000Z",
  },
];

export default function Exercise1() {
  const rows = useMemo(
    () =>
      execute(
        parseCatalogQuery({
          metrics: ["requests"],
          dimensions: ["service"],
          filters: [{ dimension: "env", op: "eq", value: "prod" }],
        }),
        SAMPLE,
      ),
    [],
  );
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Full / exercise-1 starter</p>
      <p className="text-[var(--muted)]">
        Split catalog / parse / execute into clear named exports (see tests).
      </p>
      <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
