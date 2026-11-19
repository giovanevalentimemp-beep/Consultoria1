import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Mail, Phone, MapPin, MessageCircle, ArrowUpRight, LogIn } from "lucide-react";
import { Logo, btnClass } from "@/components/site/primitives";
import { siteConfig, fullAddress, whatsappUrl } from "@/config/site";
import { serviceCategories } from "@/data/services";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/", label: "Início" },
  { href: "/a-empresa", label: "A empresa" },
  { href: "/servicos", label: "Serviços" },
  { href: "/tecnologia", label: "Tecnologia" },
  { href: "/equipe-tecnica", label: "Equipe técnica" },
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/contato", label: "Contato" },
];

export function useWhatsApp() {
  const { toast } = useToast();
  return () => {
    const url = whatsappUrl();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else toast({ title: "WhatsApp ainda não configurado", description: `O número oficial será definido na configuração central. Enquanto isso, fale conosco pelo telefone ${siteConfig.contact.phone} ou pelo e-mail ${siteConfig.contact.email}.` });
  };
}

function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location]);
  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled || open ? "bg-white/90 backdrop-blur-xl border-b border-[#194D36]/8 py-3" : "py-5")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Página inicial" data-testid="link-logo"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Menu principal">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} data-testid={`link-nav-${n.href.replace("/", "") || "inicio"}`}
              className={cn("relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors", isActive(n.href) ? "text-[#194D36]" : "text-[#58645D] hover:text-[#194D36]")}>
              {n.label}
              {isActive(n.href) && <motion.span layoutId="nav-dot" className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[#39845B]" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/acesso" className={btnClass("primary", "hidden sm:inline-flex py-2.5 px-5")} data-testid="link-acessar-plataforma">
            <LogIn className="h-4 w-4" /> Acessar plataforma
          </Link>
          <button className="lg:hidden rounded-full p-2.5 text-[#194D36] hover:bg-[#F5F9F6]" onClick={() => setOpen((o) => !o)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} data-testid="button-mobile-menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="lg:hidden mx-auto max-w-7xl px-6 pb-6 pt-4" aria-label="Menu mobile">
            {navItems.map((n) => (
              <Link key={n.href} href={n.href} className={cn("flex items-center justify-between border-b border-[#194D36]/8 py-4 text-lg font-semibold", isActive(n.href) ? "text-[#39845B]" : "text-[#194D36]")}>
                {n.label}<ArrowUpRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
            <Link href="/acesso" className={btnClass("primary", "mt-6 w-full")}><LogIn className="h-4 w-4" /> Acessar plataforma</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const c = siteConfig.contact;
  return (
    <footer className="relative bg-[#194D36] text-white/75 overflow-hidden">
      <div className="absolute inset-0 gridlines opacity-[0.25] invert" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">{siteConfig.company.description}</p>
            <p className="mt-4 font-display text-2xl italic text-[#B7DCC3]">{siteConfig.company.slogan}</p>
          </div>
          <div className="lg:col-span-2">
            <h3 className="eyebrow !text-[#B7DCC3]">Navegação</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navItems.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-white transition">{n.label}</Link></li>)}
              <li><Link href="/acesso" className="hover:text-white transition">Acessar plataforma</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="eyebrow !text-[#B7DCC3]">Serviços</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {serviceCategories.map((s) => <li key={s.id}><Link href={`/servicos#${s.id}`} className="hover:text-white transition">{s.title}</Link></li>)}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="eyebrow !text-[#B7DCC3]">Contato</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#B7DCC3]" />{fullAddress()}</li>
              <li><a href={`tel:${c.phoneHref}`} className="flex gap-3 hover:text-white"><Phone className="h-4 w-4 shrink-0 text-[#B7DCC3]" />{c.phone}</a></li>
              <li><a href={`mailto:${c.email}`} className="flex gap-3 hover:text-white break-all"><Mail className="h-4 w-4 shrink-0 text-[#B7DCC3]" />{c.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.company.name}. Empresa e dados fictícios para fins de apresentação.</p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="hover:text-white">Política de privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-white">Termos de uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  const open = useWhatsApp();
  return (
    <button onClick={open} aria-label="Contato via WhatsApp" data-testid="button-whatsapp-float"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#194D36] p-4 text-white shadow-[0_16px_40px_-14px_rgba(25,77,54,.6)] transition hover:bg-[#39845B] hover:scale-105">
      <MessageCircle className="h-5 w-5" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 group-hover:max-w-[120px]">WhatsApp</span>
    </button>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
    else setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 120);
  }, [location]);
  return (
    <div className="grain min-h-[100dvh] flex flex-col bg-white">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#194D36] focus:px-4 focus:py-2 focus:text-white">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
