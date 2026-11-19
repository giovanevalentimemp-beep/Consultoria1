import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ControlRecord } from "@workspace/api-client-react";
import { ModulePage, StatStrip, useRecords } from "@/platform/record-module";
import { NativeSelect, Panel, daysUntil, fmtDate } from "@/platform/ui";

const num = (v: unknown) => (typeof v === "number" ? v : v === "" || v == null ? NaN : Number(v));

function LicenseStats(_: ControlRecord[], all: ControlRecord[]) {
  const live = all.filter((r) => r.status !== "archived");
  const n = (f: (r: ControlRecord) => boolean) => live.filter(f).length;
  return <StatStrip items={[
    { label: "Vigentes", value: n((r) => r.status === "vigente" && (daysUntil(r.dueDate) ?? 999) > 120), tone: "ok" },
    { label: "Vencem em até 120 dias", value: n((r) => { const d = daysUntil(r.dueDate); return d !== null && d >= 0 && d <= 120; }), tone: "warn" },
    { label: "Vencidas", value: n((r) => r.status === "vencida" || (daysUntil(r.dueDate) ?? 1) < 0), tone: "bad" },
    { label: "Em renovação", value: n((r) => r.status === "em_renovacao") },
    { label: "Em análise", value: n((r) => r.status === "em_analise") },
  ]} />;
}

export const LicencasPage = () => <ModulePage eyebrow="Licenciamento" title="Licenças e autorizações" intro="LP, LI, LO, outorgas e alvarás com vencimento, parâmetros e o acompanhamento de cada renovação." kinds={["license"]} extras={{ license: LicenseStats }} />;
export const CondicionantesPage = () => <ModulePage eyebrow="Licenciamento" title="Condicionantes ambientais" intro="Cada exigência como registro individual, com texto integral, licença de origem, periodicidade confirmada e evidências." kinds={["condition"]} />;
export const ObrigacoesPage = () => <ModulePage eyebrow="Requisitos legais" title="Obrigações legais" intro="Nenhuma obrigação é declarada aplicável sem fundamentação e validação técnica registradas." kinds={["obligation", "task"]} />;
export const IbamaPage = () => <ModulePage eyebrow="Obrigações federais" title="IBAMA, CTF/APP, RAPP e TCFA" intro="Valores e declarações são conferidos por uma pessoa antes de qualquer transmissão ou pagamento." kinds={["ibama", "rapp", "tcfa"]} />;
export const AuditoriasPage = () => <ModulePage eyebrow="Verificação" title="Auditorias e inspeções" intro="Programe auditorias, monte o checklist como itens vinculados e transforme não conformidades em planos de ação." kinds={["audit", "requirement"]} />;
export const PlanosPage = () => <ModulePage eyebrow="Tratamento" title="Planos de ação" intro="Ações corretivas e preventivas com causa, prazo, prioridade e evidência." kinds={["action", "task"]} extras={{ action: (_r, all) => {
  const live = all.filter((r) => r.status !== "archived");
  return <StatStrip items={[{ label: "Abertas", value: live.filter((r) => r.status === "aberta").length }, { label: "Em andamento", value: live.filter((r) => r.status === "em_andamento").length }, { label: "Aguardando evidência", value: live.filter((r) => r.status === "aguardando_evidencia").length, tone: "warn" }, { label: "Atrasadas", value: live.filter((r) => r.status === "atrasada" || (r.status !== "concluida" && (daysUntil(r.dueDate) ?? 1) < 0)).length, tone: "bad" }, { label: "Concluídas", value: live.filter((r) => r.status === "concluida").length, tone: "ok" }]} />;
} }} />;

