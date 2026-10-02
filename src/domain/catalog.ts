import type { EventType } from "./types";

export type CountMetric = {
  label: string;
  kind: "count";
  eventType: EventType;
};

export type RateMetric = {
  label: string;
  kind: "rate";
  numerator: string;
  denominator: string;
};

export type MetricDef = CountMetric | RateMetric;

export const metrics = {
  requests: {
    label: "Requests",
    kind: "count",
    eventType: "request",
  },
  errors: {
    label: "Errors",
    kind: "count",
    eventType: "error",
  },
  alerts: {
    label: "Alerts",
    kind: "count",
    eventType: "alert",
  },
  error_rate: {
    label: "Error rate",
    kind: "rate",
    numerator: "errors",
    denominator: "requests",
  },
  alert_rate: {
    label: "Alert rate",
    kind: "rate",
    numerator: "alerts",
    denominator: "requests",
  },
} as const satisfies Record<string, MetricDef>;

export type MetricKey = keyof typeof metrics;

export type DimensionDef = {
  label: string;
  field: "service_id" | "host_id" | "env" | "date";
};

export const dimensions = {
  service: { label: "Service", field: "service_id" },
  host: { label: "Host", field: "host_id" },
  env: { label: "Environment", field: "env" },
  date: { label: "Date", field: "date" },
} as const satisfies Record<string, DimensionDef>;

export type DimensionKey = keyof typeof dimensions;

export function isMetricKey(key: string): key is MetricKey {
  return Object.prototype.hasOwnProperty.call(metrics, key);
}

export function isDimensionKey(key: string): key is DimensionKey {
  return Object.prototype.hasOwnProperty.call(dimensions, key);
}
