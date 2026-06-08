// Tipos que espelham os DTOs do backend (camada admin, sem adapter).
export type ProductType = "SALE" | "RENT" | "BOTH";
export type OrderStatus = "PENDING" | "SENT_TO_WHATSAPP" | "CANCELLED";
export type ItemMode = "RENT" | "SALE";
export type OrderItemType = "PRODUCT" | "KIT";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string | null;
  type: ProductType;
  salePrice: number | null;
  rentPrice: number | null;
  imageUrls: string[];
  stockQty: number;
  active: boolean;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
}

export interface AdminKitItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

export interface AdminKit {
  id: string;
  name: string;
  description: string | null;
  type: ProductType;
  salePrice: number | null;
  rentPrice: number | null;
  imageUrls: string[];
  items: AdminKitItem[];
  active: boolean;
  createdAt: string;
}

export interface AdminOrderItem {
  id: string;
  itemType: OrderItemType;
  productId: string | null;
  productName: string | null;
  kitId: string | null;
  kitName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  itemMode: ItemMode;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string | null;
  eventDate: string | null;
  notes: string | null;
  status: OrderStatus;
  whatsappUrl: string | null;
  totalAmount: number;
  items: AdminOrderItem[];
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── Requests ─────────────────────────────────────────────────────────
export interface CategoryReq {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ProductReq {
  name: string;
  description?: string | null;
  type: ProductType;
  salePrice?: number | null;
  rentPrice?: number | null;
  imageUrls?: string[];
  stockQty?: number | null;
  categoryId?: string | null;
}

export interface KitItemReq {
  productId: string;
  quantity: number;
}

export interface KitReq {
  name: string;
  description?: string | null;
  type: ProductType;
  salePrice?: number | null;
  rentPrice?: number | null;
  imageUrls?: string[];
  items: KitItemReq[];
}

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  SALE: "Venda",
  RENT: "Aluguel",
  BOTH: "Aluguel e venda",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  SENT_TO_WHATSAPP: "Enviado ao WhatsApp",
  CANCELLED: "Cancelado",
};
