import { describe, expect, it } from "vitest";
import {
  execute,
  metrics,
  parseCatalogQuery,
  type ServiceEvent,
} from "./exercise-1-end";

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

describe("full/exercise-1 solution", () => {
  it("exports catalog + parse + execute", () => {
    expect(metrics.requests.label).toBe("Requests");
    expect(parseCatalogQuery({ metrics: ["requests"] }).metrics).toEqual([
      "requests",
    ]);
    expect(execute({ metrics: ["requests"] }, sample)).toEqual([{ requests: 1 }]);
  });

  it("parse rejects unknown keys", () => {
    expect(() =>
      parseCatalogQuery({ metrics: ["requests"], unexpected: true }),
    ).toThrow(/Unknown query key/);
  });
});
