import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Download, FileText, History, Loader2, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import {
  getGetControlDownloadQueryKey, useCompleteControlUpload, useGetControlDownload, useListControlDocuments,
  useRequestControlUpload, useUpdateControlDocument, useValidateControlDocument, type ControlDocument, type DocumentMetadata, type ExtractedCondition,
} from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { btnClass } from "@/components/site/primitives";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { docCategories, docStatusLabel, frequencyOptions, isDocBusy, toneFor } from "@/platform/modules";
import { errMsg, invalidateCompany, usePlatform } from "@/platform/context";
import { DueChip, EmptyState, ErrorState, Field, NativeSelect, PageHeader, Panel, Pill, SearchInput, SkeletonRows, fmtDate, fmtDateTime, fmtSize, inputCls } from "@/platform/ui";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,.xls,.xlsx,.csv,.doc,.docx,.zip";
const MAX = 20971520;
const emptyMeta = (unitId: string | null): DocumentMetadata => ({ name: "", category: "", unitId, responsible: "", number: "", issuedAt: null, expiresAt: null, notes: "" });

function MetaFields({ m, set }: { m: DocumentMetadata; set: (m: DocumentMetadata) => void }) {
  const { units } = usePlatform();
  const u = (k: keyof DocumentMetadata, v: string) => set({ ...m, [k]: (k === "issuedAt" || k === "expiresAt" || k === "unitId") ? v || null : v });
  return <div className="grid gap-4 sm:grid-cols-2">
    <Field label="Nome do documento" full htmlFor="m-name"><input id="m-name" value={m.name} onChange={(e) => u("name", e.target.value)} className={inputCls} maxLength={300} data-testid="input-doc-name" /></Field>
    <Field label="Categoria" htmlFor="m-cat"><NativeSelect id="m-cat" value={m.category} onChange={(v) => u("category", v)} options={docCategories.map((c) => ({ value: c, label: c }))} testId="select-doc-category" /></Field>
    <Field label="Unidade" htmlFor="m-unit"><NativeSelect id="m-unit" value={m.unitId ?? ""} onChange={(v) => u("unitId", v)} options={units.map((x) => ({ value: x.id, label: x.title }))} placeholder="Empresa (todas)" /></Field>
    <Field label="Número do documento" htmlFor="m-num"><input id="m-num" value={m.number ?? ""} onChange={(e) => u("number", e.target.value)} className={inputCls} /></Field>
    <Field label="Responsável" htmlFor="m-resp"><input id="m-resp" value={m.responsible ?? ""} onChange={(e) => u("responsible", e.target.value)} className={inputCls} /></Field>
    <Field label="Data de emissão" htmlFor="m-iss"><input id="m-iss" type="date" value={m.issuedAt ?? ""} onChange={(e) => u("issuedAt", e.target.value)} className={inputCls} /></Field>
    <Field label="Data de validade" htmlFor="m-exp"><input id="m-exp" type="date" value={m.expiresAt ?? ""} onChange={(e) => u("expiresAt", e.target.value)} className={inputCls} /></Field>
    <Field label="Observações" full htmlFor="m-notes"><textarea id="m-notes" value={m.notes ?? ""} onChange={(e) => u("notes", e.target.value)} rows={2} className={`${inputCls} h-auto py-2`} /></Field>
  </div>;
}

