// =====================================================================
// API service layer — Lelo's Home
// Integra com o backend Spring Boot. A URL base vem de VITE_API_URL.
// Faz a tradução (adapter) entre os DTOs do backend e os tipos do front.
// =====================================================================

import type { CategoryOption, KitRequest, OfferType, Product } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// ── Shapes do backend ────────────────────────────────────────────────
type ProductType = "SALE" | "RENT" | "BOTH";

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  type: ProductType;
  salePrice: number | null;
  rentPrice: number | null;
  imageUrls: string[] | null;
  stockQty: number | null;
  active: boolean;
  categoryId: string | null;
  categoryName: string | null;
}

interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface ApiOrder {
  id: string;
  whatsappUrl: string;
  totalAmount?: number;
  status?: string;
}

// ── HTTP helper ──────────────────────────────────────────────────────
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return (await res.json()) as T;
}

// ── Adapters ─────────────────────────────────────────────────────────
const PALETTES: [string, string][] = [
  ["#1b2a4e", "#2a3f6e"], // navy
  ["#f3ebdc", "#e6d7bd"], // cream
  ["#c9a55c", "#b08a44"], // gold
  ["#e8dcc5", "#cdb98f"], // sand
  ["#2a3f6e", "#445d96"], // blue
];

// Paleta determinística a partir do id (mesmo produto → mesma paleta).
function paletteFor(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

function offerTypesFrom(type: ProductType): OfferType[] {
  switch (type) {
    case "RENT":
      return ["aluguel"];
    case "SALE":
      return ["venda"];
    default:
      return ["aluguel", "venda"];
  }
}

function adaptProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    category: p.categoryId ?? "",
    categoryName: p.categoryName ?? "",
    offerTypes: offerTypesFrom(p.type),
    priceVenda: p.salePrice ?? undefined,
    priceAluguel: p.rentPrice ?? undefined,
    image: p.imageUrls?.[0] ?? "",
    palette: paletteFor(p.id),
  };
}

// ── API pública ──────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const page = await http<Page<ApiProduct>>("/api/products?size=1000");
  return page.content.map(adaptProduct);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const page = await http<Page<ApiProduct>>(
    `/api/products?categoryId=${encodeURIComponent(categoryId)}&size=1000`,
  );
  return page.content.map(adaptProduct);
}

export async function getCategories(): Promise<CategoryOption[]> {
  const cats = await http<ApiCategory[]>("/api/categories");
  return cats.map((c) => ({ value: c.id, label: c.name }));
}

export async function createKitRequest(
  payload: KitRequest,
): Promise<{ id: string; whatsappUrl: string }> {
  const body = {
    customerName: payload.clientName.trim(),
    eventDate: payload.eventDate || null,
    notes: payload.notes?.trim() || null,
    items: payload.items.map((i) => ({
      itemType: "PRODUCT" as const,
      productId: i.productId,
      kitId: null,
      quantity: i.quantity,
      itemMode: i.offerType === "aluguel" ? "RENT" : "SALE",
    })),
  };

  const order = await http<ApiOrder>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return { id: order.id, whatsappUrl: order.whatsappUrl };
}
