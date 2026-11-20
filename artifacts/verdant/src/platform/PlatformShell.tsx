import type { ReactNode } from "react";
import { useClerk } from "@clerk/react";
import {
  Activity,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Leaf,
  ListChecks,
  LogOut,
  Recycle,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/site/primitives";
import { usePlatform } from "@/platform/context";

const navigation = [
  { href: "/controle/documentos", label: "Documentos", icon: FileText },
  { href: "/controle/licencas", label: "Licenças", icon: FileCheck2 },
  { href: "/controle/condicionantes", label: "Condicionantes", icon: ListChecks },
  { href: "/controle/obrigacoes", label: "Obrigações", icon: ShieldCheck },
  { href: "/controle/planos", label: "Planos de ação", icon: ClipboardCheck },
  { href: "/controle/residuos", label: "Resíduos", icon: Recycle },
  { href: "/controle/ibama", label: "IBAMA", icon: Leaf },
  { href: "/controle/monitoramentos", label: "Monitoramentos", icon: Activity },
  { href: "/controle/auditorias", label: "Auditorias", icon: ClipboardList },
];

const selectClass =
  "min-w-0 rounded-lg border border-[#194D36]/15 bg-white px-3 py-2 text-sm text-[#194D36] outline-none focus:border-[#39845B] focus:ring-2 focus:ring-[#B7DCC3]/60";

export default function PlatformShell({ children }: { children: ReactNode }) {
  const { me, company, companyId, setCompanyId, units, unitId, setUnitId } =
    usePlatform();
  const { signOut } = useClerk();
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-[#F5F9F6] text-[#194D36]">
      <header className="sticky top-0 z-30 border-b border-[#194D36]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/controle" aria-label="VERDANT CONTROL">
            <Logo />
          </Link>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <label className="sr-only" htmlFor="control-company">Empresa</label>
            <select
              id="control-company"
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
              className={`${selectClass} max-w-[220px]`}
              aria-label="Selecionar empresa"
              data-testid="select-company"
            >
              {me.companies.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="control-unit">Unidade</label>
            <select
              id="control-unit"
              value={unitId ?? ""}
              onChange={(event) => setUnitId(event.target.value || null)}
              className={`${selectClass} max-w-[200px]`}
              aria-label="Filtrar por unidade"
              data-testid="select-unit"
            >
              <option value="">Todas as unidades</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.title}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: basePathOrRoot() })}
              className="inline-flex items-center gap-2 rounded-full border border-[#194D36]/15 px-3 py-2 text-sm font-semibold text-[#194D36] transition hover:bg-[#F5F9F6]"
              data-testid="button-sign-out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-7 lg:py-7">
        <nav aria-label="Módulos do VERDANT CONTROL" className="min-w-0">
          <div className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = location === href || location.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#194D36] text-white shadow-sm"
                      : "text-[#58645D] hover:bg-white hover:text-[#194D36]"
                  }`}
                  data-testid={`nav-${href.split("/").at(-1)}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#58645D] transition hover:bg-white hover:text-[#194D36]"
              data-testid="link-public-site"
            >
              <Leaf className="h-4 w-4" />
              Site institucional
            </Link>
          </div>
        </nav>

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function basePathOrRoot() {
  return import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
}