function Traceability() {
  const mtr = useRecords("mtr").data ?? [];
  const cdf = useRecords("cdf").data ?? [];
  const live = (a: ControlRecord[]) => a.filter((r) => r.status !== "archived" && r.status !== "cancelado");
  const L = live(mtr), C = live(cdf);
  const linked = (m: ControlRecord) => (m.relatedIds?.length ?? 0) > 0 || C.some((c) => c.relatedIds?.includes(m.id));
  const without = L.filter((m) => !linked(m));
  const divergences = C.filter((c) => {
    const ms = L.filter((m) => c.relatedIds?.includes(m.id) || m.relatedIds?.includes(c.id));
    if (!ms.length) return false;
    const sum = ms.reduce((a, m) => a + (num(m.data?.quantity) || 0), 0);
    const q = num(c.data?.quantity);
    return !isNaN(q) && Math.abs(sum - q) > 0.0001;
  });
  const destDiff = C.filter((c) => L.some((m) => (c.relatedIds?.includes(m.id) || m.relatedIds?.includes(c.id)) && m.data?.destinatorId && c.data?.destinatorId && m.data.destinatorId !== c.data.destinatorId));
  const nums = L.map((m) => String(m.data?.number ?? "")).filter(Boolean);
  const dup = nums.filter((n, i) => nums.indexOf(n) !== i);
  const incomplete = L.filter((m) => !m.data?.number || !m.data?.quantity || !m.data?.destinatorId);
  return (
    <Panel title="Conferência MTR × CDF" action={<span className="font-mono text-[11px] text-[#58645D]">calculado a partir dos vínculos cadastrados</span>}>
      <div className="p-4"><StatStrip items={[
        { label: "MTR sem CDF", value: without.length, tone: without.length ? "bad" : "ok" },
        { label: "Divergência de quantidade", value: divergences.length, tone: divergences.length ? "warn" : "ok" },
        { label: "Destinador diferente", value: destDiff.length, tone: destDiff.length ? "warn" : "ok" },
        { label: "Números duplicados", value: new Set(dup).size, tone: dup.length ? "warn" : "ok" },
        { label: "MTR incompletos", value: incomplete.length, tone: incomplete.length ? "warn" : "ok" },
      ]} />
        {without.length > 0 && <p className="mt-3 text-[12.5px] text-[#58645D]">Sem CDF: {without.slice(0, 6).map((m) => m.title).join(", ")}{without.length > 6 ? "..." : ""}</p>}
      </div>
    </Panel>
  );
}
export const ResiduosPage = () => <ModulePage eyebrow="Rastreabilidade" title="Gestão de resíduos" intro="Inventário, manifestos e certificados com vínculos de um para vários e vários para um, conforme os registros reais." kinds={["waste", "mtr", "cdf", "supplier"]} extras={{ mtr: () => <Traceability />, cdf: () => <Traceability /> }} />;

function MonitoringChart(_r: ControlRecord[], all: ControlRecord[]) {
  return <MonitoringChartInner all={all} />;
}
function MonitoringChartInner({ all }: { all: ControlRecord[] }) {
  const params = useMemo(() => Array.from(new Set(all.map((r) => String(r.data?.parameter ?? "")).filter(Boolean))), [all]);
  const [p, setP] = useState("");
  const sel = p || params[0] || "";
  const series = all.filter((r) => String(r.data?.parameter ?? "") === sel && !isNaN(num(r.data?.result)) && r.data?.collectedAt).sort((a, b) => String(a.data?.collectedAt).localeCompare(String(b.data?.collectedAt))).map((r) => ({ date: fmtDate(String(r.data?.collectedAt)), result: num(r.data?.result), limit: num(r.data?.limit) }));
  const last = all.find((r) => String(r.data?.parameter ?? "") === sel && !isNaN(num(r.data?.limit)));
  if (!params.length) return null;
  return (
    <Panel title="Evolução dos resultados" action={<div className="w-56"><NativeSelect value={sel} onChange={setP} options={params.map((x) => ({ value: x, label: x }))} placeholder="Parâmetro" /></div>}>
      <div className="h-64 p-4">
        {series.length < 1 ? <p className="text-[13px] text-[#58645D]">Cadastre resultados com data de coleta para este parâmetro.</p> :
          <ResponsiveContainer><LineChart data={series} margin={{ left: -10, right: 12, top: 8 }}><CartesianGrid stroke="#194D36" strokeOpacity={0.06} vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "#58645D" }} /><YAxis tick={{ fontSize: 11, fill: "#58645D" }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid rgba(25,77,54,.12)", fontSize: 12 }} />
            <Line type="monotone" dataKey="result" name="Resultado" stroke="#39845B" strokeWidth={2.5} dot={{ r: 3.5, fill: "#194D36" }} />
            {last && <ReferenceLine y={num(last.data?.limit)} stroke="#B8463B" strokeDasharray="5 4" label={{ value: `Limite · ${String(last.data?.limitSource || "fonte não informada")} ${String(last.data?.limitVersion ?? "")}`, fontSize: 10.5, fill: "#A2332A", position: "insideTopLeft" }} />}
          </LineChart></ResponsiveContainer>}
      </div>
    </Panel>
  );
}
export const MonitoramentosPage = () => <ModulePage eyebrow="Desempenho ambiental" title="Monitoramentos ambientais" intro="Resultados comparados apenas com limites cadastrados, sempre com fonte e versão indicadas." kinds={["monitoring"]} extras={{ monitoring: MonitoringChart }} />;
