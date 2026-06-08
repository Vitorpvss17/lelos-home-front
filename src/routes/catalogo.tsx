import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { getProducts, getCategories } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Category, OfferType } from "@/lib/types";

const searchSchema = z.object({
  categoria: z.string().optional().catch(undefined),
  tipo: z.enum(["aluguel", "venda"]).optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Catálogo — Lelo's Home" },
      { name: "description", content: "Explore a coleção de peças para mesa posta: aluguel e venda." },
      { property: "og:title", content: "Catálogo — Lelo's Home" },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q ?? "");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const selectedCat = (search.categoria ?? null) as Category | null;
  const selectedType = (search.tipo ?? null) as OfferType | null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (selectedCat && p.category !== selectedCat) return false;
      if (selectedType && !p.offerTypes.includes(selectedType)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [products, query, selectedCat, selectedType]);

  const setCat = (c: Category | null) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, categoria: c ?? undefined }) });
  const setType = (t: OfferType | null) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, tipo: t ?? undefined }) });

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-secondary/50 py-12">
        <div className="container-x">
          <p className="eyebrow">Catálogo</p>
          <h1 className="mt-2 font-serif text-4xl text-primary sm:text-5xl">
            Cada peça, um detalhe que importa
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Explore a coleção. Filtre por categoria, escolha entre aluguel ou compra
            e adicione ao seu kit. Finalizamos juntos pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-x">
          {/* Filters */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar peça..."
                  className="pl-9"
                />
              </div>
              <div className="inline-flex rounded-full bg-secondary p-0.5 text-xs">
                {(
                  [
                    { v: null, label: "Todos" },
                    { v: "aluguel", label: "Aluguel" },
                    { v: "venda", label: "Compra" },
                  ] as { v: OfferType | null; label: string }[]
                ).map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setType(t.v)}
                    className={`rounded-full px-4 py-1.5 font-medium transition ${
                      selectedType === t.v
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
              <button
                onClick={() => setCat(null)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  !selectedCat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-accent"
                }`}
              >
                Todas categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCat(c.value)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    selectedCat === c.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/70 hover:border-accent"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="mt-10">
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-14 text-center">
                <p className="font-serif text-2xl text-primary">Nada encontrado por aqui</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajuste os filtros ou explore outras categorias.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
