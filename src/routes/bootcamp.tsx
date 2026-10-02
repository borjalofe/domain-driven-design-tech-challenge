import { Link, Outlet, createFileRoute, useSearch } from "@tanstack/react-router";
import { BootcampSidebar } from "@/components/internal/bootcamp-sidebar";
import { ChromeControls } from "@/components/internal/chrome-controls";
import { useBootcampStore } from "@/stores/bootcamp-store";
import { useEffect } from "react";

type BootcampSearch = { instructor?: string };

export const Route = createFileRoute("/bootcamp")({
  validateSearch: (search: Record<string, unknown>): BootcampSearch => ({
    instructor:
      typeof search.instructor === "string" ? search.instructor : undefined,
  }),
  component: BootcampLayout,
});

function BootcampLayout() {
  const search = useSearch({ from: "/bootcamp" });
  const setInstructorMode = useBootcampStore((s) => s.setInstructorMode);

  let instructorFromQuery: boolean | null = null;
  if (search.instructor === "1") instructorFromQuery = true;
  if (search.instructor === "0") instructorFromQuery = false;

  useEffect(() => {
    if (instructorFromQuery === null) return;
    setInstructorMode(instructorFromQuery);
  }, [instructorFromQuery, setInstructorMode]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-[var(--muted)]">
            ← Playground
          </Link>
          <h1 className="text-lg font-semibold">
            Domain-Driven Design Bootcamp
          </h1>
        </div>
        <ChromeControls instructorFromQuery={instructorFromQuery} />
      </header>
      <div className="flex flex-1 min-h-0">
        <BootcampSidebar />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
