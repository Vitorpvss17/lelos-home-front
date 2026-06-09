// Cliente HTTP autenticado para a API admin (Bearer JWT) com refresh
// automático em 401. Em falha de auth, limpa os tokens (o guard redireciona).
import { tokenStore } from "./token-store";
import type {
  AdminCategory,
  AdminKit,
  AdminOrder,
  AdminProduct,
  CategoryReq,
  KitReq,
  LoginResponse,
  OrderStatus,
  Page,
  ProductReq,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class UnauthorizedError extends Error {
  constructor() {
    super("Sessão expirada. Faça login novamente.");
    this.name = "UnauthorizedError";
  }
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as LoginResponse;
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = tokenStore.getAccess();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, init, false);
    tokenStore.clear();
    throw new UnauthorizedError();
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? (body.fields ? JSON.stringify(body.fields) : message);
    } catch {
      /* corpo vazio/não-JSON */
    }
    throw new Error(message || `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Auth ─────────────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("E-mail ou senha inválidos.");
    throw new Error(`Erro ${res.status} ao autenticar.`);
  }
  return (await res.json()) as LoginResponse;
}

export const adminLogout = () =>
  request<void>("/api/admin/auth/logout", { method: "POST" });

// ── Categorias ───────────────────────────────────────────────────────
export const listCategories = () => request<AdminCategory[]>("/api/admin/categories");
export const createCategory = (body: CategoryReq) =>
  request<AdminCategory>("/api/admin/categories", { method: "POST", body: JSON.stringify(body) });
export const updateCategory = (id: string, body: CategoryReq) =>
  request<AdminCategory>(`/api/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const toggleCategory = (id: string) =>
  request<AdminCategory>(`/api/admin/categories/${id}/toggle`, { method: "PATCH" });
export const deleteCategory = (id: string) =>
  request<void>(`/api/admin/categories/${id}`, { method: "DELETE" });

// ── Produtos ─────────────────────────────────────────────────────────
export const listProducts = () =>
  request<Page<AdminProduct>>("/api/admin/products?size=1000&sort=name");
export const createProduct = (body: ProductReq) =>
  request<AdminProduct>("/api/admin/products", { method: "POST", body: JSON.stringify(body) });
export const updateProduct = (id: string, body: ProductReq) =>
  request<AdminProduct>(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const toggleProduct = (id: string) =>
  request<AdminProduct>(`/api/admin/products/${id}/toggle`, { method: "PATCH" });
export const deleteProduct = (id: string) =>
  request<void>(`/api/admin/products/${id}`, { method: "DELETE" });

// ── Kits ─────────────────────────────────────────────────────────────
export const listKits = () => request<Page<AdminKit>>("/api/admin/kits?size=1000&sort=name");
export const createKit = (body: KitReq) =>
  request<AdminKit>("/api/admin/kits", { method: "POST", body: JSON.stringify(body) });
export const updateKit = (id: string, body: KitReq) =>
  request<AdminKit>(`/api/admin/kits/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const toggleKit = (id: string) =>
  request<AdminKit>(`/api/admin/kits/${id}/toggle`, { method: "PATCH" });
export const deleteKit = (id: string) => request<void>(`/api/admin/kits/${id}`, { method: "DELETE" });

// ── Pedidos ──────────────────────────────────────────────────────────
export function listOrders(params: { status?: OrderStatus; createdFrom?: string; createdTo?: string }) {
  const qs = new URLSearchParams({ size: "1000", sort: "createdAt,desc" });
  if (params.status) qs.set("status", params.status);
  if (params.createdFrom) qs.set("createdFrom", params.createdFrom);
  if (params.createdTo) qs.set("createdTo", params.createdTo);
  return request<Page<AdminOrder>>(`/api/admin/orders?${qs.toString()}`);
}
export const updateOrderStatus = (id: string, status: OrderStatus) =>
  request<AdminOrder>(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
