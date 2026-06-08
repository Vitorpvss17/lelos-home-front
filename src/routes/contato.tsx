import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Lelo's Home" },
      { name: "description", content: "Fale com a Lelo's Home pelo WhatsApp, e-mail ou redes." },
      { property: "og:title", content: "Contato — Lelo's Home" },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <SiteLayout>
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Contato</p>
            <h1 className="mt-3 font-serif text-5xl text-primary sm:text-6xl">
              Vamos celebrar juntos?
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Atendimento por WhatsApp para orçamentos, dúvidas e consultoria.
              Respondemos com carinho em até 24h.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition hover:border-accent"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-lg text-primary">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Resposta rápida e atendimento direto</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-lg text-primary">contato@leloshome.com.br</p>
                  <p className="text-sm text-muted-foreground">Para parcerias e orçamentos completos</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-lg text-primary">+55 (11) 99999-9999</p>
                  <p className="text-sm text-muted-foreground">Seg a sex, 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-lg text-primary">São Paulo, SP</p>
                  <p className="text-sm text-muted-foreground">Atendimento em todo o Brasil</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-primary p-10 text-primary-foreground sm:p-14">
            <h2 className="font-serif text-3xl sm:text-4xl">
              Conte sobre seu evento
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Envie pelo WhatsApp: data, número de convidados e o estilo que
              você imagina. Pensaremos sua mesa com você.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá Lelo! Quero conversar sobre meu evento.")}`}
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-95 transition"
            >
              <MessageCircle className="size-4" /> Iniciar conversa
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
