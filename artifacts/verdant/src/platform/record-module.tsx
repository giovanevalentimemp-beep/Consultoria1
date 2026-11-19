import { useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore, FolderOpen, GitBranch, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useCreateControlRecord, useDeleteControlRecord, useListControlRecords, useUpdateControlRecord, type ControlRecord } from "@workspace/api-client-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { btnClass } from "@/components/site/primitives";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { KINDS, statusLabel, toneFor, type Kind } from "@/platform/modules";
import { errMsg, invalidateCompany, usePlatform } from "@/platform/context";
import { RecordDialog } from "@/platform/record-form";
import { DueChip, EmptyState, ErrorState, NativeSelect, PageHeader, Panel, Pill, SearchInput, SkeletonRows } from "@/platform/ui";

export function useRecords(kind?: Kind, scoped = true) {
  const { companyId, unitId } = usePlatform();
  const params = { ...(kind ? { kind } : {}), ...(scoped && unitId ? { unitId } : {}) };
  return useListControlRecords(companyId, Object.keys(params).length ? params : undefined);
}

function summary(r: ControlRecord) {
  const d = r.data ?? {};
  const bits = [d.number, d.reference, d.code, d.type, d.parameter, d.quarter, d.year].filter((x) => x !== undefined && x !== null && x !== "").map(String);
  return bits.slice(0, 2).join(" · ");
}

