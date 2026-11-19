import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCreateControlRecord, useUpdateControlRecord, type ControlRecord, type RecordInput } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { btnClass } from "@/components/site/primitives";
import { useToast } from "@/hooks/use-toast";
import { KINDS, type FieldDef, type Kind } from "@/platform/modules";
import { errMsg, invalidateCompany, usePlatform } from "@/platform/context";
import { DocMulti, DocSelect, Field, NativeSelect, RecordMulti, RecordSelect, inputCls } from "@/platform/ui";

type Data = Record<string, unknown>;
interface State { title: string; description: string; status: string; unitId: string; responsible: string; dueDate: string; parentId: string; documentId: string; relatedIds: string[]; data: Data }

const fromRecord = (r: ControlRecord | null | undefined, kind: Kind, unitId: string | null): State => ({
  title: r?.title ?? "", description: r?.description ?? "", status: r?.status ?? KINDS[kind].statuses[0]?.value ?? "",
  unitId: r?.unitId ?? unitId ?? "", responsible: r?.responsible ?? "", dueDate: r?.dueDate?.slice(0, 10) ?? "",
  parentId: r?.parentId ?? "", documentId: r?.documentId ?? "", relatedIds: r?.relatedIds ?? [], data: { ...(r?.data ?? {}) },
});

function DataField({ f, data, set }: { f: FieldDef; data: Data; set: (k: string, v: unknown) => void }) {
  const id = `f-${f.key}`;
  const v = data[f.key];
  const str = v === undefined || v === null ? "" : String(v);
  if (f.showIf && !f.showIf(data)) return null;
  let input;
  switch (f.type) {
    case "textarea": input = <textarea id={id} value={str} onChange={(e) => set(f.key, e.target.value)} rows={3} className={`${inputCls} h-auto py-2`} />; break;
    case "number": input = <input id={id} type="number" step="any" value={str} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} className={inputCls} />; break;
    case "date": input = <input id={id} type="date" value={str.slice(0, 10)} onChange={(e) => set(f.key, e.target.value || null)} className={inputCls} />; break;
    case "select": input = <NativeSelect id={id} value={str} onChange={(x) => set(f.key, x)} options={f.options ?? []} />; break;
    case "record": input = <RecordSelect id={id} kinds={f.kinds ?? []} value={str} onChange={(x) => set(f.key, x || null)} />; break;
    case "records": input = <RecordMulti label={f.label} kinds={f.kinds ?? []} value={Array.isArray(v) ? (v as string[]) : []} onChange={(x) => set(f.key, x)} />; break;
    case "documents": input = <DocMulti label={f.label} value={Array.isArray(v) ? (v as string[]) : []} onChange={(x) => set(f.key, x)} />; break;
    case "boolean": return <label className="flex items-center gap-3 rounded-lg border border-[#194D36]/10 bg-[#F5F9F6] px-3 py-2.5 sm:col-span-2"><Switch checked={v === true} onCheckedChange={(c) => set(f.key, c)} data-testid={`switch-${f.key}`} /><span className="text-[13px] font-medium text-[#194D36]">{f.label}</span></label>;
    default: input = <input id={id} value={str} onChange={(e) => set(f.key, e.target.value)} className={inputCls} data-testid={`input-${f.key}`} />;
  }
  return <Field label={f.label} hint={f.hint} full={f.full} htmlFor={id}>{input}</Field>;
}

