import { LayoutDashboard, FileStack, ListChecks, Recycle, BellRing, Sparkles, UserCheck, Mail, CalendarClock, Users, Repeat, UserCog, FileText, Check } from "lucide-react";
import { Reveal, SectionHeading, CtaLink, Eyebrow, DemoTag, useSeo } from "@/components/site/primitives";
import ProductMockups from "@/components/product/ProductMockups";
import { siteConfig } from "@/config/site";

const features = [
  { icon: LayoutDashboard, t: "Dashboard ambiental", items: ["Visão geral da situação ambiental", "Licenças vigentes", "Obrigações pendentes", "Documentos próximos do vencimento", "Indicadores de conformidade", "Pendências críticas"] },
  { icon: FileStack, t: "Gestão documental inteligente", items: ["Upload de documentos", "Organização automática por categoria", "Leitura de PDFs por inteligência artificial", "Extração de informações importantes", "Histórico de versões", "Pesquisa inteligente", "Armazenamento centralizado"] },
  { icon: ListChecks, t: "Controle de licenças e condicionantes", items: ["Cadastro de licenças", "Extração de condicionantes por IA", "Controle de prazos", "Responsáveis por obrigação", "Evidências de atendimento", "Histórico de cumprimento"] },
  { icon: Recycle, t: "Gestão de resíduos", items: ["Organização de MTR e CDF", "Controle de resíduos por categoria", "Identificação de documentos faltantes", "Rastreabilidade de destinação", "Relatórios gerenciais"] },
];
const alertParams = [
  { icon: FileText, t: "Qual documento será monitorado" },
  { icon: CalendarClock, t: "Data de vencimento" },
  { icon: BellRing, t: "Antecedência dos alertas" },
  { icon: Users, t: "Destinatários" },
  { icon: Repeat, t: "Frequência dos avisos" },
  { icon: UserCog, t: "Responsável pelo documento" },
];
const offsets = [90, 60, 30, 15, 7];
const ai = ["Analisar documentos", "Identificar obrigações", "Orientar alimentações necessárias", "Sugerir documentos faltantes", "Responder dúvidas com base nos documentos cadastrados", "Preparar relatórios", "Identificar inconsistências"];

