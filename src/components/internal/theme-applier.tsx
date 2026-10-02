import { useEffect } from "react";
import { useBootcampStore, type ThemeMode } from "@/stores/bootcamp-store";

function resolveTheme(theme: ThemeMode): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function ThemeApplier() {
  const theme = useBootcampStore((s) => s.theme);

  useEffect(() => {
    const apply = () => {
      const mode = resolveTheme(theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(mode);
    };
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
