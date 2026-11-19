/**
 * CONFIGURAÇÃO CENTRAL — VERDANT AMBIENTAL
 * Todos os dados abaixo são FICTÍCIOS e devem ser substituídos pelos dados reais.
 * Campos de URL vazios ("") indicam destino ainda não configurado: o site
 * exibirá um aviso honesto em vez de enviar o visitante a uma conta inventada.
 */
export const siteConfig = {
  company: {
    name: "VERDANT AMBIENTAL",
    shortName: "Verdant",
    slogan: "Inteligência ambiental. Segurança para o seu negócio.",
    description:
      "Consultoria ambiental especializada em licenciamento, regularização, gestão ambiental empresarial, conformidade legal e tecnologia aplicada à gestão ambiental.",
    logoText: "VERDANT",
    logoSubtext: "AMBIENTAL",
    siteUrl: "https://www.verdantambiental.com.br",
  },
  contact: {
    address: {
      street: "Av. Paulista, 1000",
      district: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zip: "01310-100",
    },
    email: "contato@verdantambiental.com.br",
    phone: "(11) 3100-2130",
    phoneHref: "+551131002130",
    hours: ["Segunda a sexta, das 8h30 às 18h", "Atendimento presencial mediante agendamento"],
    mapEmbedQuery: "Av. Paulista, 1000, São Paulo",
  },
  /** Número no formato internacional, apenas dígitos (ex.: "5511999999999"). Vazio = não configurado. */
  whatsapp: {
    number: "",
    defaultMessage: "Olá! Gostaria de falar com um especialista da VERDANT AMBIENTAL.",
  },
  product: {
    name: "VERDANT CONTROL",
    slogan: "Todo o controle ambiental da sua empresa em um só lugar.",
    status: "Em desenvolvimento",
  },
  commercial: {
    responseCommitment: "Retorno em horário comercial após a integração do formulário",
    serviceRegion: "Atendimento corporativo B2B em todo o território nacional (modalidade a definir por projeto)",
    partnersNotice:
      "Serviços executados por profissionais habilitados e parceiros técnicos especializados, conforme a natureza de cada escopo.",
  },
  /** Estado das integrações futuras. Nenhuma está ativa neste momento. */
  integrations: {
    contactFormEndpoint: "",
    authProvider: "",
    platformUrl: "",
    aiApi: "",
    emailService: "",
    documentStorage: "",
  },
  team: [
    { id: "diretor-tecnico", name: "Ricardo Almeida", role: "Diretor Técnico", title: "Engenheiro Ambiental", photo: "images/team-1.jpg", bio: "Responsável pela coordenação técnica, planejamento ambiental, licenciamento e supervisão dos projetos.", areas: ["Coordenação técnica", "Planejamento ambiental", "Licenciamento", "Supervisão de projetos"] },
    { id: "gestao-ambiental", name: "Camila Ferraz", role: "Especialista em Gestão Ambiental", title: "Gestão e conformidade", photo: "images/team-2.jpg", bio: "Atuação em PGRS, gestão de resíduos, requisitos legais, auditorias e conformidade ambiental.", areas: ["PGRS", "Gestão de resíduos", "Requisitos legais", "Auditorias"] },
    { id: "geoprocessamento", name: "Daniel Nakamura", role: "Especialista em Geoprocessamento", title: "Análise territorial", photo: "images/team-3.jpg", bio: "Atuação em georreferenciamento, mapas ambientais, análise territorial e arquivos shapefile.", areas: ["Georreferenciamento", "Mapas ambientais", "Análise territorial", "Shapefile"] },
    { id: "licenciamento", name: "Helena Santos", role: "Analista de Licenciamento Ambiental", title: "Processos administrativos", photo: "images/team-4.jpg", bio: "Atuação em processos administrativos, acompanhamento de licenças e interface com órgãos ambientais.", areas: ["Processos administrativos", "Acompanhamento de licenças", "Interface com órgãos"] },
    { id: "monitoramento", name: "Bruno Carvalho", role: "Especialista em Monitoramento Ambiental", title: "Estudos técnicos", photo: "images/team-5.jpg", bio: "Atuação em avaliações de ruído, vibração, monitoramentos e estudos técnicos.", areas: ["Ruído ambiental", "Vibração", "Monitoramentos", "Estudos técnicos"] },
    { id: "tecnologia", name: "Larissa Moura", role: "Consultora de Tecnologia Ambiental", title: "Produto VERDANT CONTROL", photo: "images/team-6.jpg", bio: "Responsável pelo desenvolvimento e evolução da plataforma de gestão ambiental.", areas: ["Produto digital", "Automação", "Inteligência artificial", "Dados ambientais"] },
  ],
};

export const fullAddress = () => {
  const a = siteConfig.contact.address;
  return `${a.street} – ${a.district} – ${a.city}/${a.state} – CEP ${a.zip}`;
};

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const whatsappUrl = () => {
  const n = siteConfig.whatsapp.number.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(siteConfig.whatsapp.defaultMessage)}`;
};
