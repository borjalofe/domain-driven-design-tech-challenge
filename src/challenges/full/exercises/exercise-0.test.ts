import { describe, expect, it } from "vitest";
import { execute, type ServiceEvent } from "./exercise-0";

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

describe("full/exercise-0 starter", () => {
  it("still runs short-level execute (eq)", () => {
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

  // Intentionally red: student should extract a named catalog before claiming "done".
  it("exports a metrics catalog object", async () => {
    const mod = await import("./exercise-0");
    expect(
      "metrics" in mod && typeof (mod as { metrics?: unknown }).metrics === "object",
    ).toBe(true);
  });
});
