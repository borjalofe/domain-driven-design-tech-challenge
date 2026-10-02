# Full / exercise 2 — Result for domain failures

Replace throw-first validation with a discriminated `Result`:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: string; message: string } };
```

Unknown query keys → `{ ok: false, error: { code: "unknown_key", ... } }`.

UI should show the error without crashing. Parse stays separate from execute.
