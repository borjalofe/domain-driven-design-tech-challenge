import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeApplier } from "@/components/internal/theme-applier";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeApplier />
      <Outlet />
    </>
  ),
});
