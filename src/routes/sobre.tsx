import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import aboutImg from "@/assets/about-mesa.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Lelo's Home" },
      {
        name: "description",
        content: "A essência da Lelo's Home: cuidado, curadoria e a arte de receber bem.",
      },
      { property: "og:title", content: "Sobre — Lelo's Home" },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-secondary/40 py-20">
        <div className="container-x max-w-3xl text-center">
          <p className="eyebrow">Sobre nós</p>
          <h1 className="mt-3 font-serif text-5xl text-primary sm:text-6xl">
            A arte silenciosa de receber bem
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A Lelo's Home nasceu do encanto pelas mesas que reúnem — mesas que
            acolhem afetos, sustentam brindes e guardam, sem perceber, as
            histórias mais importantes de uma família.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <img
            src={aboutImg}
            alt="Mesa em linho azul com peças brancas e dourado"
            width={1400}
            height={1000}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover shadow-xl ring-1 ring-black/5"
          />
          <div className="space-y-6 text-base text-muted-foreground sm:text-lg">
            <p>
              Tudo começou em casa — com peças herdadas, linho passado a ferro
              quente, velas acesas antes da chegada dos convidados. Foi esse
              cuidado, traduzido em detalhe, que se tornou o ofício da Lelo.
            </p>
            <p>
              Hoje, oferecemos curadoria, aluguel, venda e consultoria de mesa
              posta para clientes que entendem a mesa como gesto de amor. Cada
              composição é pensada como uma obra: paleta, textura, altura, luz.
            </p>
            <p className="font-serif text-2xl text-primary">
              "Receber bem é o gesto mais delicado da hospitalidade. E a mesa é
              o primeiro abraço."
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {[
            { n: "200+", l: "Eventos atendidos" },
            { n: "120+", l: "Peças autorais" },
            { n: "100%", l: "Cuidado artesanal" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border/60 bg-card p-8 text-center"
            >
              <p className="font-serif text-5xl text-accent">{s.n}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