function UploadDialog({ open, onOpenChange, replaces }: { open: boolean; onOpenChange: (o: boolean) => void; replaces?: ControlDocument | null }) {
  const { companyId, unitId } = usePlatform();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<DocumentMetadata>(emptyMeta(unitId));
  const [stage, setStage] = useState<"idle" | "ticket" | "put" | "complete">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqUpload = useRequestControlUpload();
  const complete = useCompleteControlUpload();

  useEffect(() => {
    if (!open) return;
    setFile(null); setErr(null); setStage("idle");
    if (replaces) { const { name, category, unitId: uid, responsible, number, issuedAt, expiresAt, notes } = replaces; setMeta({ name, category, unitId: uid ?? null, responsible, number, issuedAt: issuedAt ?? null, expiresAt: expiresAt ?? null, notes }); }
    else setMeta(emptyMeta(unitId));
  }, [open, replaces, unitId]);

  const pick = (f?: File | null) => {
    if (!f) return;
    if (f.size > MAX) { setErr("O arquivo excede 20 MB."); return; }
    setErr(null); setFile(f);
    if (!meta.name) setMeta((m) => ({ ...m, name: f.name.replace(/\.[^.]+$/, "").slice(0, 300) }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setErr("Selecione um arquivo.");
    if (meta.name.trim().length < 2) return setErr("Informe o nome do documento.");
    if (!meta.category) return setErr("Selecione a categoria.");
    setErr(null);
    try {
      setStage("ticket");
      const ticket = await reqUpload.mutateAsync({ companyId, data: { filename: file.name.slice(0, 200), size: file.size, contentType: file.type || "application/octet-stream", unitId: meta.unitId ?? null } });
      setStage("put");
      const put = await fetch(ticket.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
      if (!put.ok) throw new Error(`O armazenamento recusou o envio (HTTP ${put.status}).`);
      setStage("complete");
      await complete.mutateAsync({ companyId, data: { ...meta, name: meta.name.trim(), uploadId: ticket.uploadId, replacesId: replaces?.id ?? null } });
      invalidateCompany(qc, companyId);
      toast({ title: replaces ? "Nova versão registrada" : "Documento enviado" });
      onOpenChange(false);
    } catch (x) { setErr(errMsg(x)); } finally { setStage("idle"); }
  };
  const busy = stage !== "idle";
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); };

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl rounded-2xl bg-white">
        <DialogHeader><p className="eyebrow">{replaces ? `Substituir versão ${replaces.version}` : "Upload"}</p><DialogTitle className="text-[22px] font-bold text-[#194D36]">{replaces ? "Enviar nova versão" : "Enviar documento"}</DialogTitle><DialogDescription>O arquivo vai direto para o armazenamento privado da empresa. Máximo de 20 MB.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            className={cn("cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition", drag ? "border-[#39845B] bg-[#E6F2EA]" : "border-[#194D36]/15 bg-[#F5F9F6] hover:border-[#39845B]/60")} data-testid="dropzone-upload">
            <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => pick(e.target.files?.[0])} data-testid="input-file" />
            {file ? <div className="flex items-center justify-center gap-3"><FileText className="h-8 w-8 text-[#39845B]" /><div className="text-left"><p className="font-semibold text-[#194D36]">{file.name}</p><p className="font-mono text-[12px] text-[#58645D]">{fmtSize(file.size)} · {file.type || "tipo desconhecido"}</p></div></div>
              : <><Upload className="mx-auto h-7 w-7 text-[#39845B]" /><p className="mt-2 font-semibold text-[#194D36]">Arraste o arquivo ou clique para selecionar</p><p className="text-[12.5px] text-[#58645D]">PDF, imagens, planilhas, documentos e ZIP</p></>}
          </div>
          <MetaFields m={meta} set={setMeta} />
          {busy && <ol className="flex gap-2 text-[12px] font-mono">{(["ticket", "put", "complete"] as const).map((s, i) => { const idx = ["ticket", "put", "complete"].indexOf(stage); return <li key={s} className={cn("flex-1 rounded-full px-3 py-1.5 text-center", i < idx ? "bg-[#E6F2EA] text-[#1F6A43]" : i === idx ? "bg-[#194D36] text-white" : "bg-[#F5F9F6] text-[#58645D]")}>{["1 autorização", "2 envio do arquivo", "3 registro"][i]}</li>; })}</ol>}
          {err && <p role="alert" className="rounded-lg bg-[#FBE7E4] px-3 py-2 text-[13px] text-[#7E2A22]">{err}</p>}
          <div className="flex justify-end gap-2"><button type="button" disabled={busy} onClick={() => onOpenChange(false)} className={btnClass("outline", "py-2.5 px-5")}>Cancelar</button><button disabled={busy} className={btnClass("primary", "py-2.5 px-5 disabled:opacity-60")} data-testid="button-upload-submit">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Enviar</button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DownloadButton({ doc }: { doc: ControlDocument }) {
  const { companyId } = usePlatform();
  const [want, setWant] = useState(false);
  const { toast } = useToast();
  const q = useGetControlDownload(companyId, doc.id, { query: { enabled: want, queryKey: getGetControlDownloadQueryKey(companyId, doc.id), staleTime: 0, gcTime: 0 } });
  useEffect(() => {
    if (!want) return;
    if (q.data?.url) { window.open(q.data.url, "_blank", "noopener,noreferrer"); setWant(false); }
    if (q.isError) { toast({ title: "Falha ao gerar link", description: errMsg(q.error), variant: "destructive" }); setWant(false); }
  }, [want, q.data, q.isError, q.error, toast]);
  return <button onClick={() => { q.refetch(); setWant(true); }} className={btnClass("outline", "py-2 px-4 text-[13px]")} data-testid="button-download"><Download className="h-4 w-4" />{want ? "Gerando link..." : "Abrir / baixar"}</button>;
}

function Review({ doc, onDone }: { doc: ControlDocument; onDone: () => void }) {
  const { companyId } = usePlatform();
  const qc = useQueryClient();
  const { toast } = useToast();
  const a = doc.analysis!;
  const [conds, setConds] = useState<ExtractedCondition[]>(() => a.conditions.map((c) => ({ ...c })));
  const [meta, setMeta] = useState<DocumentMetadata>(() => ({ name: doc.name, category: a.category || doc.category, unitId: doc.unitId ?? null, responsible: doc.responsible, number: a.number || doc.number, issuedAt: a.issuedAt || doc.issuedAt || null, expiresAt: a.expiresAt || doc.expiresAt || null, notes: doc.notes }));
  const validate = useValidateControlDocument();
  const upd = (i: number, p: Partial<ExtractedCondition>) => setConds((cs) => cs.map((c, j) => (j === i ? { ...c, ...p } : c)));
  const decide = (decision: "accept" | "reject") => validate.mutate({ companyId, id: doc.id, data: { decision, metadata: meta, conditions: decision === "accept" ? conds.filter((c) => c.text.trim()) : [] } }, {
    onSuccess: () => { invalidateCompany(qc, companyId); toast({ title: decision === "accept" ? "Extração validada" : "Extração rejeitada", description: decision === "accept" ? "Condicionantes aprovadas viraram registros e obrigações." : undefined }); onDone(); },
    onError: (e) => toast({ title: "Falha na validação", description: errMsg(e), variant: "destructive" }),
  });
  const fq = frequencyOptions.map((f) => ({ value: f.label, label: f.label }));
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-[#F5F9F6] p-4 ring-1 ring-[#194D36]/8"><p className="eyebrow mb-1.5">Leitura da IA · conferir antes de aprovar</p><p className="text-[13.5px] leading-relaxed text-[#194D36]">{a.summary}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]"><div><dt className="text-[#58645D]">Emissor</dt><dd className="font-semibold">{a.issuer || "—"}</dd></div><div><dt className="text-[#58645D]">Número</dt><dd className="font-mono">{a.number || "—"}</dd></div></dl>
        {!!a.missingDocuments?.length && <div className="mt-3"><p className="text-[12px] font-semibold text-[#8A5A0B]">Documentos complementares indicados</p><ul className="mt-1 list-disc pl-5 text-[12.5px] text-[#58645D]">{a.missingDocuments.map((m) => <li key={m}>{m}</li>)}</ul></div>}
      </div>
      <MetaFields m={meta} set={setMeta} />
      <div>
        <div className="mb-2 flex items-center justify-between"><h3 className="text-[14px] font-bold">Condicionantes extraídas ({conds.length})</h3><button onClick={() => setConds((c) => [...c, { text: "", source: "", page: 1, dueDate: null, frequency: null, evidence: "" }])} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#39845B]" data-testid="button-add-condition"><Plus className="h-3.5 w-3.5" />Adicionar</button></div>
        <div className="space-y-3">
          {conds.map((c, i) => (
            <div key={i} className="rounded-xl border border-[#194D36]/10 p-3.5" data-testid={`card-condition-${i}`}>
              <div className="flex gap-2"><span className="font-mono text-[11px] text-[#39845B] pt-2">{String(i + 1).padStart(2, "0")}</span><textarea value={c.text} onChange={(e) => upd(i, { text: e.target.value })} rows={3} className={`${inputCls} h-auto py-2`} aria-label="Texto da condicionante" /><button onClick={() => setConds((cs) => cs.filter((_, j) => j !== i))} aria-label="Remover" className="self-start rounded-full p-1.5 text-[#A2332A] hover:bg-[#FBE7E4]"><Trash2 className="h-4 w-4" /></button></div>
              <div className="mt-2 grid gap-2 sm:grid-cols-4 pl-6">
                <input value={c.source} onChange={(e) => upd(i, { source: e.target.value })} placeholder="Referência (item)" className={`${inputCls} h-9 text-[13px]`} aria-label="Referência" />
                <input type="number" min={1} value={c.page} onChange={(e) => upd(i, { page: Number(e.target.value) || 1 })} className={`${inputCls} h-9 text-[13px]`} aria-label="Página" />
                <input type="date" value={c.dueDate ?? ""} onChange={(e) => upd(i, { dueDate: e.target.value || null })} className={`${inputCls} h-9 text-[13px]`} aria-label="Prazo" />
                <select value={c.frequency ?? ""} onChange={(e) => upd(i, { frequency: e.target.value || null })} className={`${inputCls} h-9 text-[13px]`} aria-label="Periodicidade"><option value="">Periodicidade</option>{c.frequency && !fq.some((f) => f.value === c.frequency) && <option value={c.frequency}>{c.frequency}</option>}{fq.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                <input value={c.evidence ?? ""} onChange={(e) => upd(i, { evidence: e.target.value })} placeholder="Evidência exigida" className={`${inputCls} h-9 text-[13px] sm:col-span-4`} aria-label="Evidência" />
              </div>
              <p className="mt-1.5 pl-6 font-mono text-[10.5px] text-[#58645D]">fonte: página {c.page}{c.source ? ` · ${c.source}` : ""}</p>
            </div>))}
          {!conds.length && <p className="text-[13px] text-[#58645D]">Nenhuma condicionante identificada. Adicione manualmente se houver.</p>}
        </div>
      </div>
      <div className="sticky bottom-0 -mx-6 flex justify-end gap-2 border-t border-[#194D36]/8 bg-white/95 px-6 py-3 backdrop-blur">
        <button disabled={validate.isPending} onClick={() => decide("reject")} className={btnClass("outline", "py-2.5 px-5 text-[#A2332A] border-[#A2332A]/30")} data-testid="button-reject"><X className="h-4 w-4" />Rejeitar</button>
        <button disabled={validate.isPending} onClick={() => decide("accept")} className={btnClass("primary", "py-2.5 px-5")} data-testid="button-approve">{validate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Aprovar e gerar obrigações</button>
      </div>
    </div>
  );
}

function DocSheet({ doc, all, onClose, onReplace }: { doc: ControlDocument | null; all: ControlDocument[]; onClose: () => void; onReplace: (d: ControlDocument) => void }) {
  const { companyId } = usePlatform();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [meta, setMeta] = useState<DocumentMetadata | null>(null);
  const [tab, setTab] = useState<"review" | "meta" | "versions">("meta");
  const update = useUpdateControlDocument();
  useEffect(() => {
    if (!doc) return;
    setMeta({ name: doc.name, category: doc.category, unitId: doc.unitId ?? null, responsible: doc.responsible, number: doc.number, issuedAt: doc.issuedAt ?? null, expiresAt: doc.expiresAt ?? null, notes: doc.notes });
    setTab(doc.analysis && ["analyzed", "awaiting_validation"].includes(doc.status) ? "review" : "meta");
  }, [doc?.id, doc?.status]); // eslint-disable-line react-hooks/exhaustive-deps
  const versions = useMemo(() => {
    if (!doc) return [];
    const chain: ControlDocument[] = [];
    let cur: ControlDocument | undefined = doc;
    while (cur) { chain.push(cur); const pid: string | null | undefined = cur.previousId; cur = pid ? all.find((d) => d.id === pid) : undefined; }
    let next = all.find((d) => d.previousId === doc.id);
    while (next) { chain.unshift(next); const nid = next.id; next = all.find((d) => d.previousId === nid); }
    return chain;
  }, [doc, all]);
  if (!doc) return null;
  const busy = isDocBusy(doc.status);
  return (
    <Sheet open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl bg-white">
        <SheetHeader className="text-left"><p className="eyebrow">{doc.category} · versão {doc.version}</p><SheetTitle className="text-[22px] font-bold text-[#194D36]">{doc.name}</SheetTitle><SheetDescription className="font-mono text-[12px]">{doc.filename} · {fmtSize(doc.size)} · enviado {fmtDateTime(doc.createdAt)}</SheetDescription></SheetHeader>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill tone={isDocBusy(doc.status) ? "info" : toneFor(doc.status)}>{docStatusLabel[doc.status] ?? doc.status}</Pill>
          <DownloadButton doc={doc} />
          <span className="rounded-full bg-[#F5F9F6] px-3 py-2 text-[12px] font-semibold text-[#58645D]" role="status">Análise automática pausada</span>
          <button onClick={() => onReplace(doc)} className={btnClass("outline", "py-2 px-4 text-[13px]")} data-testid="button-replace"><RefreshCw className="h-4 w-4" />Substituir arquivo</button>
        </div>
        {doc.error && <p role="alert" className="mt-3 rounded-lg bg-[#FBE7E4] px-3 py-2 text-[13px] text-[#7E2A22]">{doc.error}</p>}
        <div className="mt-5 flex gap-1 border-b border-[#194D36]/10">{([["review", "Validação da IA"], ["meta", "Metadados"], ["versions", "Versões"]] as const).map(([k, l]) => <button key={k} disabled={k === "review" && !doc.analysis} onClick={() => setTab(k)} className={cn("-mb-px border-b-2 px-3 py-2 text-[13px] font-semibold disabled:opacity-40", tab === k ? "border-[#194D36] text-[#194D36]" : "border-transparent text-[#58645D]")}>{l}</button>)}</div>
        <div className="pt-5">
          {tab === "review" && doc.analysis && <Review key={doc.id + doc.status} doc={doc} onDone={() => setTab("meta")} />}
          {tab === "meta" && meta && <form onSubmit={(e) => { e.preventDefault(); update.mutate({ companyId, id: doc.id, data: meta }, { onSuccess: () => { invalidateCompany(qc, companyId); toast({ title: "Metadados salvos" }); }, onError: (x) => toast({ title: "Falha", description: errMsg(x), variant: "destructive" }) }); }} className="space-y-4"><MetaFields m={meta} set={setMeta} /><div className="flex justify-end"><button disabled={update.isPending} className={btnClass("primary", "py-2.5 px-5")} data-testid="button-save-doc">{update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Salvar metadados</button></div></form>}
          {tab === "versions" && <ol className="relative space-y-3 border-l border-[#194D36]/12 pl-5">{versions.map((v) => <li key={v.id} className="relative"><span className={cn("absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full", v.id === doc.id ? "bg-[#39845B]" : "bg-[#194D36]/25")} /><p className="text-[13.5px] font-semibold">Versão {v.version} · {v.filename}</p><p className="font-mono text-[11.5px] text-[#58645D]">{fmtDateTime(v.createdAt)} · {docStatusLabel[v.status] ?? v.status}</p></li>)}</ol>}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function DocumentsPage() {
  const { companyId, unitId, units } = usePlatform();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [replaces, setReplaces] = useState<ControlDocument | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [st, setSt] = useState("");
  const [period, setPeriod] = useState("");
  const q = useListControlDocuments(companyId, { query: { queryKey: [`/api/control/${companyId}/documents`], refetchInterval: (query) => ((query.state.data as ControlDocument[] | undefined)?.some((d) => isDocBusy(d.status)) ? 3000 : false) } });
  const all = q.data ?? [];
  const superseded = new Set(all.map((d) => d.previousId).filter(Boolean));
  const rows = all.filter((d) => !superseded.has(d.id) && (!unitId || d.unitId === unitId) && (!cat || d.category === cat) && (!st || d.status === st) && (!search || `${d.name} ${d.number} ${d.filename}`.toLowerCase().includes(search.toLowerCase())) && (!period || (() => { const n = d.expiresAt ? Math.round((new Date(d.expiresAt).getTime() - Date.now()) / 864e5) : null; return period === "expired" ? n !== null && n < 0 : period === "90" ? n !== null && n >= 0 && n <= 90 : period === "none" ? n === null : true; })()));
  const doc = all.find((d) => d.id === openId) ?? null;
  const unitName = (id?: string | null) => units.find((u) => u.id === id)?.title ?? "Empresa";
  return (
    <div>
      <PageHeader eyebrow="Acervo" title="Documentos" intro="Cadastre, classifique e acompanhe os documentos ambientais, seus responsáveis e prazos de validade." actions={<button onClick={() => { setReplaces(null); setUploadOpen(true); }} className={btnClass("primary", "py-2.5 px-5")} data-testid="button-open-upload"><Upload className="h-4 w-4" />Enviar documento</button>} />
      <Panel>
        <div className="flex flex-wrap gap-2 border-b border-[#194D36]/8 p-3.5">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, número ou arquivo" />
          <div className="w-48"><NativeSelect value={cat} onChange={setCat} options={docCategories.map((c) => ({ value: c, label: c }))} placeholder="Todas as categorias" /></div>
          <div className="w-44"><NativeSelect value={st} onChange={setSt} options={Array.from(new Set(all.map((d) => d.status))).map((s) => ({ value: s, label: docStatusLabel[s] ?? s }))} placeholder="Toda situação" /></div>
          <div className="w-44"><NativeSelect value={period} onChange={setPeriod} options={[{ value: "90", label: "Vence em 90 dias" }, { value: "expired", label: "Vencidos" }, { value: "none", label: "Sem validade" }]} placeholder="Qualquer validade" /></div>
        </div>
        {q.isLoading ? <SkeletonRows /> : q.isError ? <div className="p-6"><ErrorState error={q.error} onRetry={() => q.refetch()} /></div> : !rows.length ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title={all.length ? "Nenhum documento nos filtros" : "O acervo está vazio"} text={all.length ? "Ajuste os filtros acima." : "Registre documentos com categoria, unidade, responsável e validade para acompanhar o acervo."} action={!all.length ? <button onClick={() => setUploadOpen(true)} className={btnClass("primary", "py-2.5 px-5")}><Upload className="h-4 w-4" />Enviar primeiro documento</button> : undefined} />
        ) : (
          <ul className="divide-y divide-[#194D36]/6">
            {rows.map((d) => (
              <li key={d.id}><button onClick={() => setOpenId(d.id)} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 text-left transition hover:bg-[#F5F9F6]/70 md:grid-cols-[auto_1fr_160px_130px_auto]" data-testid={`row-document-${d.id}`}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5F9F6] text-[#39845B] ring-1 ring-[#194D36]/8">{isDocBusy(d.status) ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}</span>
                <span className="min-w-0"><span className="block truncate font-semibold text-[#194D36]">{d.name}</span><span className="block truncate font-mono text-[11.5px] text-[#58645D]">{d.category} · {d.number || "s/ número"} · v{d.version} · {unitName(d.unitId)}</span></span>
                <span className="hidden md:block"><Pill tone={isDocBusy(d.status) ? "info" : toneFor(d.status)}>{docStatusLabel[d.status] ?? d.status}</Pill></span>
                <span className="hidden md:block"><DueChip date={d.expiresAt} /></span>
                <span className="flex items-center gap-1 text-[11.5px] text-[#58645D]">{d.version > 1 && <History className="h-3.5 w-3.5" />}<span className="md:hidden"><Pill tone={toneFor(d.status)}>{docStatusLabel[d.status] ?? d.status}</Pill></span><span className="hidden md:inline">{fmtDate(d.createdAt)}</span></span>
              </button></li>))}
          </ul>
        )}
      </Panel>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} replaces={replaces} />
      <DocSheet doc={doc} all={all} onClose={() => setOpenId(null)} onReplace={(d) => { setReplaces(d); setUploadOpen(true); }} />
    </div>
  );
}
