import type { KitItem, KitRequest } from "./types";
import { categoryLabel } from "./categories";

// =====================================================================
// Edite aqui o número de WhatsApp da Lelo's Home (formato internacional)
// =====================================================================
export const WHATSAPP_NUMBER = "5511999999999";

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function buildKitMessage(req: KitRequest): string {
  const lines: string[] = [];
  lines.push("*Novo pedido — Lelo's Home*", "");
  lines.push(`*Cliente:* ${req.clientName || "(não informado)"}`);
  lines.push(`*Data do evento:* ${req.eventDate || "(não informada)"}`, "");

  const aluguel = req.items.filter((i) => i.offerType === "aluguel");
  const venda = req.items.filter((i) => i.offerType === "venda");

  const renderList = (items: KitItem[]) =>
    items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.name} — ${categoryLabel(i.category)} (${fmtBRL(
            i.unitPrice * i.quantity,
          )})`,
      )
      .join("\n");

  if (aluguel.length) {
    lines.push("*Itens para aluguel:*", renderList(aluguel), "");
  }
  if (venda.length) {
    lines.push("*Itens para compra:*", renderList(venda), "");
  }

  const total = req.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  lines.push(`*Total estimado:* ${fmtBRL(total)}`);

  if (req.notes?.trim()) {
    lines.push("", `*Observações:* ${req.notes.trim()}`);
  }

  return lines.join("\n");
}

export function openWhatsApp(message: string, number: string = WHATSAPP_NUMBER) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
}
