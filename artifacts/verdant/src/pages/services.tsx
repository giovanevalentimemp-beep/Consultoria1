import { Link } from "wouter";
import { Check, Info } from "lucide-react";
import { PageHero, Reveal, CtaLink, Eyebrow, useSeo } from "@/components/site/primitives";
import { asset, siteConfig } from "@/config/site";
import { serviceCategories } from "@/data/services";
import { FinalCta } from "./home";

export default function ServicesPage() {
  useSeo("Serviços", "Licenciamento ambiental, gestão ambiental empresarial, resíduos, IBAMA e obrigações federais, estudos técnicos, gestão documental e consultoria especializada.");
  return (
    <>
      <PageHero eyebrow="Serviços" title={<>Escopos técnicos claros para cada <span className="font-display italic font-normal text-[#39845B]">exigência ambiental.</span></>} intro="Organizamos nossa atuação em sete frentes. Cada uma tem descrição, benefícios e escopo detalhado — e pode ser contratada isoladamente ou de forma integrada." image={asset("images/monitoring.jpg")}>
        <CtaLink href="/contato?assunto=orcamento">Solicitar orçamento</CtaLink>
      </PageHero>

      <div className="sticky top-[64px] z-30 border-y border-[#194D36]/8 bg-white/90 backdrop-blur-xl">
        <nav aria-label="Categorias de serviço" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3">
          {serviceCategories.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-[#58645D] hover:bg-[#F5F9F6] hover:text-[#194D36]">
              <span className="font-mono text-xs text-[#39845B] mr-1.5">{s.letter}</span>{s.title}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex gap-3 rounded-xl bg-[#F5F9F6] p-5 text-sm text-[#58645D]"><Info className="h-5 w-5 shrink-0 text-[#39845B]" /><p>{siteConfig.commercial.partnersNotice} Não prometemos aprovação de licenças nem resultados que dependam de decisão de órgãos públicos.</p></div>
      </div>

      {serviceCategories.map((s, idx) => (
        <section key={s.id} id={s.id} className="scroll-mt-36 py-20 md:py-24 border-b border-[#194D36]/8 last:border-0">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-center gap-4"><span className="font-display text-7xl text-[#B7DCC3] leading-none">{s.letter}</span><s.icon className="h-7 w-7 text-[#39845B]" strokeWidth={1.5} /></div>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold">{s.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-[#58645D]">{s.description}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <Eyebrow className="mt-10">Benefícios</Eyebrow>
                <ul className="mt-4 space-y-3">{s.benefits.map((b) => <li key={b} className="flex gap-3 text-[#194D36]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#39845B]" />{b}</li>)}</ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <CtaLink href={`/contato?assunto=orcamento&servico=${s.id}`} testId={`link-orcamento-${s.id}`}>Solicitar orçamento</CtaLink>
                  {s.partners && <span className="self-center text-xs text-[#58645D] max-w-[220px]">Executado por profissionais habilitados e parceiros técnicos especializados.</span>}
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className={`rounded-2xl p-2 ${idx % 2 ? "bg-[#F5F9F6]" : "bg-[#194D36]/[0.03]"}`}>
                  <p className="eyebrow px-5 pt-4 pb-2">Escopo de atuação</p>
                  <ul>
                    {s.items.map((it, i) => (
                      <li key={it.name} className="group flex gap-5 rounded-xl px-5 py-4 transition-colors hover:bg-white">
                        <span className="font-mono text-xs text-[#58645D] pt-1">{String(i + 1).padStart(2, "0")}</span>
                        <div><p className="font-semibold text-[#194D36]">{it.name}</p><p className="mt-0.5 text-sm text-[#58645D]">{it.detail}</p></div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#F5F9F6] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Controle tudo isso em uma única plataforma.</h2>
          <p className="mt-4 text-lg text-[#58645D]">O VERDANT CONTROL está sendo desenvolvido para acompanhar licenças, condicionantes, resíduos e vencimentos de cada serviço contratado.</p>
          <Link href="/tecnologia" className="mt-8 inline-block font-semibold text-[#39845B] underline underline-offset-4 hover:text-[#194D36]">Conheça o VERDANT CONTROL</Link>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
