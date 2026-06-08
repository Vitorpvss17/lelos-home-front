import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div>
          <h3 className="font-serif text-2xl">Lelo's Home</h3>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Mesa posta, curadoria e celebrações que ficam na memória.
          </p>
        </div>
        <div>
          <p className="eyebrow text-primary-foreground/60">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/catalogo" className="hover:text-accent">Catálogo</Link></li>
            <li><Link to="/consultoria" className="hover:text-accent">Consultoria</Link></li>
            <li><Link to="/sobre" className="hover:text-accent">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-accent">Contato</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-primary-foreground/60">Serviços</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>Montagem de mesas postas</li>
            <li>Consultoria de composição</li>
            <li>Aluguel de peças</li>
            <li>Venda curada</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-primary-foreground/60">Fale com a Lelo</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-2 text-sm hover:text-accent"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-2 text-sm hover:text-accent"
          >
            <Instagram className="size-4" /> @leloshome
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x py-5 text-xs text-primary-foreground/60 flex flex-col sm:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} Lelo's Home. Todos os direitos reservados.</p>
          <p>Feito com cuidado para celebrar memórias.</p>
        </div>
      </div>
    </footer>
  );
}
