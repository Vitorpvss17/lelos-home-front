// Categoria agora é dinâmica (vinda do backend). O valor é o UUID da
// categoria; o rótulo legível vem em `Product.categoryName` / nas opções.
export type Category = string;

export interface CategoryOption {
  value: string; // categoryId (UUID)
  label: string; // nome da categoria
}

export type OfferType = "aluguel" | "venda";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category; // categoryId (UUID) — usado para filtrar
  categoryName: string; // nome legível — usado para exibir
  offerTypes: OfferType[];
  priceVenda?: number;
  priceAluguel?: number;
  image: string;
  palette: [string, string]; // gradient for placeholder card
}

export interface KitItem {
  productId: string;
  name: string;
  category: string; // nome da categoria (exibição)
  offerType: OfferType;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface KitRequest {
  clientName: string;
  eventDate: string;
  notes: string;
  items: KitItem[];
}
