import { Info } from "lucide-react";
import { PageHero, Reveal, CtaLink, useSeo } from "@/components/site/primitives";
import { asset, siteConfig } from "@/config/site";

export default function TeamPage() {
  useSeo("Equipe técnica", "Conheça a estrutura do corpo técnico da VERDANT AMBIENTAL: licenciamento, gestão ambiental, geoprocessamento, monitoramento e tecnologia.");
  return (
    <>
      <PageHero eyebrow="Equipe técnica" title={<>Um corpo técnico <span className="font-display italic font-normal text-[#39845B]">multidisciplinar</span>, organizado por especialidade.</>} intro="Cada projeto é conduzido por profissionais com papéis definidos, sob coordenação técnica única — do licenciamento à tecnologia.">
        <CtaLink href="/contato">Falar com a equipe</CtaLink>
      </PageHero>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex gap-3 rounded-xl border border-[#194D36]/10 p-4 text-sm text-[#58645D]" data-testid="text-team-disclaimer">
            <Info className="h-5 w-5 shrink-0 text-[#39845B]" />
            <p>Perfis ilustrativos: nomes e fotografias são demonstrativos e serão substituídos pelos profissionais efetivamente vinculados à empresa. Registros profissionais e qualificações serão informados apenas quando comprovados.</p>
          </div>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.team.map((m, i) => (
              <Reveal key={m.id} delay={(i % 3) * 0.08}>
                <article className="group" data-testid={`card-team-${m.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F9F6]">
                    <img src={asset(m.photo)} alt={`Retrato ilustrativo — ${m.role}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#39845B]">Perfil ilustrativo</span>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#194D36]/90 p-5 backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
                      <div className="flex flex-wrap gap-1.5">{m.areas.map((a) => <span key={a} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white">{a}</span>)}</div>
                    </div>
                  </div>
                  <p className="mt-5 eyebrow">{m.title}</p>
                  <h2 className="mt-2 text-xl font-bold">{m.role}</h2>
                  <p className="text-sm text-[#58645D]">{m.name} <span className="opacity-60">(nome demonstrativo)</span></p>
                  <p className="mt-3 leading-relaxed text-[#58645D]">{m.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#F5F9F6] py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-2 md:items-center">
          <h2 className="text-3xl md:text-4xl font-bold">Rede de parceiros técnicos especializados.</h2>
          <div>
            <p className="text-lg text-[#58645D]">{siteConfig.commercial.partnersNotice} A coordenação técnica permanece com a VERDANT, garantindo padrão de qualidade e comunicação única com o cliente.</p>
            <CtaLink href="/servicos" variant="outline" className="mt-6">Ver escopos de serviço</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
