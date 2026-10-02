# Coding steps — short / exercise 1

1. Export a `ServiceEvent` type and a thin `CatalogQuery` type (`metrics`, optional `dimensions` / `filters` / `limit`).
2. Stub `execute` so the first test fails for the right reason.
3. Green the **count requests by service** case with `eq` on `env`.
4. Add `error_rate` as `errors / requests` inside each group (0 when denominator is 0).
5. Make empty `metrics` fail (throw is fine here).
6. Re-run `pnpm test:starters` until green for this file.
7. Say out loud one invariant you relied on (e.g. "rows are new objects").
