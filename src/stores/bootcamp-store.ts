import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";

type BootcampState = {
  completed: Record<string, boolean>;
  revealed: Record<string, boolean>;
  instructorMode: boolean;
  theme: ThemeMode;
  toggleCompleted: (key: string) => void;
  toggleRevealed: (key: string) => void;
  setInstructorMode: (value: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
};

export function exerciseKey(day: string, exercise: string) {
  return `${day}/${exercise}`;
}

export const useBootcampStore = create<BootcampState>()(
  persist(
    (set) => ({
      completed: {},
      revealed: {},
      instructorMode: false,
      theme: "system",
      toggleCompleted: (key) =>
        set((s) => ({
          completed: { ...s.completed, [key]: !s.completed[key] },
        })),
      toggleRevealed: (key) =>
        set((s) => ({
          revealed: { ...s.revealed, [key]: !s.revealed[key] },
        })),
      setInstructorMode: (value) => set({ instructorMode: value }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "domain-driven-design-tech-challenge-bootcamp" },
  ),
);
