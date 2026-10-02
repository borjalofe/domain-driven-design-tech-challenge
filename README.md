# Domain-Driven Design Technical Challenge

Self-paced bootcamp (short ~45–60 min + full continuation) for practicing how to face a technical interview: read the brief, scope, TDD a pure domain, keep UI thin, and talk about trade-offs.

The workshop is inspired by the *shape* of a platform-engineering take-home (typed metrics catalog → request → validated aggregation → UI). The domain, wording, and code here are original.

## Quick start

```bash
pnpm install
pnpm dev
```

Open `/bootcamp`. Instructor mode: `/bootcamp?instructor=1` (hides Show Solution).

## Tracks

| Track | Role |
|-------|------|
| **short** | Timed path: read the brief, red→green on the catalog core (`.ts`) |
| **full** | Continues from short: extract domain, internal API, `Result`, richer UI |
| **homework** | Outside the timed script (SQL/Express/CI stretch) |

Do **not** open `src/domain` or the `/` playground until you finish the track — see `AGENTS.md`.

## Scripts

| Script | Expectation |
|--------|-------------|
| `pnpm test` | Green (domain reference + solutions) |
| `pnpm test:starters` | Red on unfinished starters (by design) |
| `pnpm generate:events` | Regenerate `data/service-events.csv` (Faker, fixed seed) |

## License

Apache-2.0
