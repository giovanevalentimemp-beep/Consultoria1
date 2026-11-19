/**
 * Artigos demonstrativos. Para publicar um novo artigo, adicione um objeto a este array.
 * Conteúdo de caráter orientativo e geral; não substitui análise técnica do caso concreto.
 */
export interface Article {
  slug: string; title: string; category: string; date: string; readTime: string;
  image: string; excerpt: string; sections: { heading: string; paragraphs: string[] }[];
}

export const articles: Article[] = [
  {
    slug: "como-funciona-o-licenciamento-ambiental", title: "Como funciona o licenciamento ambiental", category: "Licenciamento", date: "2025-03-12", readTime: "6 min", image: "images/aerial.jpg",
    excerpt: "Uma visão geral das etapas, dos atores envolvidos e de como se preparar para um processo previsível.",
    sections: [
      { heading: "O que é, em termos práticos", paragraphs: ["O licenciamento ambiental é o procedimento administrativo pelo qual o órgão competente avalia atividades que possam causar impacto ambiental. Na prática, ele organiza o diálogo entre o empreendimento e o poder público em torno de informações técnicas.", "O enquadramento da atividade, o porte e a localização influenciam quais estudos serão exigidos e qual órgão conduzirá o processo. Por isso, a primeira etapa costuma ser uma análise cuidadosa do caso concreto."] },
      { heading: "As etapas mais comuns", paragraphs: ["Em muitos casos, o processo é dividido em fases que acompanham o ciclo do empreendimento: planejamento, instalação e operação. Cada fase tem exigências próprias e pode gerar condicionantes a serem cumpridas.", "Há também modalidades simplificadas ou unificadas, a depender das regras aplicáveis ao estado e à atividade. Confirmar o rito correto evita retrabalho."] },
      { heading: "Como se preparar", paragraphs: ["Documentação organizada, informações coerentes entre si e um calendário realista são os principais fatores de previsibilidade. Nenhuma consultoria pode garantir aprovação, mas um processo bem instruído reduz pedidos de complementação.", "Recomendamos sempre validar o enquadramento e as exigências diretamente com o órgão ambiental competente e com profissionais habilitados."] },
    ],
  },
  {
    slug: "renovacao-de-licenca-de-operacao", title: "Renovação de Licença de Operação: principais cuidados", category: "Licenciamento", date: "2025-02-26", readTime: "5 min", image: "images/hero-industry.jpg",
    excerpt: "Prazos, condicionantes e mudanças operacionais: o que revisar antes de protocolar a renovação.",
    sections: [
      { heading: "Comece pelo calendário", paragraphs: ["A renovação costuma ter prazo de antecedência definido pelas regras aplicáveis e pela própria licença. Identificar essa data com folga é o primeiro cuidado.", "Um controle de vencimentos com alertas escalonados ajuda a evitar que a renovação seja tratada como urgência."] },
      { heading: "Revise as condicionantes", paragraphs: ["O histórico de cumprimento das condicionantes da licença vigente é frequentemente avaliado. Reunir evidências ao longo do período é muito mais simples do que reconstruí-las às vésperas do protocolo.", "Pendências identificadas devem ser tratadas com transparência e plano de ação."] },
      { heading: "Mudanças na operação", paragraphs: ["Alterações de processo, capacidade ou área podem exigir procedimento específico, distinto da simples renovação. Vale avaliar essas mudanças com antecedência.", "Em caso de dúvida, consulte o órgão competente e profissionais habilitados."] },
    ],
  },
  {
    slug: "como-estruturar-um-pgrs", title: "Como estruturar um PGRS", category: "Resíduos", date: "2025-02-10", readTime: "7 min", image: "images/waste.jpg",
    excerpt: "Do inventário de resíduos ao plano de ação: a lógica de um plano que funciona no dia a dia.",
    sections: [
      { heading: "Inventário antes de tudo", paragraphs: ["Um PGRS útil começa pelo levantamento real dos resíduos gerados: origem, característica, quantidade estimada e forma de armazenamento.", "Esse inventário deve refletir a operação atual, não uma versão idealizada dela."] },
      { heading: "Fluxos e responsabilidades", paragraphs: ["Para cada resíduo, o plano define segregação, acondicionamento, transporte e destinação, além de quem responde por cada etapa.", "A clareza de responsabilidades é o que transforma o documento em prática."] },
      { heading: "Plano vivo", paragraphs: ["Mudanças de processo, fornecedores ou volumes exigem atualização. Revisões periódicas mantêm o plano aderente à realidade.", "Os requisitos de conteúdo podem variar conforme a atividade e a localidade; confirme-os com o órgão competente."] },
    ],
  },
  {
    slug: "o-que-sao-mtr-e-cdf", title: "O que são MTR e CDF", category: "Resíduos", date: "2025-01-28", readTime: "4 min", image: "images/waste.jpg",
    excerpt: "Manifesto de transporte e certificado de destinação: por que a coerência entre eles importa.",
    sections: [
      { heading: "Dois documentos, uma cadeia", paragraphs: ["O MTR (Manifesto de Transporte de Resíduos) acompanha o resíduo no trajeto entre gerador e destinador. O CDF (Certificado de Destinação Final) comprova a destinação realizada.", "Juntos, eles formam a trilha documental que evidencia a gestão adequada."] },
      { heading: "Onde surgem os problemas", paragraphs: ["Manifestos sem certificado correspondente, divergências de quantidade ou de classificação são inconsistências comuns e merecem acompanhamento.", "Uma conciliação periódica entre MTR e CDF identifica lacunas antes de uma auditoria."] },
      { heading: "Boas práticas", paragraphs: ["Centralizar os documentos, vinculá-los ao inventário de resíduos e manter histórico por período facilita consultas e comprovações.", "As regras e sistemas aplicáveis variam por estado; verifique os procedimentos vigentes."] },
    ],
  },
  {
    slug: "obrigacoes-do-ctf-app-e-rapp", title: "Obrigações do CTF/APP e RAPP", category: "Obrigações federais", date: "2025-01-14", readTime: "5 min", image: "images/office.jpg",
    excerpt: "Cadastro e relatório anual: uma visão organizada das obrigações federais mais recorrentes.",
    sections: [
      { heading: "O cadastro", paragraphs: ["O Cadastro Técnico Federal de Atividades Potencialmente Poluidoras e Utilizadoras de Recursos Ambientais registra pessoas e empresas que exercem determinadas atividades.", "O enquadramento correto das atividades é a base para as demais obrigações."] },
      { heading: "O relatório anual", paragraphs: ["O RAPP reúne informações sobre as atividades declaradas em cada exercício. Dados coerentes com licenças e controles internos evitam inconsistências.", "Organizar as informações ao longo do ano reduz o esforço no período de entrega."] },
      { heading: "Mantenha o histórico", paragraphs: ["Comprovantes, recibos e versões enviadas devem ficar arquivados e localizáveis.", "Prazos e regras devem ser confirmados nas fontes oficiais a cada exercício."] },
    ],
  },
  {
    slug: "como-funciona-a-tcfa", title: "Como funciona a TCFA", category: "Obrigações federais", date: "2024-12-18", readTime: "4 min", image: "images/aerial.jpg",
    excerpt: "Entenda a lógica da taxa e como integrá-la ao calendário de obrigações.",
    sections: [
      { heading: "Uma taxa vinculada ao cadastro", paragraphs: ["A Taxa de Controle e Fiscalização Ambiental está relacionada às atividades declaradas no cadastro federal e ao porte da empresa.", "Por isso, um cadastro desatualizado pode gerar valores ou obrigações inadequadas."] },
      { heading: "Calendário e comprovação", paragraphs: ["Incluir a TCFA no calendário ambiental, com responsáveis definidos, evita esquecimentos.", "Guardar comprovantes vinculados a cada período facilita auditorias."] },
      { heading: "Quando revisar", paragraphs: ["Mudanças de atividade, porte ou estrutura societária são bons momentos para revisar o enquadramento.", "Consulte sempre as orientações oficiais vigentes."] },
    ],
  },
  {
    slug: "gestao-ambiental-em-industrias", title: "Gestão ambiental em indústrias", category: "Gestão", date: "2024-12-03", readTime: "6 min", image: "images/audit.jpg",
    excerpt: "Por que a gestão preventiva, estruturada e baseada em evidências é a que se sustenta.",
    sections: [
      { heading: "Do reativo ao preventivo", paragraphs: ["Muitas indústrias tratam o tema ambiental apenas quando surge uma fiscalização ou um vencimento. Esse modelo gera custos, urgências e exposição.", "A gestão preventiva antecipa prazos, distribui responsabilidades e acompanha indicadores."] },
      { heading: "Estrutura mínima", paragraphs: ["Inventário de licenças e obrigações, calendário de vencimentos, responsáveis nomeados e um local único para evidências formam a base.", "Com essa estrutura, a liderança ganha visibilidade real da situação."] },
      { heading: "Evidências como linguagem comum", paragraphs: ["Decisões ambientais bem fundamentadas dependem de dados confiáveis. Registrar, versionar e localizar evidências é parte da gestão, não burocracia.", "Cada operação tem particularidades que exigem análise técnica dedicada."] },
    ],
  },
  {
    slug: "como-preparar-uma-empresa-para-auditorias-ambientais", title: "Como preparar uma empresa para auditorias ambientais", category: "Auditoria", date: "2024-11-19", readTime: "5 min", image: "images/monitoring.jpg",
    excerpt: "Checklists, dossiês e pessoas preparadas: o que faz uma auditoria transcorrer bem.",
    sections: [
      { heading: "Conheça o escopo", paragraphs: ["Auditorias internas, de clientes ou de certificação têm objetivos diferentes. Entender o escopo define o que precisa estar disponível.", "Uma auditoria documental prévia identifica lacunas com tempo para correção."] },
      { heading: "Dossiê organizado", paragraphs: ["Licenças, condicionantes, comprovações, registros de resíduos e cadastros devem estar reunidos e atualizados.", "Saber onde está cada documento transmite controle."] },
      { heading: "Pessoas preparadas", paragraphs: ["Os responsáveis por cada área devem conhecer seus processos e evidências. Clareza e transparência valem mais que respostas improvisadas.", "Após a auditoria, transforme os apontamentos em plano de ação com prazos."] },
    ],
  },
  {
    slug: "tecnologia-e-inteligencia-artificial-na-gestao-ambiental", title: "Tecnologia e inteligência artificial na gestão ambiental", category: "Tecnologia", date: "2024-11-05", readTime: "6 min", image: "images/office.jpg",
    excerpt: "Onde a IA ajuda, onde ela não substitui o técnico, e como combinar os dois com segurança.",
    sections: [
      { heading: "O que a tecnologia resolve bem", paragraphs: ["Centralizar documentos, controlar vencimentos e disparar alertas são tarefas que a tecnologia executa com consistência.", "Isso libera a equipe técnica para análise e decisão."] },
      { heading: "O papel da inteligência artificial", paragraphs: ["Modelos de IA podem ler documentos, sugerir obrigações e identificar inconsistências. São ferramentas de apoio poderosas para triagem e organização.", "Porém, a IA pode errar. Informações técnicas e obrigações legais relevantes devem passar por validação humana."] },
      { heading: "Combinação responsável", paragraphs: ["O modelo que defendemos une a eficiência da tecnologia ao julgamento de profissionais habilitados.", "É essa a lógica que orienta o desenvolvimento do VERDANT CONTROL."] },
    ],
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
