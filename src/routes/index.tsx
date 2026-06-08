import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/hero-mesa.jpg";
import aboutImg from "@/assets/about-mesa.jpg";
import { ArrowRight, Sparkles, Heart, Crown, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { getCategories } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lelo's Home — Mesa Posta & Curadoria" },
      {
        name: "description",
        content: "Mesas postas elegantes, consultoria, aluguel e venda. Criado para encantar, feito para memórias.",
      },
      { property: "og:title", content: "Lelo's Home — Mesa Posta & Curadoria" },
      { property: "og:description", content: "Criado para encantar, feito para memórias." },
    ],
  }),
  component: Home,
});

const SERVICES = [
  {
    icon: Crown,
    title: "Montagem de mesa posta",
    desc: "Da escolha das peças à composição final, montamos sua mesa pronta para receber.",
  },
  {
    icon: Sparkles,
    title: "Consultoria & curadoria",
    desc: "Orientamos paleta, peças e estilo para cada ocasião, com sensibilidade e técnica.",
  },
  {
    icon: Heart,
    title: "Aluguel & venda de peças",
    desc: "Coleção autoral em linho, porcelana, cristal e latão — para alugar ou levar para casa.",
  },
];

function Home() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-12 py-12 md:py-20 lg:grid-cols-2 lg:py-28">
          <div className="relative z-10">
            <p className="eyebrow">Mesa Posta &middot; Desde 2019</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-primary sm:text-6xl lg:text-7xl">
              A mesa que <em className="text-accent not-italic">acolhe</em>,
              <br />
              a memória que <em className="text-accent not-italic">fica</em>.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              Curadoria sofisticada de peças, montagem e consultoria para
              celebrações que merecem ser lembradas — em casa ou onde sua
              história acontecer.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                Monte seu kit
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/consultoria"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-7 py-3.5 text-sm font-semibold text-primary hover:border-accent transition"
              >
                Consultoria
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" aria-hidden />
            <img
              src={heroImg}
              alt="Mesa posta sofisticada com linho azul e detalhes em latão"
              width={1600}
              height={1200}
              className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl ring-1 ring-black/5 md:aspect-[5/6]"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border/60 bg-card px-5 py-4 shadow-lg md:block">
              <p className="eyebrow">Hoje na coleção</p>
              <p className="mt-1 font-serif text-lg text-primary">120+ peças autorais</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="bg-secondary/60 py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Nossos serviços</p>
            <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
              Tudo para sua mesa, do cuidado ao último detalhe
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-border/60 bg-card p-8 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Destaques de categorias</p>
              <h2 className="mt-2 font-serif text-4xl text-primary sm:text-5xl">
                Comece pela peça que ama
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
            >
              Ver catálogo completo <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.slice(0, 10).map((c, i) => (
              <Link
                key={c.value}
                to="/catalogo"
                search={{ categoria: c.value }}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border/60"
                style={{
                  background:
                    i % 3 === 0
                      ? "linear-gradient(160deg,#1b2a4e,#2a3f6e)"
                      : i % 3 === 1
                        ? "linear-gradient(160deg,#f3ebdc,#e6d7bd)"
                        : "linear-gradient(160deg,#c9a55c,#b08a44)",
                }}
              >
                <div className="absolute inset-0 flex items-end p-4 transition group-hover:bg-black/5">
                  <span
                    className={`font-serif text-lg leading-tight ${
                      i % 3 === 1 ? "text-primary" : "text-white"
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MEMÓRIAS */}
      <section className="py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <img
            src={aboutImg}
            alt="Composição de mesa em linho azul com pratos brancos"
            width={1400}
            height={1000}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl ring-1 ring-black/5"
          />
          <div>
            <p className="eyebrow">Nossa essência</p>
            <h2 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
              Criado para encantar,<br />feito para memórias
            </h2>
            <p className="mt-6 text-base text-muted-foreground sm:text-lg">
              Cada mesa carrega uma história — um aniversário, um jantar de família,
              um brinde silencioso entre amigos. Na Lelo's Home, cuidamos para que
              cada peça, dobra de guardanapo e luz de vela componha um cenário
              digno desse encontro.
            </p>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Acreditamos que a beleza está no detalhe, e que receber bem é,
              acima de tudo, um gesto de amor.
            </p>
            <Link
              to="/sobre"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
            >
              Conheça a Lelo's Home <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="pb-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground sm:px-14 sm:py-20">
            <div
              className="absolute -right-20 -top-20 size-72 rounded-full bg-accent/30 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 max-w-2xl">
              <p className="eyebrow text-primary-foreground/70">Vamos conversar?</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Conte sobre seu evento. Cuidamos do resto.
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Atendimento direto pelo WhatsApp para montar seu kit, tirar dúvidas
                e fechar consultoria.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços da Lelo's Home.")}`}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-95 transition"
              >
                <MessageCircle className="size-4" /> Falar com a Lelo
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
