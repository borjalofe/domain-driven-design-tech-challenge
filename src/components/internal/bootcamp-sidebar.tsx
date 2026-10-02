import { Link } from "@tanstack/react-router";
import { navigationData } from "./navigation-data";
import { exerciseKey, useBootcampStore } from "@/stores/bootcamp-store";
import { cn } from "@/lib/cn";

export function BootcampSidebar() {
  const completed = useBootcampStore((s) => s.completed);

  return (
    <aside className="w-72 shrink-0 border-r border-[var(--border)] bg-[var(--panel)] p-4 overflow-y-auto">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
        Curriculum
      </p>
      {navigationData.map((day) => (
        <div key={day.id} className="mb-6">
          <h2 className="font-semibold mb-2">{day.title}</h2>
          <ul className="space-y-1 text-sm">
            {day.exercises.map((ex) => {
              const to =
                ex.type === "homework"
                  ? `/bootcamp/homework/${day.id}`
                  : `/bootcamp/challenge/${day.id}/${ex.id}`;
              const key = exerciseKey(day.id, ex.id);
              const done = !!completed[key];
              return (
                <li key={ex.id}>
                  <Link
                    to={to}
                    className={cn(
                      "block rounded px-2 py-1.5 no-underline text-[var(--fg)] hover:bg-[var(--border)]/40",
                    )}
                    activeProps={{ className: "bg-[var(--border)]/50 font-medium" }}
                  >
                    {done ? "✓ " : ""}
                    {ex.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