export function RecordDialog({ kind, record, open, onOpenChange, defaults }: { kind: Kind; record?: ControlRecord | null; open: boolean; onOpenChange: (o: boolean) => void; defaults?: Partial<State> }) {
  const def = KINDS[kind];
  const { companyId, unitId, units } = usePlatform();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [s, setS] = useState<State>(() => fromRecord(record, kind, unitId));
  const [err, setErr] = useState<string | null>(null);
  const create = useCreateControlRecord();
  const update = useUpdateControlRecord();
  const busy = create.isPending || update.isPending;

  useEffect(() => { if (open) { setS({ ...fromRecord(record, kind, unitId), ...(record ? {} : defaults) }); setErr(null); } }, [open, record?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const setData = (k: string, v: unknown) => setS((p) => ({ ...p, data: { ...p.data, [k]: v } }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (s.title.trim().length < 2) { setErr(`Informe ${def.titleLabel.toLowerCase()} (mínimo 2 caracteres).`); return; }
    const payload: RecordInput = {
      kind, title: s.title.trim(), description: s.description, status: s.status, unitId: kind === "unit" ? null : s.unitId || null,
      responsible: s.responsible, dueDate: s.dueDate || null, parentId: s.parentId || null, documentId: s.documentId || null,
      relatedIds: s.relatedIds, data: s.data,
    };
    const done = { onSuccess: () => { invalidateCompany(qc, companyId); toast({ title: record ? `${def.label} atualizado(a)` : `${def.label} cadastrado(a)` }); onOpenChange(false); }, onError: (x: unknown) => setErr(errMsg(x)) };
    if (record) update.mutate({ companyId, id: record.id, data: payload }, done); else create.mutate({ companyId, data: payload }, done);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl rounded-2xl border-[#194D36]/10 bg-white">
        <DialogHeader><p className="eyebrow">{record ? "Editar" : "Novo cadastro"}</p><DialogTitle className="text-[22px] font-bold text-[#194D36]">{def.label}</DialogTitle><DialogDescription className="text-[#58645D]">Campos com informações legais críticas devem ser conferidos com o documento original.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label={def.titleLabel} hint={def.titleHint} full htmlFor="f-title"><input id="f-title" value={s.title} onChange={(e) => set("title", e.target.value)} className={inputCls} maxLength={300} required data-testid="input-title" /></Field>
          <Field label="Status" htmlFor="f-status"><NativeSelect id="f-status" value={s.status} onChange={(v) => set("status", v)} options={def.statuses} testId="select-status" /></Field>
          {kind !== "unit" && <Field label="Unidade" htmlFor="f-unit"><NativeSelect id="f-unit" value={s.unitId} onChange={(v) => set("unitId", v)} options={units.map((u) => ({ value: u.id, label: u.title }))} placeholder={units.length ? "Empresa (todas)" : "Nenhuma unidade cadastrada"} /></Field>}
          <Field label="Responsável" htmlFor="f-resp"><input id="f-resp" value={s.responsible} onChange={(e) => set("responsible", e.target.value)} className={inputCls} placeholder="Nome ou e-mail" maxLength={200} /></Field>
          {def.dueLabel && <Field label={def.dueLabel} htmlFor="f-due"><input id="f-due" type="date" value={s.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputCls} data-testid="input-due" /></Field>}
          {def.parent && <Field label={def.parent.label} htmlFor="f-parent"><RecordSelect id="f-parent" kinds={def.parent.kinds} value={s.parentId} onChange={(v) => set("parentId", v)} exclude={record?.id} /></Field>}
          {def.documentLabel && <Field label={def.documentLabel} htmlFor="f-doc" hint="Envie o arquivo em Documentos para vinculá-lo aqui"><DocSelect id="f-doc" value={s.documentId} onChange={(v) => set("documentId", v)} /></Field>}
          {def.related && <Field label={def.related.label} hint={def.related.hint} full><RecordMulti label={def.related.label} kinds={def.related.kinds} value={s.relatedIds} onChange={(v) => set("relatedIds", v)} /></Field>}
          {def.fields.map((f) => <DataField key={f.key} f={f} data={s.data} set={setData} />)}
          <Field label={def.descriptionLabel ?? "Descrição / observações"} full htmlFor="f-desc"><textarea id="f-desc" value={s.description} onChange={(e) => set("description", e.target.value)} rows={def.descriptionLabel ? 5 : 3} className={`${inputCls} h-auto py-2`} /></Field>
          {err && <p role="alert" className="sm:col-span-2 rounded-lg bg-[#FBE7E4] px-3 py-2 text-[13px] text-[#7E2A22]">{err}</p>}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => onOpenChange(false)} className={btnClass("outline", "py-2.5 px-5")}>Cancelar</button>
            <button type="submit" disabled={busy} className={btnClass("primary", "py-2.5 px-5 disabled:opacity-60")} data-testid="button-save-record">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{record ? "Salvar alterações" : "Cadastrar"}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
