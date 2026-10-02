import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ source }: { source: string }) {
  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed [&_code]:rounded [&_code]:bg-black/20 [&_code]:px-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
