import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site da Lelo's Home 🤍")}`}
      target="_blank"
      rel="noopener"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-6 right-6 z-30 inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl ring-1 ring-black/5 transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
