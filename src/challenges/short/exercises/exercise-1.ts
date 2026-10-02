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

/**
 * Starter: implement in-memory aggregation for short.
 * Support eq filters only. Do not mutate `events`.
 */
export function execute(
  _query: CatalogQuery,
  _events: ServiceEvent[],
): Record<string, unknown>[] {
  // TODO: implement
  throw new Error("execute not implemented");
}
