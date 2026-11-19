import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Check, ChevronsUpDown, RotateCcw, Search, X } from "lucide-react";
import { useListControlDocuments, useListControlRecords } from "@workspace/api-client-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { KINDS, type Kind, type Tone } from "@/platform/modules";
import { usePlatform } from "@/platform/context";

export function fmtDate(s?: string | null) {
  if (!s) return "—";
  const [y, m, d] = s.slice(0, 10).split("-");
  return d ? `${d}/${m}/${y}` : s;
}
export function fmtDateTime(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
export function daysUntil(s?: string | null) {
  if (!s) return null;
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d).getTime() - t.getTime()) / 86400000);
}
export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

const toneCls: Record<Tone, string> = {
  ok: "bg-[#E6F2EA] text-[#1F6A43] ring-[#39845B]/20",
  warn: "bg-[#FBF1DD] text-[#8A5A0B] ring-[#C98A1B]/25",
  bad: "bg-[#FBE7E4] text-[#A2332A] ring-[#B8463B]/25",
  info: "bg-[#E8F0F4] text-[#2C5A70] ring-[#2C5A70]/20",
  mute: "bg-[#EEF1EF] text-[#58645D] ring-[#58645D]/15",
};
export function Pill({ tone = "mute", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset whitespace-nowrap", toneCls[tone], className)}>
    <span className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-70", tone === "warn" && "vd-pulse")} />{children}</span>;
}

export function DueChip({ date }: { date?: string | null }) {
  const n = daysUntil(date);
  if (n === null) return <span className="text-[#58645D]/60">—</span>;
  const tone: Tone = n < 0 ? "bad" : n <= 30 ? "warn" : n <= 90 ? "info" : "mute";
  const label = n < 0 ? `${Math.abs(n)}d atrasado` : n === 0 ? "hoje" : `em ${n}d`;
  return <span className="inline-flex flex-col leading-tight"><span className="font-mono text-[12.5px] text-[#194D36]">{fmtDate(date)}</span><span className={cn("text-[11px] font-semibold", { bad: "text-[#A2332A]", warn: "text-[#8A5A0B]", info: "text-[#2C5A70]", mute: "text-[#58645D]/70", ok: "" }[tone])}>{label}</span></span>;
}

export function PageHeader({ eyebrow, title, intro, actions }: { eyebrow: string; title: ReactNode; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-1 duration-500">
      <div className="max-w-2xl">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="text-[28px] md:text-[34px] font-bold leading-[1.05]">{title}</h1>
        {intro && <p className="mt-2 text-[14.5px] text-[#58645D] leading-relaxed">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className, title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) {
  return <section className={cn("rounded-2xl border border-[#194D36]/10 bg-white shadow-[0_1px_0_rgba(25,77,54,.04),0_12px_32px_-28px_rgba(25,77,54,.4)]", className)}>
    {title && <header className="flex items-center justify-between gap-3 border-b border-[#194D36]/8 px-5 py-3.5"><h2 className="text-[14px] font-bold">{title}</h2>{action}</header>}
    {children}
  </section>;
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="relative overflow-hidden px-6 py-14 text-center contour">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#F5F9F6] text-[#39845B] ring-1 ring-[#39845B]/15">{icon}</div>
      <p className="font-display text-[24px] text-[#194D36]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[13.5px] text-[#58645D]">{text}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const msg = error instanceof Error ? error.message : "Falha ao carregar os dados.";
  return (
    <div role="alert" className="mx-auto max-w-md rounded-2xl border border-[#B8463B]/25 bg-[#FBE7E4]/60 p-5 text-left">
      <div className="flex gap-3"><AlertTriangle className="h-5 w-5 shrink-0 text-[#A2332A]" />
        <div><p className="font-semibold text-[#7E2A22]">Não foi possível carregar</p><p className="mt-1 text-[13px] text-[#7E2A22]/85 break-words">{msg}</p>
          {onRetry && <button onClick={onRetry} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#7E2A22] ring-1 ring-[#B8463B]/25 hover:bg-[#FBE7E4]" data-testid="button-retry"><RotateCcw className="h-3.5 w-3.5" />Tentar novamente</button>}
        </div></div>
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return <div className="divide-y divide-[#194D36]/6">{Array.from({ length: rows }).map((_, i) => <div key={i} className="flex items-center gap-4 px-5 py-4"><Skeleton className="h-4 w-1/3 bg-[#194D36]/6" /><Skeleton className="h-4 w-20 bg-[#194D36]/6" /><Skeleton className="ml-auto h-4 w-24 bg-[#194D36]/6" /></div>)}</div>;
}

export function ShellSkeleton() {
  return <div className="flex min-h-[100dvh] bg-[#F5F9F6]"><div className="hidden w-64 border-r border-[#194D36]/8 p-5 lg:block space-y-3">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-7 bg-[#194D36]/6" />)}</div><div className="flex-1 p-8 space-y-4"><Skeleton className="h-10 w-72 bg-[#194D36]/6" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 bg-[#194D36]/6" />)}</div><Skeleton className="h-72 bg-[#194D36]/6" /></div></div>;
}

export function SearchInput({ value, onChange, placeholder = "Buscar" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#58645D]/60" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-9 w-full rounded-full border border-[#194D36]/12 bg-white pl-9 pr-3 text-[13.5px] outline-none transition focus:border-[#39845B] focus:ring-2 focus:ring-[#39845B]/15" data-testid="input-search" /></label>;
}

export const inputCls = "h-10 w-full rounded-lg border border-[#194D36]/14 bg-white px-3 text-[14px] text-[#194D36] outline-none transition placeholder:text-[#58645D]/50 focus:border-[#39845B] focus:ring-2 focus:ring-[#39845B]/15 disabled:opacity-60";

export function Field({ label, hint, children, full, htmlFor }: { label: string; hint?: string; children: ReactNode; full?: boolean; htmlFor?: string }) {
  return <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}><label htmlFor={htmlFor} className="text-[12.5px] font-semibold text-[#194D36]">{label}</label>{children}{hint && <p className="text-[11.5px] text-[#58645D]">{hint}</p>}</div>;
}

export function NativeSelect({ value, onChange, options, placeholder = "Selecione", id, testId }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; id?: string; testId?: string }) {
  return <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8")} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5 6 7.5 9 4.5' fill='none' stroke='%23194D36' stroke-width='1.5'/%3E%3C/svg%3E\")" }} data-testid={testId}>
    <option value="">{placeholder}</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}

/** Options for real records of given kinds. */
export function useRecordOptions(kinds: Kind[]) {
  const { companyId } = usePlatform();
  const { data, isLoading } = useListControlRecords(companyId);
  const opts = useMemo(() => (data ?? []).filter((r) => kinds.includes(r.kind) && r.status !== "archived").map((r) => ({ value: r.id, label: kinds.length > 1 ? `${KINDS[r.kind].label} · ${r.title}` : r.title })), [data, kinds]);
  return { opts, isLoading };
}
export function useDocOptions() {
  const { companyId } = usePlatform();
  const { data, isLoading } = useListControlDocuments(companyId);
  return { opts: (data ?? []).map((d) => ({ value: d.id, label: `${d.name} (v${d.version})` })), isLoading };
}

export function RecordSelect({ kinds, value, onChange, id, exclude }: { kinds: Kind[]; value: string; onChange: (v: string) => void; id?: string; exclude?: string }) {
  const { opts, isLoading } = useRecordOptions(kinds);
  return <NativeSelect id={id} value={value} onChange={onChange} options={opts.filter((o) => o.value !== exclude)} placeholder={isLoading ? "Carregando..." : opts.length ? "Nenhum" : "Nenhum registro cadastrado"} />;
}
export function DocSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const { opts, isLoading } = useDocOptions();
  return <NativeSelect id={id} value={value} onChange={onChange} options={opts} placeholder={isLoading ? "Carregando..." : opts.length ? "Nenhum documento" : "Nenhum documento enviado"} />;
}

export function MultiPick({ options, value, onChange, empty, label }: { options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void; empty: string; label: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const sel = options.filter((o) => value.includes(o.value));
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild><button type="button" aria-label={label} className={cn(inputCls, "flex items-center justify-between text-left")} data-testid={`button-pick-${label}`}><span className="truncate text-[#58645D]">{sel.length ? `${sel.length} selecionado(s)` : options.length ? "Selecionar" : empty}</span><ChevronsUpDown className="h-4 w-4 opacity-50" /></button></PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[280px] p-2" align="start">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar" className={cn(inputCls, "mb-2 h-8")} />
          <div className="max-h-60 overflow-auto">
            {options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())).map((o) => (
              <button type="button" key={o.value} onClick={() => toggle(o.value)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-[#F5F9F6]">
                <span className={cn("grid h-4 w-4 place-items-center rounded border", value.includes(o.value) ? "border-[#194D36] bg-[#194D36] text-white" : "border-[#194D36]/25")}>{value.includes(o.value) && <Check className="h-3 w-3" />}</span><span className="truncate">{o.label}</span></button>))}
            {!options.length && <p className="p-2 text-[12.5px] text-[#58645D]">{empty}</p>}
          </div>
        </PopoverContent>
      </Popover>
      {sel.length > 0 && <div className="flex flex-wrap gap-1.5">{sel.map((s) => <span key={s.value} className="inline-flex items-center gap-1 rounded-full bg-[#F5F9F6] px-2.5 py-1 text-[12px] text-[#194D36] ring-1 ring-[#194D36]/10">{s.label}<button type="button" onClick={() => toggle(s.value)} aria-label={`Remover ${s.label}`}><X className="h-3 w-3" /></button></span>)}</div>}
    </div>
  );
}

export function RecordMulti({ kinds, value, onChange, label }: { kinds: Kind[]; value: string[]; onChange: (v: string[]) => void; label: string }) {
  const { opts } = useRecordOptions(kinds);
  return <MultiPick options={opts} value={value} onChange={onChange} empty="Nenhum registro cadastrado" label={label} />;
}
export function DocMulti({ value, onChange, label }: { value: string[]; onChange: (v: string[]) => void; label: string }) {
  const { opts } = useDocOptions();
  return <MultiPick options={opts} value={value} onChange={onChange} empty="Nenhum documento enviado" label={label} />;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
