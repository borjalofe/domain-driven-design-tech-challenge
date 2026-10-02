import { useMemo, useState } from "react";

export type EventType = "request" | "error" | "alert";

export type ServiceEvent = {
  event_id: string;
  service_id: string;
  host_id: string;
  env: string;
  event_type: EventType;
  occurred_at: string;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: string; message: string } };

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

export const metrics = {
  requests: { label: "Requests", kind: "count" },
  errors: { label: "Errors", kind: "count" },
  alerts: { label: "Alerts", kind: "count" },
  error_rate: { label: "Error rate", kind: "rate" },
  alert_rate: { label: "Alert rate", kind: "rate" },
} as const;

export const dimensions = {
  service: { label: "Service" },
  host: { label: "Host" },
  env: { label: "Environment" },
  date: { label: "Date" },
} as const;

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
  {
    event_id: "e3",
    service_id: "svc_web",
    host_id: "host_b",
    env: "staging",
    event_type: "request",
    occurred_at: "2026-09-02T10:00:00.000Z",
  },
  {
    event_id: "e4",
    service_id: "svc_web",
    host_id: "host_b",
    env: "staging",
    event_type: "alert",
    occurred_at: "2026-09-02T11:00:00.000Z",
  },
];

function dimValue(event: ServiceEvent, dim: string): string {
  if (dim === "service") return event.service_id;
  if (dim === "host") return event.host_id;
  if (dim === "env") return event.env;
  if (dim === "date") return event.occurred_at.slice(0, 10);
  return "";
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
  return 0;
}

export function execute(
  query: CatalogQuery,
  events: ServiceEvent[],
): Result<Record<string, unknown>[]> {
  if (!query.metrics.length) {
    return { ok: false, error: { code: "empty_metrics", message: "empty" } };
  }
  let filtered = events;
  for (const f of query.filters ?? []) {
    filtered = filtered.filter((e) => {
      const left = dimValue(e, f.dimension);
      if (f.op === "eq") return left === f.value;
      if (f.op === "neq") return left !== f.value;
      if (f.op === "gte") return left >= String(f.value);
      if (f.op === "lte") return left <= String(f.value);
      if (f.op === "in") {
        const list = Array.isArray(f.value)
          ? f.value
          : String(f.value)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
        return list.includes(left);
      }
      return false;
    });
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
  let rows: Record<string, unknown>[] = [];
  if (dimKeys.length === 0) {
    const row: Record<string, number> = {};
    for (const m of query.metrics) row[m] = metricValue(filtered, m);
    rows = [row];
  } else {
    for (const { dims, events: g } of groups.values()) {
      const row: Record<string, unknown> = { ...dims };
      for (const m of query.metrics) row[m] = metricValue(g, m);
      rows.push(row);
    }
  }
  return { ok: true, value: rows };
}

const METRIC_KEYS = Object.keys(metrics);
const DIM_KEYS = Object.keys(dimensions);
const OPS: FilterOp[] = ["eq", "in", "gte", "lte", "neq"];

function toggleInList(list: string[], key: string): string[] {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

export default function Exercise3End() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "requests",
    "error_rate",
  ]);
  const [selectedDims, setSelectedDims] = useState<string[]>(["service"]);
  const [filterDim, setFilterDim] = useState("env");
  const [filterOp, setFilterOp] = useState<FilterOp>("eq");
  const [filterValue, setFilterValue] = useState("prod");
  const error =
    selectedMetrics.length === 0 ? "Pick at least one metric" : null;

  const rows = useMemo(() => {
    if (selectedMetrics.length === 0) return [];
    const query: CatalogQuery = {
      metrics: selectedMetrics,
      dimensions: selectedDims,
      filters: filterValue
        ? [
            {
              dimension: filterDim,
              op: filterOp,
              value:
                filterOp === "in"
                  ? filterValue.split(",").map((s) => s.trim())
                  : filterValue,
            },
          ]
        : undefined,
    };
    const r = execute(query, SAMPLE);
    return r.ok ? r.value : [];
  }, [selectedMetrics, selectedDims, filterDim, filterOp, filterValue]);

  const columns = Object.keys(rows[0] ?? {});

  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Full / exercise-3 solution</p>
      <p className="text-[var(--muted)]">
        Each control updates CatalogQuery; table re-renders from execute.
      </p>

      <fieldset className="space-y-1">
        <legend className="font-medium">Metrics</legend>
        <div className="flex flex-wrap gap-2">
          {METRIC_KEYS.map((k) => (
            <label key={k} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(k)}
                onChange={() => setSelectedMetrics((m) => toggleInList(m, k))}
              />
              {k}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="font-medium">Dimensions</legend>
        <div className="flex flex-wrap gap-2">
          {DIM_KEYS.map((k) => (
            <label key={k} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedDims.includes(k)}
                onChange={() => setSelectedDims((d) => toggleInList(d, k))}
              />
              {k}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          Filter dim
          <select
            className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
            value={filterDim}
            onChange={(e) => setFilterDim(e.target.value)}
          >
            {DIM_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Op
          <select
            className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
            value={filterOp}
            onChange={(e) => setFilterOp(e.target.value as FilterOp)}
          >
            {OPS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Value
          <input
            className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={filterOp === "in" ? "prod,staging" : "prod"}
          />
        </label>
      </div>

      {error ? <p className="text-red-400">{error}</p> : null}

      <div className="overflow-x-auto rounded border border-[var(--border)]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-black/10">
            <tr>
              {columns.map((k) => (
                <th key={k} className="px-3 py-2">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                {columns.map((k) => (
                  <td key={k} className="px-3 py-2 tabular-nums">
                    {String(row[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
