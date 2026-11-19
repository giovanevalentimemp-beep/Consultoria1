import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Route as RouteIcon, UserRound, Cpu, FileSearch, Activity, ArrowUpRight, Factory, Wheat, FlaskConical, Truck, HardHat, Warehouse, Briefcase, Bell } from "lucide-react";
import { Reveal, SectionHeading, CtaLink, Eyebrow, DemoTag, useSeo } from "@/components/site/primitives";
import { asset, siteConfig } from "@/config/site";
import { serviceCategories, sectors } from "@/data/services";

const pillars = ["Gestão ambiental estratégica", "Conformidade e licenciamento", "Tecnologia proprietária", "Suporte técnico especializado"];
const differentials = [
  { icon: ShieldCheck, t: "Especialização técnica", d: "Leitura rigorosa da legislação ambiental brasileira aplicada à realidade de cada operação." },
  { icon: RouteIcon, t: "Gestão preventiva", d: "Prazos antecipados e riscos tratados antes de virarem urgência." },
  { icon: UserRound, t: "Atendimento personalizado", d: "Interlocutor técnico dedicado, que conhece sua unidade pelo nome." },
  { icon: Cpu, t: "Tecnologia integrada", d: "Consultoria e plataforma própria trabalhando sobre a mesma base de informações." },
  { icon: FileSearch, t: "Rastreabilidade documental", d: "Cada obrigação ligada à sua evidência, versão e responsável." },
  { icon: Activity, t: "Monitoramento contínuo", d: "Acompanhamento recorrente de indicadores, vencimentos e condicionantes." },
];
const steps = [
  { t: "Diagnóstico ambiental", d: "Levantamento de licenças, obrigações, documentos e pendências da unidade." },
  { t: "Planejamento e regularização", d: "Plano de ação priorizado por risco, com prazos e responsáveis." },
  { t: "Implementação e acompanhamento", d: "Execução técnica, interlocução com órgãos e controle de evidências." },
  { t: "Monitoramento e melhoria contínua", d: "Indicadores, revisões periódicas e alertas de vencimento." },
];
const sectorIcons = [Factory, Wheat, FlaskConical, Truck, HardHat, Warehouse, Briefcase];

