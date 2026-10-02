import type { Day } from "@/types/challenge";

export const navigationData: Day[] = [
  {
    id: "short",
    title: "Short (~45–60 min)",
    exercises: [
      { id: "exercise-0", title: "0 · Read & scope the brief", type: "reading" },
      { id: "exercise-1", title: "1 · CatalogQuery core (eq)", type: "exercise" },
      { id: "homework", title: "Homework (outside talk)", type: "homework" },
    ],
  },
  {
    id: "full",
    title: "Full (continue)",
    exercises: [
      { id: "exercise-0", title: "0 · Extract pure domain (display)", type: "exercise" },
      { id: "exercise-1", title: "1 · Separate catalog / parse / execute", type: "exercise" },
      { id: "exercise-2", title: "2 · Result for domain failures", type: "exercise" },
      { id: "exercise-3", title: "3 · UI table + filters", type: "exercise" },
      { id: "exercise-4", title: "4 · Trade-offs + TODOs", type: "exercise" },
      { id: "homework", title: "Homework (Express / SQL / CI)", type: "homework" },
    ],
  },
];
