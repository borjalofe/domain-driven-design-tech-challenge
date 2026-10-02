import { useBootcampStore, type ThemeMode } from "@/stores/bootcamp-store";

export function ChromeControls({
  instructorFromQuery,
}: {
  instructorFromQuery: boolean | null;
}) {
  const theme = useBootcampStore((s) => s.theme);
  const setTheme = useBootcampStore((s) => s.setTheme);
  const instructorMode = useBootcampStore((s) => s.instructorMode);
  const setInstructorMode = useBootcampStore((s) => s.setInstructorMode);

  const effectiveInstructor =
    instructorFromQuery === null ? instructorMode : instructorFromQuery;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="flex items-center gap-2">
        Theme
        <select
          className="rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeMode)}
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={effectiveInstructor}
          disabled={instructorFromQuery !== null}
          onChange={(e) => setInstructorMode(e.target.checked)}
        />
        Instructor mode
        {instructorFromQuery !== null ? (
          <span className="text-[var(--muted)]">(from ?instructor=)</span>
        ) : null}
      </label>
    </div>
  );
}
