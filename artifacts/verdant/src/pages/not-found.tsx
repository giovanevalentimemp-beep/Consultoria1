import { Link } from "wouter";
import { CtaLink, useSeo } from "@/components/site/primitives";
import { navItems } from "@/layouts/SiteLayout";

export default function NotFound() {
  useSeo("Página não encontrada", "O endereço acessado não existe ou foi movido.");
  return (
    <section className="relative overflow-hidden bg-[#F5F9F6] pt-40 pb-28">
      <div className="absolute inset-0 contour" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-6">
        <p className="font-mono text-sm text-[#39845B]">ERRO 404 · COORDENADA NÃO MAPEADA</p>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1]">Esta área ainda não foi <span className="font-display italic font-normal text-[#39845B]">licenciada.</span></h1>
        <p className="mt-6 max-w-xl text-lg text-[#58645D]">O endereço acessado não existe ou foi movido. Use um dos caminhos abaixo para continuar.</p>
        <div className="mt-10 flex flex-wrap gap-3"><CtaLink href="/">Voltar ao início</CtaLink><CtaLink href="/contato" variant="outline" arrow={false}>Falar conosco</CtaLink></div>
        <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#194D36]/10 pt-6 text-sm">
          {navItems.map((n) => <Link key={n.href} href={n.href} className="text-[#58645D] hover:text-[#194D36]">{n.label}</Link>)}
        </div>
      </div>
    </section>
  );
}
