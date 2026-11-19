import { Target, Eye, Scale, Layers, ArrowRight } from "lucide-react";
import { PageHero, Reveal, SectionHeading, CtaLink, Eyebrow, useSeo } from "@/components/site/primitives";
import { asset } from "@/config/site";
import { FinalCta } from "./home";

const values = [
  ["Rigor técnico", "Toda recomendação parte de dados verificáveis e metodologia documentada."],
  ["Transparência", "Dizemos o que é possível, o que depende de terceiros e o que não podemos garantir."],
  ["Responsabilidade legal", "Conformidade é o ponto de partida, não um diferencial opcional."],
  ["Proximidade", "Um interlocutor que conhece a operação e responde com clareza."],
  ["Evolução contínua", "Processos e ferramentas revisados a cada ciclo."],
];

export default function AboutPage() {
  useSeo("A empresa", "Conheça a VERDANT AMBIENTAL: missão, visão, valores e a abordagem preventiva que integra consultoria técnica e tecnologia.");
  return (
    <>
      <PageHero eyebrow="A empresa" title={<>Conhecimento técnico e inovação a serviço da <span className="font-display italic font-normal text-[#39845B]">gestão ambiental.</span></>} intro="Somos uma consultoria ambiental voltada a empresas que precisam de segurança técnica e jurídica para operar — e de informação organizada para decidir." image={asset("images/office.jpg")}>
        <CtaLink href="/contato">Fale com a equipe</CtaLink>
      </PageHero>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHeading eyebrow="Nossa história" title="Nascemos de uma inquietação prática." /></div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-lg leading-relaxed text-[#58645D]">
            <Reveal><p>A VERDANT AMBIENTAL foi concebida a partir de uma observação recorrente no dia a dia das indústrias: obrigações ambientais dispersas em planilhas, e-mails e pastas, prazos descobertos tarde demais e decisões tomadas sem uma visão consolidada da situação.</p></Reveal>
            <Reveal delay={0.05}><p>Nossa proposta é reunir em um mesmo lugar a experiência da consultoria técnica tradicional e a eficiência de uma plataforma tecnológica própria. A consultoria interpreta, planeja e conduz; a tecnologia organiza, lembra e evidencia.</p></Reveal>
            <Reveal delay={0.1}><p className="text-sm italic">Esta narrativa institucional é demonstrativa e será atualizada com a trajetória real da empresa.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F9F6] py-24">
        <div className="mx-auto max-w-7xl px-6 grid gap-4 md:grid-cols-2">
          {[{ icon: Target, t: "Missão", d: "Oferecer às empresas uma gestão ambiental segura, organizada e tecnicamente fundamentada, reduzindo riscos e simplificando o cumprimento das obrigações." },
            { icon: Eye, t: "Visão", d: "Ser reconhecida como referência em consultoria ambiental integrada à tecnologia, pela qualidade técnica e pela clareza com que conduz cada projeto." }].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08} className="rounded-2xl bg-white p-10 border border-[#194D36]/8">
              <c.icon className="h-7 w-7 text-[#39845B]" strokeWidth={1.5} />
              <h3 className="mt-8 font-display text-4xl font-normal">{c.t}</h3>
              <p className="mt-4 text-lg leading-relaxed text-[#58645D]">{c.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6">
          <SectionHeading eyebrow="Valores" title="O que orienta cada entrega." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-[#194D36]/10 sm:grid-cols-2 lg:grid-cols-5">
            {values.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05} className="bg-white p-7 h-full">
                <span className="font-mono text-xs text-[#39845B]">0{i + 1}</span>
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#58645D]">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Nossa abordagem" title="Do reativo ao preventivo, estruturado e baseado em evidências." intro="Substituímos a gestão ambiental que só reage a fiscalizações e vencimentos por um modelo que antecipa, organiza e comprova." />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <Reveal className="rounded-2xl border border-[#194D36]/10 p-8">
              <p className="eyebrow !text-[#58645D]">Gestão reativa</p>
              <ul className="mt-6 space-y-4 text-[#58645D]">{["Prazos descobertos na véspera", "Documentos espalhados", "Respostas improvisadas a órgãos", "Custos com urgências"].map((x) => <li key={x} className="border-b border-[#194D36]/8 pb-3 line-through decoration-[#194D36]/20">{x}</li>)}</ul>
            </Reveal>
            <div className="hidden lg:grid place-items-center"><ArrowRight className="h-8 w-8 text-[#39845B]" /></div>
            <Reveal delay={0.1} className="rounded-2xl bg-[#194D36] p-8 text-white">
              <p className="eyebrow !text-[#B7DCC3]">Gestão preventiva</p>
              <ul className="mt-6 space-y-4">{["Calendário antecipado com alertas", "Acervo único e versionado", "Posicionamento técnico fundamentado", "Previsibilidade orçamentária"].map((x) => <li key={x} className="border-b border-white/10 pb-3">{x}</li>)}</ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F9F6] py-24">
        <div className="mx-auto max-w-7xl px-6 grid gap-6 md:grid-cols-3">
          {[{ icon: Layers, t: "Filosofia de trabalho", d: "Entendemos a operação antes de propor qualquer escopo. Cada plano é desenhado a partir do diagnóstico, com prioridades por risco e responsabilidades claras." },
            { icon: Scale, t: "Compromisso com conformidade legal", d: "Trabalhamos para que a empresa cumpra integralmente suas obrigações. Não prometemos aprovações: elas cabem aos órgãos competentes. Prometemos rigor e transparência." },
            { icon: Target, t: "Consultoria + tecnologia", d: "O VERDANT CONTROL nasce da prática da consultoria. A plataforma organiza a informação; os profissionais validam e decidem." }].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08} className="lift rounded-2xl bg-white p-8 border border-[#194D36]/8">
              <c.icon className="h-6 w-6 text-[#39845B]" strokeWidth={1.5} />
              <h3 className="mt-6 text-xl font-bold">{c.t}</h3>
              <p className="mt-3 leading-relaxed text-[#58645D]">{c.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-6 mt-14"><Eyebrow>Próximo passo</Eyebrow><div className="mt-5 flex flex-wrap gap-3"><CtaLink href="/servicos">Ver serviços</CtaLink><CtaLink href="/equipe-tecnica" variant="outline">Conhecer a equipe</CtaLink></div></div>
      </section>
      <FinalCta />
    </>
  );
}
