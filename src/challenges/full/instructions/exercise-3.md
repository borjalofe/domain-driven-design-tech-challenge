# Full / exercise 3 — UI table + filters

Build controls that each change one part of `CatalogQuery`:

- Metrics (select / multi)
- Dimensions (group-by)
- Filter: dimension + op + value

Ops: `eq` | `in` | `gte` | `lte` | `neq`

One action per control — no multi-step wizards. Table re-renders from `execute`.
