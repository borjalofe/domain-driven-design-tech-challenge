# Full / exercise 1 — Separate catalog / parse / execute

The starter is monolithic. Split responsibilities with clear names:

| Export | Job |
|--------|-----|
| `metrics` / `dimensions` | Catalog descriptors (`as const`) |
| `parseCatalogQuery` | Shape validation; reject unknown keys |
| `execute` | Aggregation only on a typed `CatalogQuery` |

You can keep everything in one file as long as the seams are obvious. Solution shows a clean split.
