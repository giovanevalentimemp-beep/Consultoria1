import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import { Reveal, CtaLink, useSeo } from "@/components/site/primitives";
import { articles, formatDate } from "@/data/articles";
import { asset } from "@/config/site";
import NotFound from "./not-found";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);
  useSeo(article?.title ?? "Artigo não encontrado", article?.excerpt ?? "O conteúdo solicitado não foi encontrado.");
  if (!article) return <NotFound />;
  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).concat(articles.filter((a) => a.category !== article.category)).slice(0, 3);
  return (
    <>
      <article>
        <header className="bg-[#F5F9F6] pt-36 pb-16 md:pt-44">
          <div className="mx-auto max-w-3xl px-6">
            <Link href="/conteudos" className="inline-flex items-center gap-2 text-sm font-medium text-[#58645D] hover:text-[#194D36]" data-testid="link-back-blog"><ArrowLeft className="h-4 w-4" />Todos os conteúdos</Link>
            <Reveal><p className="mt-8 eyebrow">{article.category}</p></Reveal>
            <Reveal delay={0.06}><h1 className="mt-4 text-4xl md:text-5xl font-bold leading-[1.08]">{article.title}</h1></Reveal>
            <Reveal delay={0.1}><p className="mt-5 text-xl text-[#58645D]">{article.excerpt}</p></Reveal>
            <p className="mt-6 font-mono text-xs text-[#58645D]">{formatDate(article.date)} · {article.readTime} de leitura · Equipe VERDANT</p>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 -mt-2"><img src={asset(article.image)} alt="" className="aspect-[21/9] w-full rounded-2xl object-cover" /></div>
        <div className="mx-auto max-w-3xl px-6 py-16">
          {article.sections.map((s) => (
            <section key={s.heading} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">{s.heading}</h2>
              {s.paragraphs.map((p, i) => <p key={i} className="mt-5 text-lg leading-[1.8] text-[#3f4a44]">{p}</p>)}
            </section>
          ))}
          <div className="flex gap-3 rounded-xl bg-[#F5F9F6] p-5 text-sm text-[#58645D]"><Info className="h-5 w-5 shrink-0 text-[#39845B]" /><p>Conteúdo orientativo e de caráter geral. Prazos, procedimentos e exigências variam conforme a atividade, a localidade e as normas vigentes; confirme sempre nas fontes oficiais e com profissionais habilitados.</p></div>
          <div className="mt-10 rounded-2xl bg-[#194D36] p-8 text-white">
            <h2 className="text-2xl font-bold !text-white">Precisa aplicar isso à sua operação?</h2>
            <p className="mt-2 text-white/75">Nossa equipe avalia o seu cenário e propõe um escopo técnico.</p>
            <CtaLink href="/contato" variant="light" className="mt-6">Fale com um especialista</CtaLink>
          </div>
        </div>
      </article>
      <section className="border-t border-[#194D36]/8 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold">Continue lendo</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <Link key={a.slug} href={`/conteudos/${a.slug}`} className="lift group rounded-2xl border border-[#194D36]/8 p-6">
                <p className="eyebrow">{a.category}</p>
                <h3 className="mt-3 font-bold">{a.title}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#39845B]">Ler artigo <ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
