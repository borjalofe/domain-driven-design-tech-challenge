# Short homework (outside the timed block)

Stretch goals after the ~45–60 minute path. Do these on your own time.

1. Sketch a `toSql(query)` that emits a parameterized SELECT from the same `CatalogQuery` shape. You do not need a live database yet — assert on the string + params.
2. Mentally place that SQL behind a tiny Express route (`POST /query`) that returns JSON rows. Note where validation lives (parse before execute).
3. Add a CI job idea: `pnpm test` on PR, and optionally regenerate the CSV only when the seed script changes.
4. Write two interviewer questions you wish you had asked in exercise-0 about rates vs counts.
