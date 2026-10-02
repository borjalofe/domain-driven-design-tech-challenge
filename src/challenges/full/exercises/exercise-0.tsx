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

export type Filter = {
  dimension: string;
  op: "eq";
  value: string;
};

export type CatalogQuery = {
  metrics: string[];
  dimensions?: string[];
  filters?: Filter[];
  limit?: number;
};

const DIM_FIELD: Record<string, keyof ServiceEvent | "date"> = {
  service: "service_id",
  host: "host_id",
  env: "env",
  date: "date",
};

function dimValue(event: ServiceEvent, dim: string): string {
  const field = DIM_FIELD[dim];
  if (!field) throw new Error(`Unknown dimension: ${dim}`);
  if (field === "date") return event.occurred_at.slice(0, 10);
  return event[field];
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

/** Short end-state: in-memory execute with eq only. */
export function execute(
  query: CatalogQuery,
  events: ServiceEvent[],
): Record<string, unknown>[] {
  if (!query.metrics || query.metrics.length === 0) {
    throw new Error("metrics must not be empty");
  }

  let filtered = events;
  for (const f of query.filters ?? []) {
    if (f.op !== "eq") throw new Error(`Unsupported op: ${f.op}`);
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

  let rows: Record<string, unknown>[];
  if (dimKeys.length === 0) {
    const metricsRow: Record<string, number> = {};
    for (const m of query.metrics) metricsRow[m] = metricValue(filtered, m);
    rows = [metricsRow];
  } else {
    rows = [];
    for (const { dims, events: groupEvents } of groups.values()) {
      const row: Record<string, unknown> = { ...dims };
      for (const m of query.metrics) row[m] = metricValue(groupEvents, m);
      rows.push(row);
    }
  }

  if (typeof query.limit === "number") rows = rows.slice(0, query.limit);
  return rows;
}

const SAMPLE_EVENTS: ServiceEvent[] = [
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
  {
    event_id: "e3",
    service_id: "svc_web",
    host_id: "host_b",
    env: "prod",
    event_type: "request",
    occurred_at: "2026-09-01T12:00:00.000Z",
  },
];

const SAMPLE_QUERY: CatalogQuery = {
  metrics: ["requests", "errors"],
  dimensions: ["service"],
  filters: [{ dimension: "env", op: "eq", value: "prod" }],
};

export default function Exercise0() {
  const rows = useMemo(
    () => execute(SAMPLE_QUERY, SAMPLE_EVENTS),
    [],
  );

  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Full / exercise-0 starter</p>
      <p className="text-[var(--muted)]">
        Display only — domain logic lives in this file. Next exercises split it.
      </p>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {Object.keys(rows[0] ?? { service: "", requests: 0 }).map((k) => (
              <th key={k} className="py-1 pr-3 font-medium">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border)]/60">
              {Object.values(row).map((v, j) => (
                <td key={j} className="py-1 pr-3">
                  {String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
