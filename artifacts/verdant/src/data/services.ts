import { FileCheck2, Building2, Recycle, Landmark, Ruler, FolderKanban, Compass, type LucideIcon } from "lucide-react";

export interface ServiceItem { name: string; detail: string }
export interface ServiceCategory {
  id: string; letter: string; title: string; icon: LucideIcon; summary: string;
  description: string; benefits: string[]; items: ServiceItem[]; partners?: boolean;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "licenciamento", letter: "A", title: "Licenciamento ambiental", icon: FileCheck2,
    summary: "Condução técnica das etapas de licenciamento, da concepção à operação.",
    description: "Estruturamos e acompanhamos processos de licenciamento junto aos órgãos competentes, organizando estudos, documentos e prazos para que cada etapa seja conduzida com previsibilidade. Não prometemos aprovação: a decisão cabe ao órgão ambiental. Nosso compromisso é com a qualidade técnica e a completude do processo.",
    benefits: ["Planejamento antecipado de prazos e exigências", "Documentação organizada e coerente", "Interlocução técnica com os órgãos", "Redução de retrabalho em pedidos de complementação"],
    items: [
      { name: "Licença Prévia (LP)", detail: "Apoio na fase de planejamento e viabilidade do empreendimento." },
      { name: "Licença de Instalação (LI)", detail: "Organização de requisitos para a implantação." },
      { name: "Licença de Operação (LO)", detail: "Preparação do processo para início das operações." },
      { name: "Renovação de Licença de Operação", detail: "Controle de prazos e montagem antecipada do pedido." },
      { name: "Alterações e ampliações de licenças", detail: "Avaliação de mudanças de processo, área ou capacidade." },
      { name: "Atendimento a condicionantes", detail: "Interpretação, planejamento e comprovação." },
      { name: "Regularização ambiental", detail: "Diagnóstico de pendências e plano de adequação." },
    ],
  },
  {
    id: "gestao-empresarial", letter: "B", title: "Gestão ambiental empresarial", icon: Building2,
    summary: "Acompanhamento contínuo da rotina ambiental da operação.",
    description: "Atuamos como extensão técnica da sua equipe, com rotina estruturada de verificações, controle de requisitos e indicadores. O objetivo é transformar obrigações dispersas em um sistema de gestão previsível.",
    benefits: ["Visão consolidada das obrigações", "Rotina preventiva em vez de reativa", "Indicadores para a liderança", "Evidências prontas para fiscalizações"],
    items: [
      { name: "Consultoria ambiental mensal", detail: "Acompanhamento recorrente com agenda técnica definida." },
      { name: "Auditorias documentais", detail: "Verificação de licenças, registros e evidências." },
      { name: "Inspeções ambientais", detail: "Vistorias de campo com registro fotográfico e relatório." },
      { name: "Diagnósticos ambientais", detail: "Leitura completa da situação atual da unidade." },
      { name: "Gestão de requisitos legais", detail: "Mapeamento e acompanhamento dos requisitos aplicáveis." },
      { name: "Acompanhamento de condicionantes", detail: "Controle de prazos, responsáveis e comprovações." },
      { name: "Planos de ação e indicadores ambientais", detail: "Metas, responsáveis e evolução mensurável." },
    ],
  },
  {
    id: "residuos", letter: "C", title: "Gestão de resíduos", icon: Recycle,
    summary: "Da geração à destinação final, com rastreabilidade documental.",
    description: "Estruturamos planos e controles de resíduos com foco em rastreabilidade: cada resíduo gerado precisa ter documento, transportador, destinador e comprovação de destinação coerentes entre si.",
    benefits: ["Rastreabilidade de ponta a ponta", "Identificação de documentos faltantes", "Avaliação de fornecedores", "Relatórios gerenciais por categoria"],
    items: [
      { name: "Elaboração e atualização de PGRS", detail: "Plano de Gerenciamento de Resíduos Sólidos." },
      { name: "PGRCC", detail: "Plano de Gerenciamento de Resíduos da Construção Civil." },
      { name: "Gestão de MTR e CDF", detail: "Controle de manifestos e certificados de destinação." },
      { name: "Controle de destinação de resíduos", detail: "Conciliação entre geração, transporte e destino." },
      { name: "Rastreabilidade documental", detail: "Organização de evidências por lote e período." },
      { name: "Avaliação de fornecedores e destinadores", detail: "Verificação documental de parceiros da cadeia." },
      { name: "Apoio ao SINIR", detail: "Suporte nas rotinas do sistema nacional de informações." },
    ],
  },
  {
    id: "ibama", letter: "D", title: "IBAMA e obrigações federais", icon: Landmark,
    summary: "Cadastros, relatórios e taxas federais sob controle.",
    description: "Organizamos o calendário de obrigações federais e apoiamos o preenchimento e a conferência das informações, evitando inconsistências entre cadastros e relatórios.",
    benefits: ["Calendário federal consolidado", "Coerência entre cadastros", "Conferência técnica das declarações", "Histórico organizado por exercício"],
    items: [
      { name: "Cadastro Técnico Federal (CTF/APP)", detail: "Inscrição, atualização e manutenção cadastral." },
      { name: "RAPP", detail: "Relatório Anual de Atividades Potencialmente Poluidoras." },
      { name: "TCFA", detail: "Taxa de Controle e Fiscalização Ambiental." },
      { name: "Regularização cadastral", detail: "Correção de enquadramentos e pendências." },
      { name: "Assessoria em obrigações federais", detail: "Orientação contínua sobre exigências federais." },
    ],
  },
  {
    id: "estudos", letter: "E", title: "Estudos e laudos técnicos", icon: Ruler, partners: true,
    summary: "Levantamentos de campo e produtos cartográficos.",
    description: "Coordenamos estudos e laudos técnicos com metodologia documentada. Serviços executados por profissionais habilitados e parceiros técnicos especializados, conforme a exigência de cada escopo.",
    benefits: ["Metodologia transparente", "Produtos cartográficos padronizados", "Integração com o licenciamento", "Entregáveis em formatos abertos"],
    items: [
      { name: "Laudos de ruído ambiental", detail: "Medições e avaliação em pontos definidos." },
      { name: "Avaliação de vibração perimetral", detail: "Levantamento no entorno da operação." },
      { name: "Estudos ambientais", detail: "Estudos de suporte a processos e decisões." },
      { name: "Diagnósticos técnicos", detail: "Avaliações específicas por tema." },
      { name: "Georreferenciamento", detail: "Posicionamento preciso de áreas e estruturas." },
      { name: "Mapas ambientais", detail: "Cartografia temática para processos e relatórios." },
      { name: "Arquivos shapefile", detail: "Bases vetoriais prontas para sistemas oficiais." },
      { name: "Caracterização de áreas", detail: "Levantamento de uso, cobertura e restrições." },
    ],
  },
  {
    id: "documental", letter: "F", title: "Gestão documental e conformidade", icon: FolderKanban,
    summary: "Documentos certos, no lugar certo, dentro do prazo.",
    description: "Organizamos o acervo ambiental da empresa com critérios claros de categorização, versionamento e vencimento, preparando a base para auditorias e para a futura migração ao VERDANT CONTROL.",
    benefits: ["Acervo único e pesquisável", "Vencimentos sob controle", "Evidências localizáveis em minutos", "Prontidão para auditorias"],
    items: [
      { name: "Organização de documentos ambientais", detail: "Estrutura de pastas e nomenclatura padronizada." },
      { name: "Controle de vencimentos", detail: "Calendário de licenças, laudos e cadastros." },
      { name: "Gestão de evidências", detail: "Comprovações vinculadas a cada obrigação." },
      { name: "Preparação para auditorias", detail: "Checklists e dossiês organizados." },
      { name: "Controle de licenças e autorizações", detail: "Inventário completo com status." },
      { name: "Indicadores de desempenho ambiental", detail: "Painéis periódicos para a gestão." },
    ],
  },
  {
    id: "especializada", letter: "G", title: "Consultoria especializada", icon: Compass, partners: true,
    summary: "Suporte técnico em situações que exigem experiência.",
    description: "Apoio técnico em interações com órgãos ambientais e processos administrativos, com postura transparente e documentação rigorosa. Quando aplicável, serviços executados por profissionais habilitados e parceiros técnicos especializados.",
    benefits: ["Posicionamento técnico fundamentado", "Preparação para diligências", "Comunicação clara com órgãos", "Apoio à implantação de SGA"],
    items: [
      { name: "Atendimento a órgãos ambientais", detail: "Preparação de respostas e documentos." },
      { name: "Representação técnica em processos administrativos", detail: "Acompanhamento técnico de processos." },
      { name: "Acompanhamento de diligências", detail: "Presença técnica em vistorias e reuniões." },
      { name: "Orientação para adequação legal", detail: "Roteiro de adequação com prioridades." },
      { name: "Suporte técnico para implantação de SGA", detail: "Estruturação de sistemas de gestão ambiental." },
    ],
  },
];

export const sectors = [
  "Indústrias metalúrgicas", "Indústrias alimentícias", "Indústrias químicas",
  "Logística e transporte", "Construção civil", "Centros de distribuição", "Empresas de serviços",
];
