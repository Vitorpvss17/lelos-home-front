import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import consultoriaImg from "@/assets/consultoria.jpg";
import { Check, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const Route = createFileRoute("/consultoria")({
  head: () => ({
    meta: [
      { title: "Consultoria de Mesa Posta — Lelo's Home" },
      {
        name: "description",
        content:
          "Consultoria de mesa posta personalizada: paleta, peças, composição e montagem. Pensado para sua celebração.",
      },
      { property: "og:title", content: "Consultoria de Mesa Posta — Lelo's Home" },
    ],
  }),
  component: Consultoria,
});

const BENEFITS = [
  { title: "Paleta autoral", desc: "Cores, texturas e materiais selecionados para a estética do seu evento." },
  { title: "Curadoria de peças", desc: "Indicação precisa entre nossa coleção e parceiros especiais." },
  { title: "Layout & composição", desc: "Estudo do tampo, alturas, fluxos e centro de mesa." },
  { title: "Montagem assistida", desc: "Acompanhamos a montagem no dia ou orientamos sua equipe." },
  { title: "Mood board exclusivo", desc: "Você recebe um painel visual com toda a proposta antes do evento." },
  { title: "Plano flexível", desc: "Consultoria pontual ou acompanhamento completo até o brinde final." },
];

function Consultoria() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Consultoria</p>
            <h1 className="mt-3 font-serif text-5xl text-primary sm:text-6xl">
              Sua mesa, pensada nos mínimos detalhes
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Trabalhamos lado a lado com você para criar uma mesa que conte sua
              história — com paleta, texturas e composição assinadas pela Lelo.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de um orçamento de consultoria de mesa posta.")}`}
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-95 transition"
            >
              <MessageCircle className="size-4" /> Solicitar orçamento
            </a>
          </div>
          <img
            src={consultoriaImg}
            alt="Detalhe de prato com guardanapo de linho e raminho de alecrim"
            width={1400}
            height={1000}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl ring-1 ring-black/5"
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">O que está incluído</p>
            <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
              Cuidado em cada etapa
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border/60 bg-card p-7 transition hover:border-accent hover:shadow-md"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <Check className="size-4" />
                </span>
                <h3 className="mt-4 font-serif text-xl text-primary">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-14">
            <h2 className="font-serif text-3xl sm:text-4xl">Vamos desenhar sua mesa juntas?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Atendimento personalizado. Envie a data e o estilo do seu evento.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero um orçamento de consultoria.")}`}
              target="_blank"
              rel="noopener"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-95 transition"
            >
              <MessageCircle className="size-4" /> Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
