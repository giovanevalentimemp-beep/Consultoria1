import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, FileText, CalendarDays, ListChecks, BellRing, Search, Upload, Sparkles, ChevronLeft, ChevronRight, Filter, Mail, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const screens = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documentos", label: "Documentos", icon: FileText },
  { id: "calendario", label: "Calendário", icon: CalendarDays },
  { id: "condicionantes", label: "Condicionantes", icon: ListChecks },
  { id: "alertas", label: "Alertas", icon: BellRing },
] as const;
type ScreenId = (typeof screens)[number]["id"];

const pill = (tone: "ok" | "warn" | "crit" | "info") =>
  cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
    tone === "ok" && "bg-[#B7DCC3]/50 text-[#194D36]",
    tone === "warn" && "bg-amber-100 text-amber-800",
    tone === "crit" && "bg-red-100 text-red-700",
    tone === "info" && "bg-slate-100 text-slate-600");

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "warn" | "crit" }) {
  return (
    <div className="rounded-lg border border-[#194D36]/10 bg-white p-3">
      <p className="text-[10px] text-[#58645D]">{label}</p>
      <p className={cn("mt-1 text-xl font-bold font-mono", tone === "crit" ? "text-red-600" : tone === "warn" ? "text-amber-600" : "text-[#194D36]")}>{value}</p>
      <p className="text-[10px] text-[#58645D]/80">{note}</p>
    </div>
  );
}

