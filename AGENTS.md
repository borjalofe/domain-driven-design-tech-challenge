# AGENTS.md

## Layers

| Path | Role |
|------|------|
| `src/challenges/*/exercises/*` | **Student work** |
| `src/challenges/*/solutions/*` | Reference solutions (Show Solution) |
| `src/domain` | Instructor reference domain for `/` |
| Bootcamp UI | `/bootcamp` shell |

Short track code lives in `.ts` modules (no live UI). Full track uses `.tsx`.

## Spoiler policy

Do **not** open `src/domain` or the playground route `/` while working through **short** or **full**, until you finish the track (Mark Complete on the last full exercise).

## Instructor mode

- Query `?instructor=1` overrides the persisted switch (hides Show Solution).
- Chrome switch also toggles instructor mode when the query is absent.

## Animation

Framer **S1**: route/panel transitions only. Mark Complete / Show Solution are **not** animated yet (S2 deferred).
