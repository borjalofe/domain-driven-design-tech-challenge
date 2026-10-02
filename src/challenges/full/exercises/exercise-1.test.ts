import { describe, expect, it } from "vitest";
import * as mod from "./exercise-1";

describe("full/exercise-1 starter", () => {
  it("exports a metrics catalog named metrics", () => {
    expect("metrics" in mod).toBe(true);
    expect(typeof (mod as { metrics?: unknown }).metrics).toBe("object");
  });

  it("exports parseCatalogQuery and execute", () => {
    expect(typeof mod.parseCatalogQuery).toBe("function");
    expect(typeof mod.execute).toBe("function");
  });

  it("parse rejects unknown keys", () => {
    expect(() =>
      mod.parseCatalogQuery({ metrics: ["requests"], unexpected: true }),
    ).toThrow();
  });
});
