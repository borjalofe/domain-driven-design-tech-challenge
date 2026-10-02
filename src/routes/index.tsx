import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  execute,
  loadEventsFromCsv,
  parseCatalogQuery,
  type CatalogQuery,
} from "@/domain";
import csvRaw from "../../data/service-events.csv?raw";

export const Route = createFileRoute("/")({
  component: PlaygroundPage,
});

const PRESETS: { label: string; query: CatalogQuery }[] = [
  {
    label: "Requests by service (prod)",
    query: {
      metrics: ["requests", "errors", "error_rate"],
      dimensions: ["service"],
      filters: [{ dimension: "env", op: "eq", value: "prod" }],
      limit: 20,
    },
  },
  {
    label: "Alerts by host",
    query: {
      metrics: ["alerts", "alert_rate"],
      dimensions: ["host"],
      limit: 20,
    },
  },
  {
    label: "Errors in staging|dev (in)",
    query: {
      metrics: ["errors", "requests"],
      dimensions: ["env", "service"],
      filters: [
        { dimension: "env", op: "in", value: ["staging", "dev"] },
      ],
      limit: 30,
    },
  },
];

function PlaygroundPage() {
  const events = useMemo(() => loadEventsFromCsv(csvRaw), []);
  const [presetIndex, setPresetIndex] = useState(0);

  const { rows, error } = useMemo(() => {
    const parsed = parseCatalogQuery(PRESETS[presetIndex]!.query);
    if (!parsed.ok) {
      return {
        rows: [] as Record<string, unknown>[],
        error: `${parsed.error.code}: ${parsed.error.message}`,
      };
    }
    const result = execute(parsed.value, events);
    if (!result.ok) {
      return {
        rows: [] as Record<string, unknown>[],
        error: `${result.error.code}: ${result.error.message}`,
      };
    }
    return { rows: result.value, error: null as string | null };
  }, [events, presetIndex]);

  const columns = Object.keys(rows[0] ?? {});

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="rounded border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm">
        Instructor reference / spoiler. Do not open during short/full until you
        finish the track — see <code>AGENTS.md</code>.
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Telemetry catalog playground
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Loads <code>data/service-events.csv</code> ({events.length} events)
            and runs sample <code>CatalogQuery</code>s via{" "}
            <code>src/domain</code>.
          </p>
        </div>
        <Link to="/bootcamp" className="text-sm">
          Open bootcamp →
        </Link>
      </header>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 space-y-3">
        <label className="flex flex-col gap-1 text-sm max-w-md">
          Sample query
          <select
            className="rounded border border-[var(--border)] bg-transparent px-2 py-1"
            value={presetIndex}
            onChange={(e) => setPresetIndex(Number(e.target.value))}
          >
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <pre className="overflow-x-auto rounded bg-black/20 p-3 text-xs">
          {JSON.stringify(PRESETS[presetIndex]!.query, null, 2)}
        </pre>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {columns.map((k) => (
                  <th key={k} className="py-1 pr-3 font-medium">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  {columns.map((k) => (
                    <td key={k} className="py-1 pr-3 tabular-nums">
                      {String(row[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
