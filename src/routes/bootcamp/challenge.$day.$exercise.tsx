import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChallengeLoader } from "@/components/internal/challenge-loader";
import { MarkdownRenderer } from "@/components/internal/markdown-renderer";
import { navigationData } from "@/components/internal/navigation-data";
import { exerciseKey, useBootcampStore } from "@/stores/bootcamp-store";

export const Route = createFileRoute("/bootcamp/challenge/$day/$exercise")({
  component: ChallengePage,
});

const instructionModules = import.meta.glob(
  "../../challenges/*/instructions/*.md",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const stepModules = import.meta.glob(
  "../../challenges/*/coding-steps/*.md",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

function loadMd(
  map: Record<string, string>,
  day: string,
  file: string,
): string | null {
  const key = Object.keys(map).find((k) => k.endsWith(`/${day}/${file}`));
  return key ? map[key]! : null;
}

function ChallengePage() {
  const { day, exercise } = Route.useParams();
  const instructorMode = useBootcampStore((s) => s.instructorMode);

  const completed = useBootcampStore((s) => s.completed);
  const revealed = useBootcampStore((s) => s.revealed);
  const toggleCompleted = useBootcampStore((s) => s.toggleCompleted);
  const toggleRevealed = useBootcampStore((s) => s.toggleRevealed);

  const key = exerciseKey(day, exercise);
  const meta = navigationData
    .find((d) => d.id === day)
    ?.exercises.find((e) => e.id === exercise);
  const isReading = meta?.type === "reading";

  const instructions =
    loadMd(instructionModules, day, `instructions/${exercise}.md`) ??
    "_No instructions file._";
  const steps = loadMd(
    stepModules,
    day,
    `coding-steps/${exercise}-steps.md`,
  );

  const showSolution = !instructorMode && !!revealed[key];
  const [panel, setPanel] = useState<"instructions" | "steps">("instructions");

  useEffect(() => {
    setPanel("instructions");
  }, [day, exercise]);

  const hasCode = !isReading && Boolean(steps);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            className={panel === "instructions" ? "font-semibold" : ""}
            onClick={() => setPanel("instructions")}
          >
            Instructions
          </button>
          {hasCode ? (
            <button
              type="button"
              className={panel === "steps" ? "font-semibold" : ""}
              onClick={() => setPanel("steps")}
            >
              Coding steps
            </button>
          ) : null}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={panel + day + exercise}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <MarkdownRenderer
              source={panel === "steps" && steps ? steps : instructions}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            className="rounded border border-[var(--border)] px-3 py-1.5 text-sm"
            onClick={() => toggleCompleted(key)}
          >
            {completed[key] ? "Marked complete" : "Mark complete"}
          </button>
          {!instructorMode && !isReading ? (
            <button
              type="button"
              className="rounded border border-[var(--border)] px-3 py-1.5 text-sm"
              onClick={() => toggleRevealed(key)}
            >
              {showSolution ? "Hide solution" : "Show solution"}
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 min-h-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${day}-${exercise}-${showSolution}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isReading ? (
              <p className="text-sm text-[var(--muted)]">
                No live coding for this step.
              </p>
            ) : (
              <ChallengeLoader
                day={day}
                exercise={exercise}
                showSolution={showSolution}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
