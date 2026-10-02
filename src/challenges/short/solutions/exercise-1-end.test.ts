import { describe, expect, it } from "vitest";
import { execute, type ServiceEvent } from "./exercise-1-end";

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
    event_type: "request",
    occurred_at: "2026-09-01T11:00:00.000Z",
  },
  {
    event_id: "e3",
    service_id: "svc_api",
    host_id: "host_a",
    env: "prod",
    event_type: "error",
    occurred_at: "2026-09-01T12:00:00.000Z",
  },
  {
    event_id: "e4",
    service_id: "svc_web",
    host_id: "host_b",
    env: "staging",
    event_type: "request",
    occurred_at: "2026-09-02T10:00:00.000Z",
  },
];

describe("short/exercise-1 solution", () => {
  it("counts requests by service with eq filter on env", () => {
    const rows = execute(
      {
        metrics: ["requests"],
        dimensions: ["service"],
        filters: [{ dimension: "env", op: "eq", value: "prod" }],
      },
      sample,
    );
    expect(rows).toEqual([{ service: "svc_api", requests: 2 }]);
  });

  it("computes error_rate", () => {
    const rows = execute(
      {
        metrics: ["error_rate"],
        dimensions: ["service"],
        filters: [{ dimension: "env", op: "eq", value: "prod" }],
      },
      sample,
    );
    expect(rows).toEqual([{ service: "svc_api", error_rate: 0.5 }]);
  });

  it("throws on empty metrics", () => {
    expect(() => execute({ metrics: [] }, sample)).toThrow();
  });
});
