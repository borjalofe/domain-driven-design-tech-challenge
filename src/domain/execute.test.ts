import { describe, expect, it } from "vitest";
import { execute } from "./execute";
import type { ServiceEvent } from "./types";

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
  {
    event_id: "e5",
    service_id: "svc_api",
    host_id: "host_a",
    env: "prod",
    event_type: "alert",
    occurred_at: "2026-09-01T13:00:00.000Z",
  },
];

describe("execute", () => {
  it("counts requests by service with eq filter on env", () => {
    const r = execute(
      {
        metrics: ["requests"],
        dimensions: ["service"],
        filters: [{ dimension: "env", op: "eq", value: "prod" }],
      },
      sample,
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual([{ service: "svc_api", requests: 2 }]);
    }
  });

  it("computes error_rate without mutating events", () => {
    const freeze = structuredClone(sample);
    const r = execute(
      {
        metrics: ["error_rate"],
        dimensions: ["service"],
        filters: [{ dimension: "env", op: "eq", value: "prod" }],
      },
      sample,
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value[0]).toEqual({ service: "svc_api", error_rate: 0.5 });
    }
    expect(sample).toEqual(freeze);
  });

  it("returns new row objects", () => {
    const r = execute({ metrics: ["requests"] }, sample);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value[0]).toEqual({ requests: 3 });
      expect(r.value[0]).not.toBe(sample[0]);
    }
  });

  it("supports in / neq / gte / lte filters", () => {
    const inR = execute(
      {
        metrics: ["requests"],
        filters: [
          { dimension: "service", op: "in", value: ["svc_web", "svc_db"] },
        ],
      },
      sample,
    );
    expect(inR.ok && inR.value[0]).toEqual({ requests: 1 });

    const neq = execute(
      {
        metrics: ["requests"],
        filters: [{ dimension: "env", op: "neq", value: "prod" }],
      },
      sample,
    );
    expect(neq.ok && neq.value[0]).toEqual({ requests: 1 });

    const gte = execute(
      {
        metrics: ["requests"],
        filters: [{ dimension: "date", op: "gte", value: "2026-09-02" }],
      },
      sample,
    );
    expect(gte.ok && gte.value[0]).toEqual({ requests: 1 });

    const lte = execute(
      {
        metrics: ["alerts"],
        filters: [{ dimension: "date", op: "lte", value: "2026-09-01" }],
      },
      sample,
    );
    expect(lte.ok && lte.value[0]).toEqual({ alerts: 1 });
  });

  it("applies limit", () => {
    const r = execute(
      {
        metrics: ["requests"],
        dimensions: ["service"],
        limit: 1,
      },
      sample,
    );
    expect(r.ok && r.value).toHaveLength(1);
  });

  it("fails on empty metrics", () => {
    const r = execute({ metrics: [] }, sample);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("empty_metrics");
  });

  it("fails on unknown metric or dimension", () => {
    expect(execute({ metrics: ["nope"] }, sample).ok).toBe(false);
    expect(
      execute({ metrics: ["requests"], dimensions: ["nope"] }, sample).ok,
    ).toBe(false);
  });
});
