import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/lib/admin/auth";
import { Button } from "@/components/ui/button";
import { Boxes, LayoutGrid, LogOut, Package, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Lelo's Home" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: LayoutGrid },
  { to: "/admin/kits", label: "Kits", icon: Boxes },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
] as const;

function AdminLayout() {
  const { initialized, isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !isAuthenticated) navigate({ to: "/admin/login" });
  }, [initialized, isAuthenticated, navigate]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-6 py-5">
          <p className="font-serif text-xl text-primary">Lelo's Home</p>
          <p className="text-xs text-muted-foreground">Administração</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-secondary"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile nav) */}
        <header className="flex items-center gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 md:hidden">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-foreground/70"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
            >
              {label}
            </Link>
          ))}
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
