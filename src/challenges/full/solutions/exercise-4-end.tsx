const TODOS = [
  {
    title: "toSql(query)",
    note: "Same CatalogQuery → parameterized SQL. Prove parity with a few golden tests.",
  },
  {
    title: "Express + SQLite",
    note: "POST /query: parse → Result → execute (or SQL). Keep validation before the DB.",
  },
  {
    title: "CI",
    note: "pnpm test + typecheck on PR. Do not regenerate CSV in CI unless the script changes.",
  },
  {
    title: "UI sequences",
    note: "Multi-filter editor and saved queries belong in homework, not the timed slice.",
  },
];

export default function Exercise4End() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Full / exercise-4 solution</p>
      <p className="text-[var(--muted)]">
        Trade-offs you can defend out loud — not a backlog dump.
      </p>
      <ul className="space-y-2">
        {TODOS.map((t) => (
          <li
            key={t.title}
            className="rounded border border-[var(--border)] px-3 py-2"
          >
            <p className="font-medium">{t.title}</p>
            <p className="text-[var(--muted)]">{t.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
