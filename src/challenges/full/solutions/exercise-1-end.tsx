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

export const metrics = {
  requests: { label: "Requests", kind: "count", eventType: "request" as const },
  errors: { label: "Errors", kind: "count", eventType: "error" as const },
  alerts: { label: "Alerts", kind: "count", eventType: "alert" as const },
  error_rate: {
    label: "Error rate",
    kind: "rate" as const,
    numerator: "errors",
    denominator: "requests",
  },
  alert_rate: {
    label: "Alert rate",
    kind: "rate" as const,
    numerator: "alerts",
    denominator: "requests",
  },
} as const;

export const dimensions = {
  service: { label: "Service", field: "service_id" as const },
  host: { label: "Host", field: "host_id" as const },
  env: { label: "Environment", field: "env" as const },
  date: { label: "Date", field: "date" as const },
} as const;

const QUERY_KEYS = new Set(["metrics", "dimensions", "filters", "limit"]);

export function parseCatalogQuery(input: unknown): CatalogQuery {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("invalid shape");
  }
  const obj = input as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!QUERY_KEYS.has(key)) throw new Error(`Unknown query key: ${key}`);
  }
  if (!Array.isArray(obj.metrics) || !obj.metrics.every((m) => typeof m === "string")) {
    throw new Error("metrics must be string[]");
  }
  return {
    metrics: [...(obj.metrics as string[])],
    dimensions: Array.isArray(obj.dimensions)
      ? [...(obj.dimensions as string[])]
      : undefined,
    filters: Array.isArray(obj.filters) ? (obj.filters as Filter[]) : undefined,
    limit: typeof obj.limit === "number" ? obj.limit : undefined,
  };
}

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

export default function Exercise1End() {
  const rows = useMemo(
    () =>
      execute(
        parseCatalogQuery({
          metrics: ["requests", "error_rate"],
          dimensions: ["service"],
          filters: [{ dimension: "env", op: "eq", value: "prod" }],
        }),
        SAMPLE,
      ),
    [],
  );
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Full / exercise-1 solution</p>
      <p className="text-[var(--muted)]">
        Named exports: <code>metrics</code>, <code>dimensions</code>,{" "}
        <code>parseCatalogQuery</code>, <code>execute</code>.
      </p>
      <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