function Dashboard() {
  const bars = [62, 68, 71, 69, 74, 78, 81, 79, 84, 86, 83, 88];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Licenças vigentes" value="14" note="2 em renovação" />
        <Kpi label="Obrigações pendentes" value="9" note="3 nesta semana" tone="warn" />
        <Kpi label="Docs. a vencer (90d)" value="6" note="próximo: 18 dias" tone="warn" />
        <Kpi label="Pendências críticas" value="2" note="requer ação" tone="crit" />
      </div>
      <div className="grid md:grid-cols-5 gap-3">
        <div className="md:col-span-3 rounded-lg border border-[#194D36]/10 bg-white p-3">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#194D36]">Índice de conformidade</p><span className="text-[10px] text-[#58645D]">últimos 12 meses</span></div>
          <div className="mt-3 flex h-28 items-end gap-1.5">
            {bars.map((b, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.03, duration: 0.5 }} style={{ height: `${b}%`, transformOrigin: "bottom" }} className={cn("w-full rounded-sm", i === bars.length - 1 ? "bg-[#194D36]" : "bg-[#B7DCC3]")} />
                <span className="text-[8px] text-[#58645D]">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 rounded-lg border border-[#194D36]/10 bg-white p-3">
          <p className="text-xs font-semibold text-[#194D36]">Situação por área</p>
          {[["Licenciamento", 92], ["Resíduos", 78], ["Federais", 85], ["Condicionantes", 64]].map(([l, v]) => (
            <div key={l} className="mt-2.5">
              <div className="flex justify-between text-[10px] text-[#58645D]"><span>{l}</span><span className="font-mono">{v}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-[#F5F9F6]"><div className="h-full rounded-full bg-[#39845B]" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[#194D36]/10 bg-white p-3">
        <p className="text-xs font-semibold text-[#194D36] mb-2">Pendências críticas</p>
        {[["Renovação LO — Unidade Guarulhos", "Protocolo em 18 dias", "crit"], ["CDF ausente — lote resíduo classe I (mar)", "Fornecedor notificado", "crit"], ["Relatório de monitoramento de ruído", "Vence em 26 dias", "warn"]].map(([a, b, t]) => (
          <div key={a} className="flex items-center justify-between border-t border-[#194D36]/6 py-2 text-[11px]"><span className="text-[#194D36]">{a}</span><span className={pill(t as "crit" | "warn")}>{b}</span></div>
        ))}
      </div>
    </div>
  );
}

function Documents() {
  const rows = [
    ["LO_Guarulhos_2023.pdf", "Licença", "v3", "30/06/2027", "ok", "Vigente"],
    ["PGRS_Rev04.pdf", "Plano", "v4", "12/11/2025", "warn", "Revisar"],
    ["MTR_2025_03_lote12.pdf", "Resíduos", "v1", "—", "ok", "Conciliado"],
    ["Laudo_Ruido_Perimetral.pdf", "Laudo", "v2", "08/09/2025", "warn", "A vencer"],
    ["CTF_Comprovante_2025.pdf", "Federal", "v1", "31/03/2026", "ok", "Vigente"],
    ["Outorga_Captacao.pdf", "Autorização", "v2", "14/07/2025", "crit", "Vencido"],
  ];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-1 min-w-[180px] items-center gap-2 rounded-lg border border-[#194D36]/10 bg-white px-3 py-2 text-[11px] text-[#58645D]"><Search className="h-3.5 w-3.5" />Pesquisar: "licenças com condicionante de ruído"</div>
        <span className="flex items-center gap-1.5 rounded-lg border border-[#194D36]/10 bg-white px-3 py-2 text-[11px] text-[#194D36]"><Filter className="h-3.5 w-3.5" />Categorias</span>
        <span className="flex items-center gap-1.5 rounded-lg bg-[#194D36] px-3 py-2 text-[11px] text-white"><Upload className="h-3.5 w-3.5" />Enviar documento</span>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2 overflow-x-auto rounded-lg border border-[#194D36]/10 bg-white">
          <table className="w-full text-[11px]">
            <thead className="bg-[#F5F9F6] text-left text-[#58645D]"><tr>{["Documento", "Categoria", "Versão", "Vencimento", "Status"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r[0]} className="border-t border-[#194D36]/6"><td className="px-3 py-2 font-medium text-[#194D36] whitespace-nowrap">{r[0]}</td><td className="px-3 py-2 text-[#58645D]">{r[1]}</td><td className="px-3 py-2 font-mono">{r[2]}</td><td className="px-3 py-2 font-mono whitespace-nowrap">{r[3]}</td><td className="px-3 py-2"><span className={pill(r[4] as "ok")}>{r[5]}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="rounded-lg border border-[#39845B]/30 bg-[#F5F9F6] p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#194D36]"><Sparkles className="h-3.5 w-3.5 text-[#39845B]" />Leitura por IA</p>
          <p className="mt-1 text-[10px] text-[#58645D]">LO_Guarulhos_2023.pdf</p>
          {[["Tipo", "Licença de Operação"], ["Validade", "30/06/2027"], ["Condicionantes", "11 identificadas"], ["Órgão", "Órgão estadual"]].map(([k, v]) => (
            <div key={k} className="mt-2 flex justify-between text-[11px]"><span className="text-[#58645D]">{k}</span><span className="font-semibold text-[#194D36]">{v}</span></div>
          ))}
          <div className="mt-3 flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-[10px] text-amber-800"><UserCheck className="h-3 w-3" />Aguardando validação humana</div>
        </div>
      </div>
    </div>
  );
}

function CalendarScreen() {
  const events: Record<number, { t: string; tone: "ok" | "warn" | "crit" | "info" }> = {
    4: { t: "RAPP", tone: "info" }, 9: { t: "MTR lote", tone: "ok" }, 14: { t: "Outorga", tone: "crit" }, 18: { t: "Prot. LO", tone: "warn" }, 22: { t: "Insp. campo", tone: "ok" }, 27: { t: "Laudo ruído", tone: "warn" }, 30: { t: "Cond. 07", tone: "info" },
  };
  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div className="md:col-span-3 rounded-lg border border-[#194D36]/10 bg-white p-3">
        <div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#194D36]">Julho 2025</p><div className="flex gap-1 text-[#58645D]"><ChevronLeft className="h-4 w-4" /><ChevronRight className="h-4 w-4" /></div></div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[9px] text-[#58645D]">{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 1; const e = events[day];
            return (
              <div key={i} className={cn("min-h-[44px] rounded-md border p-1 text-[9px]", day < 1 || day > 31 ? "border-transparent" : "border-[#194D36]/6 bg-[#F5F9F6]/60")}>
                {day >= 1 && day <= 31 && <><span className="font-mono text-[#58645D]">{day}</span>{e && <span className={cn(pill(e.tone), "mt-0.5 block truncate px-1 text-[8px]")}>{e.t}</span>}</>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-lg border border-[#194D36]/10 bg-white p-3">
        <p className="text-xs font-semibold text-[#194D36]">Próximos 30 dias</p>
        {Object.entries(events).map(([d, e]) => (
          <div key={d} className="mt-2 flex items-center gap-2 text-[11px]"><span className="w-7 font-mono text-[#58645D]">{d.padStart(2, "0")}/07</span><span className={pill(e.tone)}>{e.t}</span></div>
        ))}
      </div>
    </div>
  );
}

function Conditions() {
  const rows = [
    ["07", "Apresentar relatório semestral de monitoramento", "Helena S.", "30/07/2025", 70, "warn", "Em andamento"],
    ["08", "Manter registros de destinação de resíduos", "Camila F.", "Contínua", 100, "ok", "Atendida"],
    ["09", "Realizar medição de ruído no perímetro", "Bruno C.", "27/07/2025", 40, "warn", "Em andamento"],
    ["10", "Comunicar alterações de processo ao órgão", "Ricardo A.", "Sob demanda", 100, "ok", "Atendida"],
    ["11", "Renovar outorga de captação", "Helena S.", "14/07/2025", 15, "crit", "Atrasada"],
  ];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#194D36]/10 bg-white p-3">
        <div><p className="text-xs font-semibold text-[#194D36]">LO nº 0000/2023 — Unidade Guarulhos</p><p className="text-[10px] text-[#58645D]">11 condicionantes extraídas por IA · 11 validadas por técnico responsável</p></div>
        <span className="flex items-center gap-1 rounded-full bg-[#B7DCC3]/50 px-2.5 py-1 text-[10px] font-semibold text-[#194D36]"><UserCheck className="h-3 w-3" />Validação humana concluída</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#194D36]/10 bg-white">
        <table className="w-full text-[11px]">
          <thead className="bg-[#F5F9F6] text-left text-[#58645D]"><tr>{["Nº", "Condicionante", "Responsável", "Prazo", "Evidências", "Status"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r[0] as string} className="border-t border-[#194D36]/6">
              <td className="px-3 py-2 font-mono">{r[0]}</td><td className="px-3 py-2 text-[#194D36] min-w-[200px]">{r[1]}</td><td className="px-3 py-2 text-[#58645D] whitespace-nowrap">{r[2]}</td><td className="px-3 py-2 font-mono whitespace-nowrap">{r[3]}</td>
              <td className="px-3 py-2"><div className="h-1.5 w-16 rounded-full bg-[#F5F9F6]"><div className="h-full rounded-full bg-[#39845B]" style={{ width: `${r[4]}%` }} /></div></td>
              <td className="px-3 py-2"><span className={pill(r[5] as "ok")}>{r[6]}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Alerts() {
  const offsets = [90, 60, 30, 15, 7];
  return (
    <div className="grid md:grid-cols-5 gap-3">
      <div className="md:col-span-3 rounded-lg border border-[#194D36]/10 bg-white p-3 space-y-3">
        <p className="text-xs font-semibold text-[#194D36]">Regra de alerta</p>
        {[["Documento monitorado", "Licença de Operação — Unidade Guarulhos"], ["Data de vencimento", "30/06/2027"], ["Responsável", "Helena Santos"], ["Destinatários", "meio.ambiente@empresa · diretoria@empresa"], ["Frequência", "Aviso único por marco + resumo semanal"]].map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-2 text-[11px]"><span className="text-[#58645D]">{k}</span><span className="col-span-2 rounded-md border border-[#194D36]/10 bg-[#F5F9F6] px-2 py-1.5 text-[#194D36]">{v}</span></div>
        ))}
        <div>
          <p className="text-[11px] text-[#58645D]">Antecedência dos alertas</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">{offsets.map((o) => <span key={o} className="rounded-full bg-[#194D36] px-2.5 py-1 font-mono text-[10px] text-white">{o} dias antes</span>)}</div>
        </div>
      </div>
      <div className="md:col-span-2 rounded-lg border border-[#194D36]/10 bg-white p-3">
        <p className="text-xs font-semibold text-[#194D36]">Programação de envios</p>
        <ol className="mt-2 space-y-2">
          {[["01/04/2027", 90], ["01/05/2027", 60], ["31/05/2027", 30], ["15/06/2027", 15], ["23/06/2027", 7]].map(([d, o]) => (
            <li key={o} className="flex items-center gap-2 text-[11px]"><Mail className="h-3.5 w-3.5 text-[#39845B]" /><span className="font-mono text-[#194D36]">{d}</span><span className="text-[#58645D]">· {o} dias antes</span><span className={cn(pill("info"), "ml-auto")}>Agendado</span></li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const views: Record<ScreenId, ComponentType> = { dashboard: Dashboard, documentos: Documents, calendario: CalendarScreen, condicionantes: Conditions, alertas: Alerts };

export default function ProductMockups({ initial = "dashboard" }: { initial?: ScreenId }) {
  const [active, setActive] = useState<ScreenId>(initial);
  const View = views[active];
  return (
    <div>
      <div role="tablist" aria-label="Telas demonstrativas do VERDANT CONTROL" className="flex flex-wrap justify-center gap-2">
        {screens.map((s) => (
          <button key={s.id} role="tab" aria-selected={active === s.id} onClick={() => setActive(s.id)} data-testid={`tab-mockup-${s.id}`}
            className={cn("flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition", active === s.id ? "bg-[#194D36] text-white" : "bg-white text-[#194D36] border border-[#194D36]/12 hover:border-[#194D36]/40")}>
            <s.icon className="h-4 w-4" />{s.label}
          </button>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#194D36]/12 bg-white shadow-[0_40px_80px_-40px_rgba(25,77,54,.45)]">
        <div className="flex items-center gap-2 border-b border-[#194D36]/8 bg-[#F5F9F6] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#194D36]/15" /><span className="h-2.5 w-2.5 rounded-full bg-[#194D36]/15" /><span className="h-2.5 w-2.5 rounded-full bg-[#194D36]/15" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 font-mono text-[10px] text-[#58645D]">control.verdant / {active}</span>
          <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-[#39845B]">Dados demonstrativos</span>
        </div>
        <div className="flex">
          <aside className="hidden md:flex w-44 shrink-0 flex-col gap-1 border-r border-[#194D36]/8 bg-[#194D36] p-3 text-white/70">
            <p className="mb-3 px-2 text-[11px] font-extrabold tracking-[0.2em] text-white">CONTROL</p>
            {screens.map((s) => (
              <span key={s.id} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]", active === s.id && "bg-white/12 text-white")}><s.icon className="h-3.5 w-3.5" />{s.label}</span>
            ))}
            <span className="mt-auto rounded-md bg-white/8 p-2 text-[9px] leading-snug">Unidade: Guarulhos/SP<br />Indústria demonstrativa</span>
          </aside>
          <div className="min-h-[420px] flex-1 bg-[#F5F9F6]/50 p-4">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-[#58645D]">Simulação visual da interface em desenvolvimento. Empresas, nomes, datas e valores são fictícios.</p>
    </div>
  );
}
