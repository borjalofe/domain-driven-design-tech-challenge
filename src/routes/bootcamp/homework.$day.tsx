import { createFileRoute } from "@tanstack/react-router";
import { MarkdownRenderer } from "@/components/internal/markdown-renderer";

export const Route = createFileRoute("/bootcamp/homework/$day")({
  component: HomeworkPage,
});

const homeworkModules = import.meta.glob("../../challenges/homework/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function HomeworkPage() {
  const { day } = Route.useParams();
  const key = Object.keys(homeworkModules).find((k) =>
    k.endsWith(`/${day}-homework.md`),
  );
  const source = key ? homeworkModules[key]! : "_Missing homework file._";
  return (
    <article className="max-w-3xl rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <MarkdownRenderer source={source} />
    </article>
  );
}
