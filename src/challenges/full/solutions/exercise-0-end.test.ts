import { describe, expect, it } from "vitest";
import { execute, metrics, type ServiceEvent } from "./exercise-0-end";

const sample: ServiceEvent[] = [
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

describe("full/exercise-0 solution", () => {
  it("exports metrics catalog", () => {
    expect(metrics.requests.kind).toBe("count");
    expect(metrics.error_rate.kind).toBe("rate");
  });

  it("runs execute", () => {
    const rows = execute(
      {
        metrics: ["requests", "errors"],
        dimensions: ["service"],
        filters: [{ dimension: "env", op: "eq", value: "prod" }],
      },
      sample,
    );
    expect(rows).toEqual([{ service: "svc_api", requests: 1, errors: 1 }]);
  });
});
