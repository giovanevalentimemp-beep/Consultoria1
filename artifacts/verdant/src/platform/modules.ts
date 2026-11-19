import type { RecordInputKind } from "@workspace/api-client-react";

export type Kind = RecordInputKind;
export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "record" | "records" | "documents" | "boolean";
export interface Opt { value: string; label: string }
export interface FieldDef { key: string; label: string; type: FieldType; options?: Opt[]; kinds?: Kind[]; hint?: string; full?: boolean; showIf?: (data: Record<string, unknown>) => boolean }
export interface KindDef {
  kind: Kind; label: string; plural: string; titleLabel: string; titleHint?: string; descriptionLabel?: string;
  statuses: Opt[]; dueLabel?: string; parent?: { kinds: Kind[]; label: string }; related?: { kinds: Kind[]; label: string; hint?: string };
  documentLabel?: string; fields: FieldDef[];
  derive?: { label: string; build: (r: { id: string; title: string; unitId?: string | null; responsible?: string; dueDate?: string | null; data?: Record<string, unknown> }) => { kind: Kind; title: string; parentId: string; unitId?: string | null; responsible?: string; dueDate?: string | null; status: string; data: Record<string, unknown> } };
}

const o = (...pairs: [string, string][]): Opt[] => pairs.map(([value, label]) => ({ value, label }));

export const frequencyOptions = o(["unica", "Única (sem recorrência)"], ["diaria", "Diária"], ["semanal", "Semanal"], ["mensal", "Mensal"], ["bimestral", "Bimestral"], ["trimestral", "Trimestral"], ["semestral", "Semestral"], ["anual", "Anual"], ["bienal", "Bienal"], ["custom", "Personalizada"]);
const freqFields: FieldDef[] = [
  { key: "frequency", label: "Periodicidade", type: "select", options: frequencyOptions, hint: "Extraída do texto e confirmada por você. Não presuma periodicidade fixa." },
  { key: "frequencyCustom", label: "Periodicidade personalizada", type: "text", hint: "Ex.: a cada 45 dias após a coleta", showIf: (d) => d.frequency === "custom" },
  { key: "frequencyConfirmed", label: "Periodicidade confirmada pelo responsável", type: "boolean" },
];

export const agencies = o(["FEPAM", "FEPAM"], ["IAT", "IAT"], ["IBAMA", "IBAMA"], ["CETESB", "CETESB"], ["FATMA/IMA", "IMA (SC)"], ["INEA", "INEA"], ["SEMAD", "SEMAD"], ["Municipal", "Órgão municipal"], ["ANA", "ANA"], ["Outro", "Outro"]);

const actionStatuses = o(["aberta", "Aberta"], ["em_andamento", "Em andamento"], ["aguardando_evidencia", "Aguardando evidência"], ["em_validacao", "Em validação"], ["concluida", "Concluída"], ["atrasada", "Atrasada"], ["archived", "Arquivada"]);

