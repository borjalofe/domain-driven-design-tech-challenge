import { Suspense, lazy, type ComponentType } from "react";

const modules = import.meta.glob([
  "../../challenges/*/exercises/exercise-*.tsx",
  "../../challenges/*/exercises/exercise-*.ts",
  "../../challenges/*/solutions/exercise-*-end.tsx",
  "../../challenges/*/solutions/exercise-*-end.ts",
  "!../../challenges/**/*.test.ts",
  "!../../challenges/**/*.test.tsx",
]);

type Resolved =
  | { kind: "tsx"; path: string }
  | { kind: "ts"; path: string }
  | null;

function resolvePath(day: string, exercise: string, solution: boolean): Resolved {
  const base = solution
    ? `../../challenges/${day}/solutions/${exercise}-end`
    : `../../challenges/${day}/exercises/${exercise}`;
  const tsx = `${base}.tsx`;
  const ts = `${base}.ts`;
  if (modules[tsx]) return { kind: "tsx", path: tsx };
  if (modules[ts]) return { kind: "ts", path: ts };
  return null;
}

function DomainModulePanel({
  path,
  showSolution,
}: {
  path: string;
  showSolution: boolean;
}) {
  const shortPath = path.replace("../../challenges/", "src/challenges/");
  if (showSolution) {
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Solution module loaded</p>
        <p className="text-[var(--muted)]">
          Compare <code>{shortPath}</code> with your starter.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Domain module (no live UI)</p>
      <p className="text-[var(--muted)]">
        Edit the <code>.ts</code> file and run <code>pnpm test:starters</code>.
      </p>
      <p className="text-[var(--muted)]">
        File: <code>{shortPath}</code>
      </p>
    </div>
  );
}

export function ChallengeLoader({
  day,
  exercise,
  showSolution,
}: {
  day: string;
  exercise: string;
  showSolution: boolean;
}) {
  const resolved = resolvePath(day, exercise, showSolution);

  if (!resolved) {
    const hint = showSolution
      ? `../../challenges/${day}/solutions/${exercise}-end.ts(x)`
      : `../../challenges/${day}/exercises/${exercise}.ts(x)`;
    return (
      <p className="text-sm text-[var(--muted)]">
        No live component for <code>{hint}</code>
      </p>
    );
  }

  if (resolved.kind === "ts") {
    return (
      <DomainModulePanel path={resolved.path} showSolution={showSolution} />
    );
  }

  const loader = modules[resolved.path] as () => Promise<{
    default: ComponentType;
  }>;
  const Lazy = lazy(loader);
  return (
    <Suspense fallback={<p className="text-sm">Loading challenge…</p>}>
      <Lazy />
    </Suspense>
  );
}
