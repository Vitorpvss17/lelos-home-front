import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useKit } from "@/hooks/use-kit";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Kits" },
  { to: "/catalogo", label: "Aluguel", search: { tipo: "aluguel" } },
  { to: "/catalogo", label: "Venda", search: { tipo: "venda" } },
  { to: "/consultoria", label: "Consultoria" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const { totalItems, open } = useKit();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl tracking-tight text-primary">Lelo's Home</span>
          <span className="eyebrow mt-1 text-[10px]">Mesa Posta &amp; Curadoria</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              // @ts-expect-error search optional
              search={item.search}
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={open}
            aria-label="Abrir meu kit"
            className="relative inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm hover:border-accent hover:text-accent transition-all"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Meu kit</span>
            {totalItems > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="inline-flex lg:hidden size-10 items-center justify-center rounded-full border border-border text-primary"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border/60 transition-all duration-300",
          menuOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="container-x flex flex-col py-4">
          {NAV.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              // @ts-expect-error search optional
              search={item.search}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-base font-medium text-foreground/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
