import { describe, expect, it } from "vitest";
import { execute, parseCatalogQuery, type ServiceEvent } from "./exercise-2-end";

const sample: ServiceEvent[] = [
  {
    event_id: "e1",
    service_id: "svc_api",
    host_id: "host_a",
    env: "prod",
    event_type: "request",
    occurred_at: "2026-09-01T10:00:00.000Z",
  },
];

describe("full/exercise-2 solution", () => {
  it("returns ok:false for unknown keys", () => {
    const r = parseCatalogQuery({ metrics: ["requests"], unexpected: true });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("unknown_key");
  });

  it("returns ok:true and execute rows", () => {
    const parsed = parseCatalogQuery({ metrics: ["requests"] });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const rows = execute(parsed.value, sample);
    expect(rows.ok).toBe(true);
    if (rows.ok) expect(rows.value).toEqual([{ requests: 1 }]);
  });
});
