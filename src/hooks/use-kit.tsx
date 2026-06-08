import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { KitItem, OfferType, Product } from "@/lib/types";

interface KitState {
  items: KitItem[];
  clientName: string;
  eventDate: string;
  notes: string;
  isOpen: boolean;
}

interface KitContextValue extends KitState {
  add: (product: Product, offerType: OfferType, qty?: number) => void;
  remove: (productId: string, offerType: OfferType) => void;
  setQty: (productId: string, offerType: OfferType, qty: number) => void;
  clear: () => void;
  setClientName: (v: string) => void;
  setEventDate: (v: string) => void;
  setNotes: (v: string) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  totalItems: number;
  totalPrice: number;
}

const KitContext = createContext<KitContextValue | null>(null);

export function KitProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KitItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((product: Product, offerType: OfferType, qty = 1) => {
    const unit =
      offerType === "aluguel" ? product.priceAluguel ?? 0 : product.priceVenda ?? 0;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id && i.offerType === offerType);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.categoryName,
          offerType,
          unitPrice: unit,
          quantity: qty,
          image: product.image,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string, offerType: OfferType) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.offerType === offerType)));
  }, []);

  const setQty = useCallback((productId: string, offerType: OfferType, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.offerType === offerType
            ? { ...i, quantity: Math.max(0, qty) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const value = useMemo<KitContextValue>(
    () => ({
      items,
      clientName,
      eventDate,
      notes,
      isOpen,
      add,
      remove,
      setQty,
      clear: () => setItems([]),
      setClientName,
      setEventDate,
      setNotes,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    }),
    [items, clientName, eventDate, notes, isOpen, add, remove, setQty],
  );

  return <KitContext.Provider value={value}>{children}</KitContext.Provider>;
}

export function useKit() {
  const ctx = useContext(KitContext);
  if (!ctx) throw new Error("useKit must be used within KitProvider");
  return ctx;
}
