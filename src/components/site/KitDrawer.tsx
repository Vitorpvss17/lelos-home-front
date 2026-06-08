import { useKit } from "@/hooks/use-kit";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fmtBRL } from "@/lib/format";
import { createKitRequest } from "@/lib/api";
import type { KitItem } from "@/lib/types";

function Group({ title, items }: { title: string; items: KitItem[] }) {
  const { setQty, remove } = useKit();
  if (items.length === 0) return null;
  return (
    <div>
      <p className="eyebrow mb-3 text-[10px]">{title}</p>
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={`${i.productId}-${i.offerType}`}
            className="rounded-lg border border-border/70 bg-card p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-serif text-base text-primary truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.category}</p>
              </div>
              <button
                onClick={() => remove(i.productId, i.offerType)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  className="size-8 inline-flex items-center justify-center text-primary"
                  onClick={() => setQty(i.productId, i.offerType, i.quantity - 1)}
                  aria-label="Diminuir"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{i.quantity}</span>
                <button
                  className="size-8 inline-flex items-center justify-center text-primary"
                  onClick={() => setQty(i.productId, i.offerType, i.quantity + 1)}
                  aria-label="Aumentar"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <p className="font-medium text-primary">{fmtBRL(i.unitPrice * i.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KitDrawer() {
  const k = useKit();
  const [submitting, setSubmitting] = useState(false);
  const aluguel = k.items.filter((i) => i.offerType === "aluguel");
  const venda = k.items.filter((i) => i.offerType === "venda");

  const handleFinish = async () => {
    if (!k.clientName.trim()) {
      toast.error("Informe seu nome para finalizar o pedido.");
      return;
    }
    setSubmitting(true);
    try {
      const { whatsappUrl } = await createKitRequest({
        clientName: k.clientName,
        eventDate: k.eventDate,
        notes: k.notes,
        items: k.items,
      });
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener");
      }
      k.clear();
      k.close();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={k.isOpen} onOpenChange={(o) => (o ? k.open() : k.close())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="font-serif text-2xl text-primary">Meu kit</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Monte sua mesa. Finalize pelo WhatsApp e a Lelo te responde.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {k.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="font-serif text-lg text-primary">Seu kit está vazio</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore o catálogo e adicione suas peças favoritas.
              </p>
            </div>
          ) : (
            <>
              <Group title="Aluguel" items={aluguel} />
              <Group title="Compra" items={venda} />

              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Itens</span>
                  <span className="text-sm font-medium">{k.totalItems}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total estimado</span>
                  <span className="font-serif text-xl text-primary">{fmtBRL(k.totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="client">Seu nome</Label>
                  <Input
                    id="client"
                    value={k.clientName}
                    onChange={(e) => k.setClientName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data do evento</Label>
                  <Input
                    id="date"
                    type="date"
                    value={k.eventDate}
                    onChange={(e) => k.setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={k.notes}
                    onChange={(e) => k.setNotes(e.target.value)}
                    placeholder="Quantidade de convidados, paleta, inspirações..."
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {k.items.length > 0 && (
          <div className="border-t border-border/60 bg-card px-5 py-4">
            <button
              onClick={handleFinish}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle className="size-4" />
              {submitting ? "Enviando..." : "Finalizar pelo WhatsApp"}
            </button>
            <button
              onClick={k.clear}
              className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-destructive"
            >
              Esvaziar kit
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
