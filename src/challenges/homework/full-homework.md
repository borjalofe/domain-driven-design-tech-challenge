# Full homework (outside the timed path)

Continue from the full track when you have a quiet evening.

1. **toSql** — emit parameterized SQL from the same `CatalogQuery`. Golden-test a few queries against the in-memory rows (same numbers, different engine).
2. **Express + SQLite** — `POST /query` that parses JSON, returns `Result` errors as 400, and runs either SQL or the in-memory engine behind a switch.
3. **CI** — GitHub Action: `pnpm install`, `pnpm typecheck`, `pnpm test`. Do not fail the pipeline on `pnpm test:starters` (starters are red by design).
4. **UI stretch** — multi-filter list editor. Keep "one action per control" — adding a filter is one action; editing a row is another.