export function RecordTable({ kind, extra }: { kind: Kind; extra?: (rows: ControlRecord[], all: ControlRecord[]) => ReactNode }) {
  const def = KINDS[kind];
  const { companyId, units } = usePlatform();
  const qc = useQueryClient();
  const { toast } = useToast();
  const q = useRecords(kind);
  const allQ = useRecords(undefined, false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<ControlRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState<ControlRecord | null>(null);
  const update = useUpdateControlRecord();
  const remove = useDeleteControlRecord();
  const create = useCreateControlRecord();
  const byId = useMemo(() => new Map((allQ.data ?? []).map((r) => [r.id, r])), [allQ.data]);
  const unitName = (id?: string | null) => units.find((u) => u.id === id)?.title ?? "Empresa";

  const rows = useMemo(() => (q.data ?? []).filter((r) => (showArchived ? r.status === "archived" : r.status !== "archived") && (!status || r.status === status) && (!search || `${r.title} ${r.description ?? ""} ${r.responsible ?? ""} ${summary(r)}`.toLowerCase().includes(search.toLowerCase()))), [q.data, search, status, showArchived]);

  const setArchived = (r: ControlRecord, archive: boolean) => {
    const { id, companyId: _c, createdAt: _a, updatedAt: _u, ...rest } = r;
    update.mutate({ companyId, id, data: { ...rest, status: archive ? "archived" : def.statuses[0].value } }, { onSuccess: () => { invalidateCompany(qc, companyId); toast({ title: archive ? "Registro arquivado" : "Registro restaurado" }); }, onError: (e) => toast({ title: "Falha", description: errMsg(e), variant: "destructive" }) });
  };
  const derive = (r: ControlRecord) => {
    if (!def.derive) return;
    create.mutate({ companyId, data: def.derive.build({ ...r, data: r.data as Record<string, unknown> }) }, { onSuccess: (n) => { invalidateCompany(qc, companyId); toast({ title: `${KINDS[n.kind].label} criada`, description: n.title }); }, onError: (e) => toast({ title: "Falha", description: errMsg(e), variant: "destructive" }) });
  };

  return (
    <div className="space-y-4">
      {extra && q.data && extra(rows, q.data)}
      <Panel>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#194D36]/8 p-3.5">
          <SearchInput value={search} onChange={setSearch} placeholder={`Buscar em ${def.plural.toLowerCase()}`} />
          <div className="w-48"><NativeSelect value={status} onChange={setStatus} options={def.statuses.filter((x) => x.value !== "archived")} placeholder="Todos os status" testId={`select-filter-${kind}`} /></div>
          <button onClick={() => setShowArchived((v) => !v)} className={cn("h-9 rounded-full px-3.5 text-[12.5px] font-semibold ring-1 transition", showArchived ? "bg-[#194D36] text-white ring-[#194D36]" : "text-[#58645D] ring-[#194D36]/12 hover:bg-[#F5F9F6]")} data-testid={`button-archived-${kind}`}>Arquivados</button>
          <button onClick={() => { setEditing(null); setOpen(true); }} className={btnClass("primary", "ml-auto py-2 px-4 text-[13px]")} data-testid={`button-new-${kind}`}><Plus className="h-4 w-4" />Novo(a) {def.label.toLowerCase()}</button>
        </div>
        {q.isLoading ? <SkeletonRows /> : q.isError ? <div className="p-6"><ErrorState error={q.error} onRetry={() => q.refetch()} /></div> : rows.length === 0 ? (
          <EmptyState icon={<FolderOpen className="h-5 w-5" />} title={q.data?.length ? "Nada corresponde aos filtros" : `Nenhum registro de ${def.plural.toLowerCase()}`} text={q.data?.length ? "Ajuste a busca ou o status para ver outros registros." : "Os cadastros feitos aqui alimentam o dashboard, o calendário e os alertas."} action={!q.data?.length ? <button onClick={() => { setEditing(null); setOpen(true); }} className={btnClass("primary", "py-2.5 px-5")}><Plus className="h-4 w-4" />Cadastrar primeiro registro</button> : undefined} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead><tr className="text-[11px] uppercase tracking-[0.12em] text-[#58645D]/80 font-mono"><th className="px-5 py-2.5 font-medium">{def.titleLabel}</th><th className="px-3 py-2.5 font-medium">Status</th><th className="px-3 py-2.5 font-medium hidden md:table-cell">Unidade</th><th className="px-3 py-2.5 font-medium hidden lg:table-cell">Responsável</th>{def.dueLabel && <th className="px-3 py-2.5 font-medium">{def.dueLabel.split(" ").slice(0, 2).join(" ")}</th>}<th className="w-12" /></tr></thead>
              <tbody className="divide-y divide-[#194D36]/6">
                {rows.map((r) => {
                  const parent = r.parentId ? byId.get(r.parentId) : undefined;
                  return (
                    <tr key={r.id} className="group transition-colors hover:bg-[#F5F9F6]/70" data-testid={`row-${kind}-${r.id}`}>
                      <td className="px-5 py-3 max-w-[420px]"><button onClick={() => { setEditing(r); setOpen(true); }} className="text-left font-semibold text-[#194D36] hover:text-[#39845B]">{r.title}</button>
                        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11.5px] text-[#58645D]">{summary(r) && <span className="font-mono">{summary(r)}</span>}{parent && <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" />{parent.title}</span>}{(r.relatedIds?.length ?? 0) > 0 && <span>{r.relatedIds!.length} vínculo(s)</span>}</div></td>
                      <td className="px-3 py-3"><Pill tone={toneFor(r.status)}>{statusLabel(kind, r.status)}</Pill></td>
                      <td className="px-3 py-3 hidden md:table-cell text-[#58645D]">{unitName(r.unitId)}</td>
                      <td className="px-3 py-3 hidden lg:table-cell text-[#58645D]">{r.responsible || "—"}</td>
                      {def.dueLabel && <td className="px-3 py-3"><DueChip date={r.dueDate} /></td>}
                      <td className="px-3 py-3 text-right">
                        <DropdownMenu><DropdownMenuTrigger className="rounded-full p-1.5 text-[#58645D] hover:bg-white hover:text-[#194D36]" aria-label="Ações" data-testid={`button-actions-${r.id}`}><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" />Editar</DropdownMenuItem>
                            {def.derive && <DropdownMenuItem onClick={() => derive(r)}><GitBranch className="h-4 w-4" />{def.derive.label}</DropdownMenuItem>}
                            {r.status === "archived" ? <DropdownMenuItem onClick={() => setArchived(r, false)}><ArchiveRestore className="h-4 w-4" />Restaurar</DropdownMenuItem> : <DropdownMenuItem onClick={() => setArchived(r, true)}><Archive className="h-4 w-4" />Arquivar</DropdownMenuItem>}
                            <DropdownMenuSeparator /><DropdownMenuItem onClick={() => setDel(r)} className="text-[#A2332A]"><Trash2 className="h-4 w-4" />Excluir</DropdownMenuItem>
                          </DropdownMenuContent></DropdownMenu>
                      </td>
                    </tr>);
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <RecordDialog kind={kind} record={editing} open={open} onOpenChange={setOpen} />
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir definitivamente?</AlertDialogTitle><AlertDialogDescription>"{del?.title}" será removido. Para manter o histórico, prefira arquivar.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-[#A2332A] hover:bg-[#8A2A22]" data-testid="button-confirm-delete" onClick={() => del && remove.mutate({ companyId, id: del.id }, { onSuccess: () => { invalidateCompany(qc, companyId); toast({ title: "Registro excluído" }); setDel(null); }, onError: (e) => toast({ title: "Falha ao excluir", description: errMsg(e), variant: "destructive" }) })}>Excluir</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function ModulePage({ eyebrow, title, intro, kinds, extras }: { eyebrow: string; title: string; intro: string; kinds: Kind[]; extras?: Partial<Record<Kind, (rows: ControlRecord[], all: ControlRecord[]) => ReactNode>> }) {
  const [tab, setTab] = useState<Kind>(kinds[0]);
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      {kinds.length > 1 && (
        <div role="tablist" className="mb-4 inline-flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-[#194D36]/10">
          {kinds.map((k) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("rounded-full px-4 py-1.5 text-[13px] font-semibold transition", tab === k ? "bg-[#194D36] text-white" : "text-[#58645D] hover:text-[#194D36]")} data-testid={`tab-${k}`}>{KINDS[k].plural}</button>)}
        </div>
      )}
      <RecordTable key={tab} kind={tab} extra={extras?.[tab]} />
    </div>
  );
}

export function StatStrip({ items }: { items: { label: string; value: number | string; tone?: "ok" | "warn" | "bad" | "mute" }[] }) {
  const c = { ok: "text-[#1F6A43]", warn: "text-[#8A5A0B]", bad: "text-[#A2332A]", mute: "text-[#194D36]" };
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">{items.map((i) => <div key={i.label} className="rounded-xl border border-[#194D36]/10 bg-white px-4 py-3"><p className={cn("font-mono text-[24px] font-medium", c[i.tone ?? "mute"])}>{i.value}</p><p className="text-[12px] text-[#58645D]">{i.label}</p></div>)}</div>;
}
