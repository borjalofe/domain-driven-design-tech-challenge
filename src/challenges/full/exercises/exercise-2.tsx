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

/** Starter: still throws — wire Result for unknown keys / empty metrics. */
export function parseCatalogQuery(input: unknown): CatalogQuery {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("invalid shape");
  }
  const obj = input as Record<string, unknown>;
  // TODO: return Result instead of throw; reject unknown keys with ok:false
  for (const key of Object.keys(obj)) {
    if (!QUERY_KEYS.has(key)) throw new Error(`Unknown query key: ${key}`);
  }
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
  if (!query.metrics.length) throw new Error("empty metrics");
  // Minimal eq-only path for the panel
  let filtered = events;
  for (const f of query.filters ?? []) {
    if (f.op !== "eq") continue;
    filtered = filtered.filter((e) => {
      const left =
        f.dimension === "service"
          ? e.service_id
          : f.dimension === "env"
            ? e.env
            : "";
      return left === f.value;
    });
  }
  return [{ requests: filtered.filter((e) => e.event_type === "request").length }];
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
];

export default function Exercise2() {
  const [msg, setMsg] = useState<string | null>(null);
  const rows = useMemo(
    () => execute({ metrics: ["requests"] }, SAMPLE),
    [],
  );

  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Full / exercise-2 starter (Result)</p>
      <p className="text-[var(--muted)]">
        Change <code>parseCatalogQuery</code> / domain failures to return{" "}
        <code>Result</code> instead of throwing for unknown keys.
      </p>
      <pre className="text-xs">{JSON.stringify(rows)}</pre>
      <button
        type="button"
        className="rounded border border-[var(--border)] px-2 py-1"
        onClick={() => {
          try {
            parseCatalogQuery({ metrics: ["requests"], nope: 1 });
            setMsg("unexpected success");
          } catch (e) {
            setMsg(e instanceof Error ? e.message : String(e));
          }
        }}
      >
        Try unknown key
      </button>
      {msg ? <p className="text-red-400">{msg}</p> : null}
    </div>
  );
}