export default function TechnologyPage() {
  useSeo(`${siteConfig.product.name} | Plataforma de gestão ambiental`, "Conheça o VERDANT CONTROL: dashboard ambiental, gestão documental com IA, condicionantes, resíduos e alertas automáticos por e-mail. Plataforma em desenvolvimento.");
  return (
    <>
      <section className="relative overflow-hidden bg-[#F5F9F6] pt-36 pb-24 md:pt-44">
        <div className="absolute inset-0 gridlines" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal><div className="flex justify-center"><DemoTag>{siteConfig.product.status} · Demonstração comercial</DemoTag></div></Reveal>
            <Reveal delay={0.06}><p className="mt-8 text-sm font-extrabold tracking-[0.3em] text-[#39845B]">{siteConfig.product.name}</p></Reveal>
            <Reveal delay={0.1}><h1 className="mt-4 text-4xl md:text-7xl font-bold leading-[1.02]">Todo o controle ambiental da sua empresa <span className="font-display italic font-normal text-[#39845B]">em um só lugar.</span></h1></Reveal>
            <Reveal delay={0.16}><p className="mx-auto mt-7 max-w-2xl text-lg text-[#58645D]">Uma plataforma própria, construída a partir da prática da consultoria, para reunir documentos, licenças, condicionantes, resíduos e vencimentos — com alertas por e-mail e IA sob validação humana.</p></Reveal>
            <Reveal delay={0.22}><div className="mt-9 flex flex-wrap justify-center gap-3"><CtaLink href="/contato?assunto=demonstracao">Solicitar demonstração</CtaLink><CtaLink href="/contato" variant="outline" arrow={false}>Falar com um especialista</CtaLink></div></Reveal>
          </div>
          <Reveal delay={0.3} className="mt-16"><ProductMockups /></Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Funcionalidades planejadas" title="Quatro módulos centrais, uma base de informação." />
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.t} delay={(i % 2) * 0.08} className="lift rounded-2xl border border-[#194D36]/8 p-8">
                <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F5F9F6]"><f.icon className="h-5 w-5 text-[#39845B]" strokeWidth={1.6} /></span><h3 className="text-xl font-bold">{f.t}</h3></div>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{f.items.map((it) => <li key={it} className="flex gap-2 text-[15px] text-[#58645D]"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#39845B]" />{it}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ALERTAS — destaque */}
      <section id="alertas" className="relative overflow-hidden bg-[#194D36] py-24 md:py-32 text-white">
        <div className="absolute inset-0 contour invert opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal><Eyebrow className="!text-[#B7DCC3]">Alertas automáticos por e-mail</Eyebrow></Reveal>
              <Reveal delay={0.06}><h2 className="mt-6 text-4xl md:text-5xl font-bold !text-white leading-[1.05]">Nenhum vencimento deve ser uma surpresa.</h2></Reveal>
              <Reveal delay={0.12}><p className="mt-6 text-lg text-white/75">O sistema permitirá configurar individualmente cada regra de alerta. Os avisos serão enviados por e-mail aos responsáveis cadastrados, conforme as regras configuradas.</p></Reveal>
              <div className="mt-10 grid grid-cols-2 gap-3">
                {alertParams.map((p, i) => (
                  <Reveal key={p.t} delay={i * 0.05} className="rounded-xl border border-white/12 bg-white/5 p-4">
                    <p.icon className="h-5 w-5 text-[#B7DCC3]" strokeWidth={1.5} />
                    <p className="mt-3 text-sm font-semibold">{p.t}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="rounded-2xl bg-white p-6 md:p-8 text-[#194D36]">
                  <div className="flex flex-wrap items-center justify-between gap-3"><p className="eyebrow">Exemplo ilustrativo</p><DemoTag /></div>
                  <p className="mt-4 text-2xl md:text-3xl font-bold">Licença de Operação com vencimento em <span className="font-mono text-[#39845B]">30/06/2027</span>.</p>
                  <div className="relative mt-12 mb-4">
                    <div className="absolute left-0 right-0 top-[18px] h-px bg-[#194D36]/15" />
                    <ol className="relative grid grid-cols-6">
                      {offsets.map((o, i) => (
                        <li key={o} className="flex flex-col items-center text-center">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#B7DCC3] ring-4 ring-white"><Mail className="h-4 w-4" /></span>
                          <span className="mt-3 font-mono text-lg font-bold">{o}</span>
                          <span className="text-[11px] text-[#58645D]">dias antes</span>
                          <span className={`mt-2 h-1 w-1 rounded-full bg-[#39845B] ${i === offsets.length - 1 ? "vd-pulse" : ""}`} />
                        </li>
                      ))}
                      <li className="flex flex-col items-center text-center">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#194D36] text-white ring-4 ring-white"><CalendarClock className="h-4 w-4" /></span>
                        <span className="mt-3 font-mono text-sm font-bold">30/06</span>
                        <span className="text-[11px] text-[#58645D]">vencimento</span>
                      </li>
                    </ol>
                  </div>
                  <div className="mt-8 rounded-xl border border-[#194D36]/10 bg-[#F5F9F6] p-5">
                    <p className="font-mono text-[11px] text-[#58645D]">Para: responsável cadastrado · Cc: destinatários da regra</p>
                    <p className="mt-2 font-semibold">[VERDANT CONTROL] Licença de Operação vence em 30 dias</p>
                    <p className="mt-2 text-sm text-[#58645D]">A Licença de Operação da unidade monitorada vence em 30/06/2027. Verifique o andamento do pedido de renovação e anexe as evidências na plataforma.</p>
                  </div>
                  <p className="mt-4 text-xs text-[#58645D]">Simulação de funcionalidade planejada. Nenhum e-mail é enviado por este site.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* IA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Inteligência artificial ambiental" title="IA para acelerar. Profissionais para validar." intro="A inteligência artificial da plataforma poderá apoiar a equipe em tarefas de leitura, organização e verificação." />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {ai.map((a, i) => <Reveal key={a} delay={i * 0.04}><li className="flex gap-3 rounded-xl bg-[#F5F9F6] p-4 text-[15px] text-[#194D36]"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#39845B]" />{a}</li></Reveal>)}
            </ul>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-3xl border-2 border-[#194D36] p-8 md:p-10">
              <UserCheck className="h-10 w-10 text-[#194D36]" strokeWidth={1.4} />
              <h3 className="mt-6 text-2xl md:text-3xl font-bold">Validação humana, sempre.</h3>
              <p className="mt-4 text-lg leading-relaxed text-[#58645D]">Informações técnicas e obrigações legais relevantes identificadas pela IA passam por validação de um profissional antes de serem consideradas na gestão. A IA sugere; o técnico responsável confirma.</p>
              <div className="mt-8 flex items-center gap-3 font-mono text-xs text-[#58645D]">
                <span className="rounded-full bg-[#F5F9F6] px-3 py-1.5">IA sugere</span><span>→</span><span className="rounded-full bg-[#F5F9F6] px-3 py-1.5">técnico revisa</span><span>→</span><span className="rounded-full bg-[#194D36] px-3 py-1.5 text-white">registro</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-[#B7DCC3] p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold">Quer ver o VERDANT CONTROL aplicado à sua operação?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-[#194D36]/80">Apresentamos a visão do produto, o roteiro de desenvolvimento e como ele se conecta à consultoria.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3"><CtaLink href="/contato?assunto=demonstracao">Solicitar demonstração</CtaLink><CtaLink href="/contato" variant="light" arrow={false}>Falar com um especialista</CtaLink></div>
          </div>
        </div>
      </section>
    </>
  );
}
