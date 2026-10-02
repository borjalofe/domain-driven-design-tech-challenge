const TODOS = [
  "SQL / toSql parallel to in-memory execute",
  "Express POST /query with parse → execute",
  "SQLite (or similar) backing store for the CSV seed",
  "CI: pnpm test on PR; optional seed regen check",
  "Richer filter UI (multi-filter list, date pickers)",
];

export default function Exercise4() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">Full / exercise-4 starter</p>
      <p className="text-[var(--muted)]">
        List honest TODOs you would leave on the table in an interview.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {TODOS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