export default function HomePage() {
  useSeo(`${siteConfig.company.name} | Consultoria ambiental e gestão de conformidade`, "Licenciamento, gestão ambiental empresarial, resíduos, obrigações federais e tecnologia proprietária para empresas que pensam no futuro.");
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F5F9F6] pt-32 md:pt-40">
        <div className="absolute inset-0 contour" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal><Eyebrow>{siteConfig.company.slogan}</Eyebrow></Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-7 text-[2.6rem] leading-[1.02] md:text-7xl md:leading-[0.98] font-bold">
                  Gestão ambiental <span className="font-display italic font-normal text-[#39845B]">inteligente</span> para empresas que pensam no futuro.
                </h1>
              </Reveal>
            </div>
            <div className="lg:col-span-4 lg:pt-24">
              <Reveal delay={0.16}><p className="text-lg leading-relaxed text-[#58645D]">Unimos conhecimento técnico, conformidade legal e tecnologia para simplificar a gestão ambiental, reduzir riscos e garantir segurança operacional para sua empresa.</p></Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CtaLink href="/servicos" testId="link-hero-solucoes">Conheça nossas soluções</CtaLink>
                  <CtaLink href="/contato" variant="outline" arrow={false} testId="link-hero-especialista">Fale com um especialista</CtaLink>
                </div>
              </Reveal>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }} className="relative mt-14 overflow-hidden rounded-t-3xl">
            <img src={asset("images/hero-industry.jpg")} alt="Unidade industrial moderna integrada à vegetação nativa" className="h-[52vh] min-h-[340px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#194D36]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-8">
              <div className="flex items-center justify-between mb-4"><DemoTag className="!bg-white/90">Pilares ilustrativos</DemoTag></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl bg-white/20 backdrop-blur-md">
                {pillars.map((p, i) => (
                  <div key={p} className="bg-white/10 p-4 md:p-5 text-white">
                    <span className="font-mono text-[11px] text-[#B7DCC3]">0{i + 1}</span>
                    <p className="mt-2 text-sm md:text-base font-semibold leading-snug">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <SectionHeading eyebrow="Nossos diferenciais" title="Precisão técnica com visão de negócio." intro="Gestão ambiental não é só cumprir prazos: é dar à liderança segurança para decidir." />
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 border-t border-l border-[#194D36]/10">
            {differentials.map((d, i) => (
              <Reveal key={d.t} delay={(i % 2) * 0.08} className="group border-b border-r border-[#194D36]/10 p-8 transition-colors hover:bg-[#F5F9F6]">
                <d.icon className="h-6 w-6 text-[#39845B] transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} />
                <h3 className="mt-6 text-lg font-bold">{d.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#58645D]">{d.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section className="bg-[#F5F9F6] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Nossas soluções" title="Sete frentes de atuação, uma gestão integrada." />
            <CtaLink href="/servicos" variant="outline">Ver todos os serviços</CtaLink>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.06} className={i === 0 ? "lg:row-span-2" : ""}>
                <Link href={`/servicos#${s.id}`} data-testid={`link-service-${s.id}`} className={`lift group flex h-full flex-col rounded-2xl border border-[#194D36]/8 bg-white p-7 ${i === 0 ? "lg:bg-[#194D36] lg:text-white" : ""}`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid h-12 w-12 place-items-center rounded-xl ${i === 0 ? "bg-[#B7DCC3] text-[#194D36]" : "bg-[#F5F9F6] text-[#39845B]"}`}><s.icon className="h-5 w-5" strokeWidth={1.6} /></span>
                    <span className="font-mono text-xs opacity-50">{s.letter}</span>
                  </div>
                  <h3 className={`mt-8 text-xl font-bold ${i === 0 ? "lg:text-white" : ""}`}>{s.title}</h3>
                  <p className={`mt-3 text-[15px] leading-relaxed ${i === 0 ? "text-[#58645D] lg:text-white/70" : "text-[#58645D]"}`}>{s.summary}</p>
                  {i === 0 && <ul className="mt-6 hidden lg:block space-y-2 text-sm text-white/80">{s.items.slice(0, 5).map((it) => <li key={it.name} className="border-t border-white/10 pt-2">{it.name}</li>)}</ul>}
                  <span className="mt-auto pt-8 inline-flex items-center gap-1.5 text-sm font-semibold">Saiba mais <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TECNOLOGIA */}
      <section className="relative overflow-hidden bg-[#194D36] py-24 md:py-32 text-white">
        <div className="absolute inset-0 gridlines invert opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal><Eyebrow className="!text-[#B7DCC3]">{siteConfig.product.name} · {siteConfig.product.status}</Eyebrow></Reveal>
            <Reveal delay={0.08}><h2 className="mt-6 text-4xl md:text-5xl font-bold !text-white leading-[1.05]">Mais controle. Menos burocracia. <span className="font-display italic font-normal text-[#B7DCC3]">Gestão ambiental inteligente.</span></h2></Reveal>
            <Reveal delay={0.14}><p className="mt-6 text-lg text-white/75 leading-relaxed">Nossa plataforma proprietária, em desenvolvimento, centraliza documentos, obrigações, licenças, resíduos, condicionantes, vencimentos e indicadores — com alertas automáticos por e-mail e inteligência artificial sempre sob validação humana.</p></Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-2">{["Documentos", "Obrigações", "Licenças", "Resíduos", "Condicionantes", "Vencimentos", "Indicadores"].map((t) => <span key={t} className="rounded-full border border-white/15 px-3 py-1.5 text-xs">{t}</span>)}</div>
              <CtaLink href="/tecnologia" variant="light" className="mt-10">Conheça nossa plataforma</CtaLink>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative rounded-2xl bg-white p-5 text-[#194D36] shadow-2xl">
              <div className="flex items-center justify-between"><p className="text-sm font-bold">Próximos vencimentos</p><DemoTag /></div>
              {[["Licença de Operação", "30/06/2027", "90 · 60 · 30 · 15 · 7"], ["Laudo de ruído perimetral", "08/09/2025", "30 · 15 · 7"], ["CTF/APP — comprovante", "31/03/2026", "60 · 30"]].map(([a, b, c]) => (
                <div key={a} className="mt-4 flex items-center gap-4 border-t border-[#194D36]/8 pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#F5F9F6]"><Bell className="h-4 w-4 text-[#39845B]" /></span>
                  <div className="flex-1"><p className="text-sm font-semibold">{a}</p><p className="font-mono text-[11px] text-[#58645D]">alertas: {c} dias antes</p></div>
                  <span className="font-mono text-xs">{b}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Como trabalhamos" title="Um método em quatro etapas, do diagnóstico à melhoria contínua." />
          <div className="relative mt-16 grid gap-10 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-[#194D36]/12 md:block" aria-hidden />
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.1} className="relative">
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-[#194D36] font-mono text-sm text-white ring-8 ring-white">{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#58645D]">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SETORES */}
      <section className="bg-[#F5F9F6] py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Setores atendidos" title="Cada setor, um conjunto próprio de exigências." intro="Adaptamos escopo, linguagem e cronograma à natureza da sua operação." />
            <Reveal delay={0.1}><img src={asset("images/audit.jpg")} alt="Profissional ambiental revisando documentos em ambiente industrial" className="mt-10 aspect-[4/3] w-full rounded-2xl object-cover" /></Reveal>
          </div>
          <ul className="lg:col-span-7 divide-y divide-[#194D36]/10 border-y border-[#194D36]/10">
            {sectors.map((s, i) => {
              const Icon = sectorIcons[i];
              return (
                <Reveal key={s} delay={i * 0.04}>
                  <li className="group flex items-center gap-6 py-5 transition-all hover:pl-3">
                    <span className="font-mono text-xs text-[#58645D]">{String(i + 1).padStart(2, "0")}</span>
                    <Icon className="h-5 w-5 text-[#39845B]" strokeWidth={1.5} />
                    <span className="text-xl md:text-2xl font-semibold text-[#194D36]">{s}</span>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

export function FinalCta() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#B7DCC3] p-10 md:p-16">
            <div className="absolute inset-0 contour opacity-60" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <Eyebrow className="!text-[#194D36]">Diagnóstico inicial</Eyebrow>
                <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-[1.05]">Sua empresa está preparada para atender às exigências ambientais?</h2>
                <p className="mt-5 max-w-xl text-lg text-[#194D36]/80">Conte-nos sobre sua operação. Avaliamos o cenário e propomos um escopo técnico claro, sem promessas de resultado que dependam de terceiros.</p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                <CtaLink href="/contato?assunto=diagnostico">Solicitar diagnóstico</CtaLink>
                <CtaLink href="/contato?assunto=orcamento" variant="light" arrow={false}>Pedir orçamento</CtaLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