export const KINDS: Record<Kind, KindDef> = {
  unit: {
    kind: "unit", label: "Unidade", plural: "Unidades", titleLabel: "Nome da unidade", statuses: o(["ativa", "Ativa"], ["inativa", "Inativa"], ["archived", "Arquivada"]),
    fields: [
      { key: "cnpj", label: "CNPJ", type: "text" }, { key: "cnae", label: "CNAE", type: "text" },
      { key: "address", label: "Endereço", type: "text", full: true }, { key: "city", label: "Município", type: "text" }, { key: "state", label: "UF", type: "text" },
      { key: "cep", label: "CEP", type: "text" }, { key: "coordinates", label: "Coordenadas (lat, long)", type: "text" },
      { key: "activity", label: "Atividade principal", type: "text", full: true }, { key: "secondaryActivities", label: "Atividades secundárias", type: "textarea", full: true },
      { key: "agency", label: "Órgão ambiental competente", type: "select", options: agencies },
      { key: "environmentalLead", label: "Responsável ambiental", type: "text" },
    ],
  },
  license: {
    kind: "license", label: "Licença", plural: "Licenças e autorizações", titleLabel: "Identificação da licença", titleHint: "Ex.: LO 01234/2024 - Unidade Canoas",
    statuses: o(["vigente", "Vigente"], ["proxima_vencimento", "Próxima do vencimento"], ["vencida", "Vencida"], ["em_renovacao", "Em renovação"], ["em_analise", "Em análise"], ["archived", "Arquivada"]),
    dueLabel: "Data de vencimento", documentLabel: "Arquivo original",
    fields: [
      { key: "number", label: "Número", type: "text" },
      { key: "type", label: "Tipo", type: "select", options: o(["LP", "Licença Prévia"], ["LI", "Licença de Instalação"], ["LO", "Licença de Operação"], ["AA", "Autorização Ambiental"], ["outorga", "Outorga"], ["alvara", "Alvará ambiental"], ["outra", "Outra"]) },
      { key: "issuer", label: "Órgão emissor", type: "select", options: agencies }, { key: "issuedAt", label: "Data de emissão", type: "date" },
      { key: "activity", label: "Atividade licenciada", type: "text", full: true }, { key: "capacity", label: "Capacidade autorizada", type: "text" }, { key: "area", label: "Área licenciada", type: "text" },
      { key: "parameters", label: "Parâmetros operacionais", type: "textarea", full: true },
      { key: "renewalStage", label: "Etapa da renovação", type: "select", options: o(["nao_iniciada", "Não iniciada"], ["documentacao", "Reunindo documentação"], ["protocolada", "Protocolada"], ["em_analise", "Em análise no órgão"], ["exigencias", "Respondendo exigências"], ["renovada", "Renovada"]) },
      { key: "renewalProtocol", label: "Protocolo de renovação", type: "text" },
    ],
  },
  condition: {
    kind: "condition", label: "Condicionante", plural: "Condicionantes", titleLabel: "Resumo da exigência", descriptionLabel: "Texto integral da condicionante",
    statuses: o(["pendente", "Pendente"], ["em_andamento", "Em andamento"], ["atendida", "Atendida"], ["atrasada", "Atrasada"], ["nao_aplicavel", "Não aplicável"], ["archived", "Arquivada"]),
    dueLabel: "Prazo", parent: { kinds: ["license"], label: "Licença vinculada" }, documentLabel: "Documento de origem",
    fields: [
      { key: "reference", label: "Número / identificação", type: "text", hint: "Ex.: Item 4.2" },
      { key: "referenceDate", label: "Data de referência", type: "date" }, { key: "sourcePage", label: "Página no documento", type: "number" },
      ...freqFields,
      { key: "evidenceRequired", label: "Evidências necessárias", type: "textarea", full: true },
      { key: "evidenceDocumentIds", label: "Arquivos de evidência anexados", type: "documents", full: true },
      { key: "history", label: "Histórico de cumprimento", type: "textarea", full: true, hint: "Registre datas de protocolo e entregas" },
    ],
    derive: { label: "Gerar tarefa recorrente", build: (r) => ({ kind: "task", title: `Atender: ${r.title}`.slice(0, 300), parentId: r.id, unitId: r.unitId, responsible: r.responsible, dueDate: r.dueDate ?? null, status: "aberta", data: { frequency: r.data?.frequency ?? "unica", frequencyCustom: r.data?.frequencyCustom ?? "", origin: "condicionante" } }) },
  },
  obligation: {
    kind: "obligation", label: "Obrigação", plural: "Obrigações legais", titleLabel: "Nome da obrigação",
    statuses: o(["em_validacao", "Aguardando validação técnica"], ["pendente", "Pendente"], ["em_andamento", "Em andamento"], ["cumprida", "Cumprida"], ["atrasada", "Atrasada"], ["nao_aplicavel", "Não aplicável"], ["archived", "Arquivada"]),
    dueLabel: "Prazo", parent: { kinds: ["condition", "license"], label: "Origem (condicionante ou licença)" }, documentLabel: "Documento de referência",
    fields: [
      { key: "legalBasis", label: "Fundamentação legal", type: "text", full: true, hint: "Norma e artigo. Não declare aplicabilidade sem fonte." },
      { key: "agency", label: "Órgão responsável", type: "select", options: agencies }, { key: "applicability", label: "Aplicabilidade", type: "text" },
      ...freqFields,
      { key: "requiredDocs", label: "Documentos exigidos", type: "textarea", full: true },
      { key: "evidence", label: "Evidência de cumprimento", type: "textarea", full: true },
      { key: "evidenceDocumentIds", label: "Arquivos de evidência", type: "documents", full: true },
      { key: "technicalValidation", label: "Aplicabilidade validada tecnicamente", type: "boolean" },
    ],
  },
  waste: {
    kind: "waste", label: "Resíduo", plural: "Resíduos", titleLabel: "Tipo de resíduo",
    statuses: o(["ativo", "Em geração"], ["suspenso", "Suspenso"], ["archived", "Arquivado"]),
    fields: [
      { key: "code", label: "Código (IBAMA/LER)", type: "text" }, { key: "classification", label: "Classificação", type: "text" },
      { key: "class", label: "Classe", type: "select", options: o(["I", "Classe I - Perigoso"], ["IIA", "Classe II A - Não inerte"], ["IIB", "Classe II B - Inerte"]) },
      { key: "origin", label: "Origem", type: "text" }, { key: "quantity", label: "Quantidade", type: "number" },
      { key: "measureUnit", label: "Unidade de medida", type: "select", options: o(["kg", "kg"], ["t", "t"], ["m3", "m³"], ["L", "L"], ["un", "un"]) },
      { key: "packaging", label: "Acondicionamento", type: "text" },
      { key: "transporterId", label: "Transportador", type: "record", kinds: ["supplier"] }, { key: "destinatorId", label: "Destinador", type: "record", kinds: ["supplier"] },
      { key: "technology", label: "Tecnologia de destinação", type: "text" },
      { key: "frequency", label: "Periodicidade de geração", type: "select", options: frequencyOptions },
    ],
  },
  mtr: {
    kind: "mtr", label: "MTR", plural: "MTR", titleLabel: "Identificação do manifesto",
    statuses: o(["emitido", "Emitido"], ["recebido", "Recebido pelo destinador"], ["aguardando_cdf", "Aguardando CDF"], ["com_cdf", "Com CDF"], ["cancelado", "Cancelado"], ["archived", "Arquivado"]),
    related: { kinds: ["cdf"], label: "CDFs relacionados", hint: "Relação de um para vários e vários para um" }, documentLabel: "Documento original",
    fields: [
      { key: "number", label: "Número do manifesto", type: "text" }, { key: "issuedAt", label: "Data de emissão", type: "date" },
      { key: "wasteId", label: "Resíduo", type: "record", kinds: ["waste"] }, { key: "quantity", label: "Quantidade", type: "number" },
      { key: "measureUnit", label: "Unidade de medida", type: "select", options: o(["kg", "kg"], ["t", "t"], ["m3", "m³"], ["L", "L"], ["un", "un"]) },
      { key: "transporterId", label: "Transportador", type: "record", kinds: ["supplier"] }, { key: "destinatorId", label: "Destinador", type: "record", kinds: ["supplier"] },
    ],
  },
  cdf: {
    kind: "cdf", label: "CDF", plural: "CDF", titleLabel: "Identificação do certificado",
    statuses: o(["recebido", "Recebido"], ["conferido", "Conferido"], ["divergente", "Com divergência"], ["archived", "Arquivado"]),
    related: { kinds: ["mtr"], label: "MTRs relacionados", hint: "Selecione todos os manifestos cobertos" }, documentLabel: "Documento original",
    fields: [
      { key: "number", label: "Número", type: "text" }, { key: "issuedAt", label: "Data de emissão", type: "date" },
      { key: "destinatorId", label: "Destinador", type: "record", kinds: ["supplier"] },
      { key: "wasteIds", label: "Resíduos vinculados", type: "records", kinds: ["waste"], full: true },
      { key: "quantity", label: "Quantidade total certificada", type: "number" },
      { key: "measureUnit", label: "Unidade de medida", type: "select", options: o(["kg", "kg"], ["t", "t"], ["m3", "m³"], ["L", "L"], ["un", "un"]) },
    ],
  },
  supplier: {
    kind: "supplier", label: "Fornecedor", plural: "Transportadores e destinadores", titleLabel: "Razão social",
    statuses: o(["ativo", "Ativo"], ["licenca_vencida", "Licença vencida"], ["bloqueado", "Bloqueado"], ["archived", "Arquivado"]),
    dueLabel: "Vencimento da licença do fornecedor", documentLabel: "Licença do fornecedor",
    fields: [
      { key: "cnpj", label: "CNPJ", type: "text" },
      { key: "role", label: "Atuação", type: "select", options: o(["transportador", "Transportador"], ["destinador", "Destinador"], ["ambos", "Transportador e destinador"]) },
      { key: "licenseNumber", label: "Número da licença", type: "text" }, { key: "contact", label: "Contato", type: "text" },
    ],
  },
  ibama: {
    kind: "ibama", label: "CTF/APP", plural: "CTF/APP", titleLabel: "Cadastro CTF/APP", statuses: o(["regular", "Regular"], ["pendente", "Pendente"], ["irregular", "Irregular"], ["archived", "Arquivado"]),
    dueLabel: "Validade do certificado de regularidade", documentLabel: "Certificado de regularidade",
    fields: [
      { key: "registration", label: "Número de cadastro", type: "text" }, { key: "situation", label: "Situação cadastral", type: "text" },
      { key: "activities", label: "Atividades cadastradas", type: "textarea", full: true }, { key: "history", label: "Histórico", type: "textarea", full: true },
      { key: "documentIds", label: "Documentos relacionados", type: "documents", full: true },
    ],
  },
  rapp: {
    kind: "rapp", label: "RAPP", plural: "RAPP", titleLabel: "RAPP - ano de referência", statuses: o(["nao_iniciado", "Não iniciado"], ["em_preenchimento", "Em preenchimento"], ["em_conferencia", "Em conferência"], ["transmitido", "Transmitido"], ["archived", "Arquivado"]),
    dueLabel: "Prazo de entrega", documentLabel: "Recibo",
    fields: [
      { key: "year", label: "Ano de referência", type: "number" }, { key: "transmittedAt", label: "Data de transmissão", type: "date" },
      { key: "receipt", label: "Número do recibo", type: "text" }, { key: "requiredInfo", label: "Informações necessárias", type: "textarea", full: true },
      { key: "documentIds", label: "Arquivos relacionados", type: "documents", full: true },
      { key: "humanReviewed", label: "Conferido antes da transmissão", type: "boolean" },
    ],
  },
  tcfa: {
    kind: "tcfa", label: "TCFA", plural: "TCFA", titleLabel: "TCFA - trimestre", statuses: o(["a_pagar", "A pagar"], ["pago", "Pago"], ["atrasado", "Atrasado"], ["isento", "Isento"], ["archived", "Arquivado"]),
    dueLabel: "Vencimento", documentLabel: "Comprovante",
    fields: [
      { key: "quarter", label: "Trimestre", type: "select", options: o(["1T", "1º trimestre"], ["2T", "2º trimestre"], ["3T", "3º trimestre"], ["4T", "4º trimestre"]) },
      { key: "year", label: "Ano", type: "number" }, { key: "classification", label: "Enquadramento", type: "text" },
      { key: "size", label: "Porte", type: "select", options: o(["micro", "Microempresa"], ["pequeno", "Pequeno"], ["medio", "Médio"], ["grande", "Grande"]) },
      { key: "pollutionPotential", label: "Potencial poluidor", type: "select", options: o(["pequeno", "Pequeno"], ["medio", "Médio"], ["alto", "Alto"]) },
      { key: "amount", label: "Valor calculado (R$)", type: "number" }, { key: "paidAt", label: "Data de pagamento", type: "date" },
      { key: "humanReviewed", label: "Valor conferido antes do pagamento", type: "boolean" },
    ],
  },
  monitoring: {
    kind: "monitoring", label: "Monitoramento", plural: "Monitoramentos", titleLabel: "Identificação da campanha",
    statuses: o(["programado", "Programado"], ["coletado", "Coletado"], ["laudo_recebido", "Laudo recebido"], ["conforme", "Conforme"], ["nao_conforme", "Não conforme"], ["archived", "Arquivado"]),
    dueLabel: "Próxima avaliação", parent: { kinds: ["condition", "license"], label: "Exigência de origem" }, documentLabel: "Relatório / laudo",
    fields: [
      { key: "type", label: "Tipo", type: "select", options: o(["ruido", "Ruído ambiental"], ["vibracao", "Vibração"], ["efluentes", "Efluentes"], ["emissoes", "Emissões atmosféricas"], ["agua", "Qualidade da água"], ["ar", "Qualidade do ar"], ["licenca", "Específico de licença"]) },
      { key: "parameter", label: "Parâmetro", type: "text" }, { key: "measureUnit", label: "Unidade de medida", type: "text" },
      { key: "result", label: "Resultado", type: "number" }, { key: "limit", label: "Limite de referência", type: "number", hint: "Somente limites com fonte real" },
      { key: "limitSource", label: "Fonte do limite", type: "text", hint: "Ex.: Resolução CONAMA 430/2011, art. 16" }, { key: "limitVersion", label: "Versão / data do limite", type: "text" },
      { key: "collectedAt", label: "Data da coleta", type: "date" }, { key: "lab", label: "Laboratório ou responsável", type: "text" },
      { key: "art", label: "ART (número)", type: "text" },
    ],
  },
  audit: {
    kind: "audit", label: "Auditoria", plural: "Auditorias e inspeções", titleLabel: "Título da auditoria",
    statuses: o(["programada", "Programada"], ["em_execucao", "Em execução"], ["relatorio", "Emitindo relatório"], ["concluida", "Concluída"], ["archived", "Arquivada"]),
    dueLabel: "Data programada", documentLabel: "Relatório emitido",
    fields: [
      { key: "type", label: "Tipo", type: "select", options: o(["interna", "Auditoria interna"], ["externa", "Auditoria externa"], ["inspecao", "Inspeção"], ["fornecedor", "Auditoria de fornecedor"]) },
      { key: "template", label: "Modelo", type: "text", hint: "Ex.: Checklist ISO 14001 - resíduos" },
      { key: "scope", label: "Escopo", type: "textarea", full: true }, { key: "auditor", label: "Auditor", type: "text" },
      { key: "photoDocumentIds", label: "Fotografias e anexos", type: "documents", full: true },
    ],
  },
  requirement: {
    kind: "requirement", label: "Item de checklist", plural: "Checklist", titleLabel: "Requisito verificado",
    statuses: o(["a_verificar", "A verificar"], ["conforme", "Conforme"], ["nao_conforme", "Não conforme"], ["nao_aplicavel", "Não aplicável"], ["archived", "Arquivado"]),
    parent: { kinds: ["audit"], label: "Auditoria" },
    fields: [
      { key: "finding", label: "Constatação", type: "textarea", full: true }, { key: "criterion", label: "Critério / referência", type: "text" },
      { key: "photoDocumentIds", label: "Fotografias", type: "documents", full: true },
    ],
    derive: { label: "Abrir plano de ação", build: (r) => ({ kind: "action", title: `Tratar não conformidade: ${r.title}`.slice(0, 300), parentId: r.id, unitId: r.unitId, responsible: r.responsible, dueDate: null, status: "aberta", data: { origin: "auditoria", priority: "alta" } }) },
  },
  action: {
    kind: "action", label: "Ação", plural: "Planos de ação", titleLabel: "Identificação da ação",
    statuses: actionStatuses, dueLabel: "Prazo", parent: { kinds: ["requirement", "condition", "obligation", "audit", "monitoring"], label: "Origem vinculada" }, documentLabel: "Evidência",
    fields: [
      { key: "origin", label: "Origem", type: "select", options: o(["auditoria", "Auditoria"], ["condicionante", "Condicionante"], ["monitoramento", "Monitoramento"], ["obrigacao", "Obrigação legal"], ["incidente", "Incidente"], ["melhoria", "Melhoria"]) },
      { key: "type", label: "Natureza", type: "select", options: o(["corretiva", "Corretiva"], ["preventiva", "Preventiva"]) },
      { key: "priority", label: "Prioridade", type: "select", options: o(["baixa", "Baixa"], ["media", "Média"], ["alta", "Alta"], ["critica", "Crítica"]) },
      { key: "cause", label: "Causa", type: "textarea", full: true }, { key: "proposedAction", label: "Ação proposta", type: "textarea", full: true },
      { key: "evidence", label: "Evidência", type: "textarea", full: true }, { key: "history", label: "Histórico", type: "textarea", full: true },
    ],
  },
  task: {
    kind: "task", label: "Tarefa", plural: "Tarefas", titleLabel: "Tarefa", statuses: actionStatuses, dueLabel: "Prazo",
    parent: { kinds: ["condition", "obligation", "license", "audit"], label: "Vinculada a" },
    fields: [...freqFields, { key: "origin", label: "Origem", type: "text" }],
  },
};

