# Exercise 0 — Read & scope the brief

You are building a **metrics catalog** over service telemetry: request / error / alert events from a small fleet of services. Callers pick catalog keys (not raw SQL) and get aggregated rows back.

## Published shape

- Fact row: `ServiceEvent` with `event_id`, `service_id`, `host_id`, `env`, `event_type`, `occurred_at`
- `event_type`: `request` | `error` | `alert`
- Metrics (catalog keys): `requests`, `errors`, `alerts`, `error_rate`, `alert_rate`
- Dimensions: `service`, `host`, `env`, `date` (date comes from `occurred_at`)
- Request object: `CatalogQuery` — `metrics`, optional `dimensions`, `filters`, `limit`
- Short track filter op: **`eq` only**
- Aggregation is **in-memory** for this challenge (SQL is homework)
- Never mutate the seed / catalog arrays; always return **new** result rows

## Your job this step (~10 min)

1. List what is **in** / **out** for a ~45–60 minute interview slice.
2. Write 3 questions you would ask the interviewer before coding.
3. Do **not** open `src/domain` or `/` yet (see `AGENTS.md`).

### Starter prompts for in / out

| Likely in | Likely out for short |
|-----------|----------------------|
| Count metrics + one rate | Full filter ops (`in` / `gte` / …) |
| Group by one dimension | Express / SQLite / real SQL |
| `eq` filter on `env` | Polished UI, auth, pagination product |

Mark complete when you have answers written somewhere (notes file is fine).
