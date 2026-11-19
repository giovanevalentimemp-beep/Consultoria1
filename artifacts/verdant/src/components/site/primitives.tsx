import { type ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="14" fill={light ? "#B7DCC3" : "#194D36"} />
        <path d="M16 18 L32 46 L48 18" fill="none" stroke={light ? "#194D36" : "#B7DCC3"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="18" r="4" fill="#39845B" />
      </svg>
      <span className="leading-none">
        <span className={cn("block text-[15px] font-extrabold tracking-[0.18em]", light ? "text-white" : "text-[#194D36]")}>{siteConfig.company.logoText}</span>
        <span className={cn("block text-[9px] font-semibold tracking-[0.42em] mt-1", light ? "text-[#B7DCC3]" : "text-[#39845B]")}>{siteConfig.company.logoSubtext}</span>
      </span>
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", className }: { eyebrow: string; title: ReactNode; intro?: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl md:text-[2.75rem] md:leading-[1.08] font-bold">{title}</h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-[#58645D]">{intro}</p>}
    </Reveal>
  );
}

type BtnVariant = "primary" | "outline" | "light" | "ghost";
const btnStyles: Record<BtnVariant, string> = {
  primary: "bg-[#194D36] text-white hover:bg-[#123a29]",
  outline: "border border-[#194D36]/25 text-[#194D36] hover:border-[#194D36] hover:bg-[#F5F9F6]",
  light: "bg-white text-[#194D36] hover:bg-[#B7DCC3]",
  ghost: "text-[#194D36] hover:text-[#39845B] px-0",
};
export const btnClass = (v: BtnVariant = "primary", extra?: string) =>
  cn("group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39845B] focus-visible:ring-offset-2", btnStyles[v], extra);

export function CtaLink({ href, children, variant = "primary", className, arrow = true, testId }: { href: string; children: ReactNode; variant?: BtnVariant; className?: string; arrow?: boolean; testId?: string }) {
  return (
    <Link href={href} className={btnClass(variant, className)} data-testid={testId}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
}

export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: ReactNode; intro: ReactNode; image?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#F5F9F6] pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="absolute inset-0 contour opacity-70" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-end">
        <div className={image ? "lg:col-span-7" : "lg:col-span-10"}>
          <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
          <Reveal delay={0.08}><h1 className="mt-6 text-4xl md:text-6xl md:leading-[1.03] font-bold">{title}</h1></Reveal>
          <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-[#58645D]">{intro}</p></Reveal>
          {children && <Reveal delay={0.24}><div className="mt-9 flex flex-wrap gap-3">{children}</div></Reveal>}
        </div>
        {image && (
          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function DemoTag({ children = "Demonstrativo", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-[#39845B]/30 bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#39845B]", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#39845B]" />{children}
    </span>
  );
}

export function useSeo(title: string, description: string) {
  useEffect(() => {
    const full = title.includes("VERDANT") ? title : `${title} | ${siteConfig.company.name}`;
    document.title = full;
    const set = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    set('meta[name="description"]', "name", "description", description);
    set('meta[property="og:title"]', "property", "og:title", full);
    set('meta[property="og:description"]', "property", "og:description", description);
    set('meta[name="twitter:title"]', "name", "twitter:title", full);
    set('meta[name="twitter:description"]', "name", "twitter:description", description);
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = siteConfig.company.siteUrl + window.location.pathname;
  }, [title, description]);
}
