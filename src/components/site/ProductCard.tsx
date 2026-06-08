import type { Product, OfferType } from "@/lib/types";
import { fmtBRL } from "@/lib/format";
import { useKit } from "@/hooks/use-kit";
import { useState } from "react";
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useKit();
  const canRent = product.offerTypes.includes("aluguel");
  const canBuy = product.offerTypes.includes("venda");
  const defaultOffer: OfferType = canRent ? "aluguel" : "venda";
  const [offer, setOffer] = useState<OfferType>(defaultOffer);

  const price = offer === "aluguel" ? product.priceAluguel : product.priceVenda;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${product.palette[0]} 0%, ${product.palette[1]} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }}
        />
        <div className="absolute inset-0 flex items-end p-5">
          <span className="font-serif text-2xl text-white/95 leading-tight drop-shadow-sm">
            {product.name}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          {product.offerTypes.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
            >
              {t === "aluguel" ? "Aluguel" : "Venda"}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="eyebrow text-[10px]">{product.categoryName}</p>
          <h3 className="mt-1 font-serif text-xl text-primary">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        {canRent && canBuy && (
          <div className="flex rounded-full bg-secondary p-0.5 text-xs">
            <button
              onClick={() => setOffer("aluguel")}
              className={`flex-1 rounded-full py-1.5 font-medium transition ${
                offer === "aluguel" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Aluguel
            </button>
            <button
              onClick={() => setOffer("venda")}
              className={`flex-1 rounded-full py-1.5 font-medium transition ${
                offer === "venda" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Compra
            </button>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {offer === "aluguel" ? "Aluguel / un." : "Compra"}
            </p>
            <p className="font-serif text-2xl text-primary">{price ? fmtBRL(price) : "—"}</p>
          </div>
          <button
            onClick={() => add(product, offer, 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus className="size-3.5" /> Adicionar ao kit
          </button>
        </div>
      </div>
    </article>
  );
}
