import { describe, expect, it } from "vitest";
import { parseCatalogQuery } from "./exercise-2";

describe("full/exercise-2 starter", () => {
  it("parseCatalogQuery returns Result with ok:false for unknown keys", () => {
    const r = parseCatalogQuery({ metrics: ["requests"], unexpected: true }) as {
      ok?: boolean;
      error?: { code: string };
    };
    expect(r).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({ code: "unknown_key" }),
      }),
    );
  });

  it("parseCatalogQuery returns Result with ok:true for valid input", () => {
    const r = parseCatalogQuery({ metrics: ["requests"] }) as {
      ok?: boolean;
      value?: { metrics: string[] };
    };
    expect(r).toEqual(
      expect.objectContaining({
        ok: true,
        value: expect.objectContaining({ metrics: ["requests"] }),
      }),
    );
  });
});
