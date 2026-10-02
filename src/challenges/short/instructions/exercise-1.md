# Exercise 1 — CatalogQuery core (`eq`)

Implement a minimal in-memory `execute(query, events)` that:

1. Supports metrics `requests`, `errors`, `alerts`, `error_rate` (and `alert_rate` if you have time)
2. Groups by the listed `dimensions` (start with `service`)
3. Applies filters with op **`eq` only**
4. Does **not** mutate the `events` array
5. Returns **new** row objects

Empty `metrics` may throw (short track). Unknown keys can throw too — `Result` comes later in full.

Work in `src/challenges/short/exercises/exercise-1.ts`.

Run:

```bash
pnpm test:starters
```

Turn red tests green. When stuck, compare with Show Solution (student mode) after you have a first attempt.
