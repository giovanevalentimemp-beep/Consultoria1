import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero, Reveal, useSeo } from "@/components/site/primitives";
import { articles, formatDate } from "@/data/articles";
import { asset } from "@/config/site";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  useSeo("Conteúdos", "Artigos sobre licenciamento ambiental, PGRS, MTR e CDF, CTF/APP, RAPP, TCFA, auditorias e tecnologia na gestão ambiental.");
  const cats = useMemo(() => ["Todos", ...Array.from(new Set(articles.map((a) => a.category)))], []);
  const [cat, setCat] = useState("Todos");
  const list = cat === "Todos" ? articles : articles.filter((a) => a.category === cat);
  const [feat, ...rest] = list;
  return (
    <>
      <PageHero eyebrow="Conteúdos" title={<>Conhecimento técnico, <span className="font-display italic font-normal text-[#39845B]">explicado com clareza.</span></>} intro="Artigos orientativos para gestores e equipes de meio ambiente. Conteúdo de caráter geral, que não substitui a análise técnica do seu caso." />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} data-testid={`button-filter-${c}`}
                className={cn("rounded-full px-4 py-2 text-sm font-medium transition", cat === c ? "bg-[#194D36] text-white" : "border border-[#194D36]/12 text-[#58645D] hover:text-[#194D36]")}>{c}</button>
            ))}
          </div>
          {feat && (
            <Reveal key={feat.slug} className="mt-12">
              <Link href={`/conteudos/${feat.slug}`} className="group grid overflow-hidden rounded-3xl border border-[#194D36]/8 md:grid-cols-2">
                <img src={asset(feat.image)} alt="" className="h-72 md:h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="flex flex-col p-8 md:p-12 bg-[#F5F9F6]">
                  <p className="eyebrow">{feat.category} · Em destaque</p>
                  <h2 className="mt-4 text-3xl md:text-4xl font-bold">{feat.title}</h2>
                  <p className="mt-4 text-lg text-[#58645D]">{feat.excerpt}</p>
                  <div className="mt-auto pt-8 flex items-center justify-between text-sm text-[#58645D]"><span>{formatDate(feat.date)} · {feat.readTime}</span><span className="inline-flex items-center gap-1 font-semibold text-[#194D36]">Ler artigo <ArrowUpRight className="h-4 w-4" /></span></div>
                </div>
              </Link>
            </Reveal>
          )}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                <article className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-[#194D36]/8 bg-white" data-testid={`card-article-${a.slug}`}>
                  <div className="overflow-hidden"><img src={asset(a.image)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs"><span className="rounded-full bg-[#F5F9F6] px-2.5 py-1 font-semibold text-[#39845B]">{a.category}</span><span className="flex items-center gap-1 text-[#58645D]"><Clock className="h-3 w-3" />{a.readTime}</span></div>
                    <h3 className="mt-4 text-lg font-bold leading-snug">{a.title}</h3>
                    <p className="mt-2 text-sm text-[#58645D]">{a.excerpt}</p>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <span className="text-xs text-[#58645D]">{formatDate(a.date)}</span>
                      <Link href={`/conteudos/${a.slug}`} className="inline-flex items-center gap-1 rounded-full bg-[#194D36] px-4 py-2 text-xs font-semibold text-white hover:bg-[#39845B] transition" data-testid={`link-read-${a.slug}`}>Ler artigo <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-center text-xs text-[#58645D]">Datas de publicação demonstrativas. Novos artigos serão publicados periodicamente.</p>
        </div>
      </section>
    </>
  );
}