export const docCategories = ["Licenças ambientais", "Autorizações", "PGRS", "PGRCC", "ART", "Laudos técnicos", "Relatórios ambientais", "MTR", "CDF", "Documentos IBAMA", "Documentos de fornecedores", "Certificados", "Comprovantes", "Plantas e mapas", "Outros"];

export const docStatusLabel: Record<string, string> = {
  uploaded: "Aguardando análise", pending: "Aguardando análise", awaiting_analysis: "Aguardando análise", queued: "Na fila de análise", analyzing: "Em análise pela IA", processing: "Em análise pela IA",
  analyzed: "Analisado pela IA", awaiting_validation: "Aguardando validação", validated: "Validado", rejected: "Rejeitado", expired: "Vencido", failed: "Falha na análise", error: "Falha na análise",
};
export const isDocBusy = (s: string) => ["analyzing", "processing", "queued"].includes(s);

export function statusLabel(kind: Kind | undefined, status?: string) {
  if (!status) return "Sem status";
  const s = kind ? KINDS[kind].statuses.find((x) => x.value === status) : undefined;
  return s?.label ?? docStatusLabel[status] ?? status.replace(/_/g, " ");
}

export type Tone = "ok" | "warn" | "bad" | "info" | "mute";
export function toneFor(status?: string): Tone {
  if (!status) return "mute";
  if (/archived|cancel|nao_aplicavel|inativa|isento/.test(status)) return "mute";
  if (/vencid|atrasad|nao_conforme|irregular|rejected|failed|error|divergente|bloqueado|expired|licenca_vencida/.test(status)) return "bad";
  if (/proxima|pendente|aguardando|a_pagar|em_validacao|awaiting|analyzed|a_verificar|nao_iniciad|programad/.test(status)) return "warn";
  if (/vigente|atendida|cumprida|conforme|concluid|validated|pago|regular|transmitido|com_cdf|ativ|conferido/.test(status)) return "ok";
  return "info";
}

export const roleLabel: Record<string, string> = { company_admin: "Administrador da empresa", manager: "Gestor ambiental", collaborator: "Colaborador", consultant: "Consultor externo", owner: "Proprietário" };
export const moduleList = o(["documentos", "Documentos"], ["licencas", "Licenças"], ["condicionantes", "Condicionantes"], ["obrigacoes", "Obrigações"], ["residuos", "Resíduos"], ["ibama", "IBAMA"], ["monitoramentos", "Monitoramentos"], ["auditorias", "Auditorias"], ["planos", "Planos de ação"], ["calendario", "Calendário"], ["relatorios", "Relatórios"], ["ia", "Assistente IA"], ["alertas", "Alertas"], ["configuracoes", "Configurações"]);
