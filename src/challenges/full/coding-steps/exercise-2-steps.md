# Coding steps — full / exercise 2

1. Add `Result<T>` to the module.
2. Change `parseCatalogQuery` to return `Result<CatalogQuery>`.
3. Map unknown keys to `code: "unknown_key"`.
4. Update the UI button to branch on `ok` instead of try/catch.
5. Optionally wrap `execute` in `Result` too (empty metrics).
