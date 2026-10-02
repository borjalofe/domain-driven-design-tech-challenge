import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bootcamp/")({
  component: BootcampHome,
});

function BootcampHome() {
  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Pick a track</h2>
      <p className="text-sm text-[var(--muted)]">
        Do <strong>short</strong> first (~45 minutes). Then continue with{" "}
        <strong>full</strong> as far as you can. Do not peek{" "}
        <code>src/domain</code> or <code>/</code> until you finish the track.
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <Link to="/bootcamp/challenge/$day/$exercise" params={{ day: "short", exercise: "exercise-0" }}>
            Start short →
          </Link>
        </li>
        <li>
          <Link to="/bootcamp/challenge/$day/$exercise" params={{ day: "full", exercise: "exercise-0" }}>
            Start full →
          </Link>
        </li>
      </ul>
    </div>
  );
}
