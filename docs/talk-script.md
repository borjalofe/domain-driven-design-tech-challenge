# Talk script (EN) — ~45–60 minutes

Narration language for the live room may be Spanish; this script stays EN for the repo.

Use: **portfolio recording** or **internal rehearsal** of how to face a technical challenge (not a product demo).

## Setup (before audience)

- `pnpm install && pnpm dev`
- Open `/bootcamp/challenge/short/exercise-0?instructor=1`

## Minute 0–5 — Frame

- This is how to **read** a tech challenge, not how to finish a metrics platform.
- Repo: Domain-Driven Design Technical Challenge — typed metrics catalog over service telemetry.
- Instructor mode on: no Show Solution.

## Minute 5–15 — Exercise 0

- Walk the brief: `ServiceEvent`, catalog metrics, `CatalogQuery`, in-memory aggregation.
- Ask aloud: done criteria, time box, which filter ops, rates vs counts?
- Write 2–3 interviewer questions on a pad.
- Draw a hard in/out line for ~45 minutes.

## Minute 15–50 — Exercise 1

- Start from red tests (`pnpm test:starters`).
- Green the smallest count-by-service + `eq` on `env`.
- Add `error_rate` inside the group.
- Name invariants: seed untouched, new row objects, empty metrics fails loudly.

## Minute 50–60 — Close

- What you would leave as TODO (SQL, Express, richer filters).
- Point to `full` track + homework for after the session.
- Q&A.
