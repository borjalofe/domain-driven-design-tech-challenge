import { describe, expect, it } from "vitest";
import { parseCatalogQuery } from "./parse";

describe("parseCatalogQuery", () => {
  it("accepts a minimal valid query", () => {
    const r = parseCatalogQuery({ metrics: ["requests"] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual({ metrics: ["requests"] });
    }
  });

  it("rejects unknown query keys", () => {
    const r = parseCatalogQuery({ metrics: ["requests"], foo: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("unknown_key");
    }
  });

  it("rejects unknown filter keys", () => {
    const r = parseCatalogQuery({
      metrics: ["requests"],
      filters: [{ dimension: "env", op: "eq", value: "prod", extra: true }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("unknown_key");
    }
  });

  it("parses filters and limit", () => {
    const r = parseCatalogQuery({
      metrics: ["errors", "error_rate"],
      dimensions: ["service"],
      filters: [
        { dimension: "env", op: "eq", value: "prod" },
        { dimension: "service", op: "in", value: ["svc_api", "svc_web"] },
      ],
      limit: 10,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.filters).toHaveLength(2);
      expect(r.value.limit).toBe(10);
    }
  });

  it("rejects non-object input", () => {
    const r = parseCatalogQuery("nope");
    expect(r.ok).toBe(false);
  });
});
