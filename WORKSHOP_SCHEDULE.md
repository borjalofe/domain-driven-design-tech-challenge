# Workshop schedule

## Short (~45–60 minutes) — portfolio / rehearsal path

| Block | Minutes | Activity |
|-------|---------|----------|
| Setup | 5 | `pnpm install` / `pnpm dev` / open `/bootcamp?instructor=1` |
| Ex0 | 10 | Read brief, scope in/out, interviewer questions |
| Ex1 | 30–40 | TDD `CatalogQuery` core with `eq` (`pnpm test:starters`) |
| Buffer | 5 | Mark complete / recap seniority signals |

Homework for short is **outside** this timed block.

## Full — continue as far as you can

Requires short done. Starters continue from short solutions (authored end-state).

| Exercise | Focus |
|----------|--------|
| 0 | Extract pure domain (display table) |
| 1 | Separate catalog / parse / execute |
| 2 | `Result` for domain failures |
| 3 | UI: table + filters (`eq`/`in`/`gte`/`lte`/`neq`) |
| 4 | Trade-offs / TODOs |

Homework: Express / SQLite / `toSql` / CI — see `src/challenges/homework/`.

## Quality bar

- Never mutate catalog or seed arrays; return new result rows
- Talk trade-offs out loud
- No peeking at `src/domain` / `/` until the track is done
