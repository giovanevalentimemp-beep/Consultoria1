import { Link } from "wouter";
import { useSeo } from "@/components/site/primitives";
import { siteConfig, fullAddress } from "@/config/site";

type Doc = { title: string; description: string; intro: string; sections: [string, string][] };

const c = siteConfig.contact;
const privacy: Doc = {
  title: "Política de privacidade",
  description: "Como a VERDANT AMBIENTAL trata dados pessoais neste site.",
  intro: "Este documento é um modelo demonstrativo e deve ser revisado por assessoria jurídica antes da publicação definitiva.",
  sections: [
    ["1. Dados coletados", "Este site possui formulário de contato e área de acesso à plataforma, ambos em modo demonstrativo. No estado atual, nenhum dado digitado nesses formulários é transmitido a servidores ou armazenado. Senhas nunca são registradas."],
    ["2. Finalidade", "Quando a integração de envio estiver ativa, os dados informados no formulário de contato (nome, empresa, e-mail, telefone, assunto e mensagem) serão utilizados exclusivamente para responder à solicitação e elaborar propostas comerciais."],
    ["3. Compartilhamento", "Os dados não serão vendidos. Poderão ser compartilhados apenas com prestadores necessários à operação (como serviços de e-mail e hospedagem), sob obrigações de confidencialidade."],
    ["4. Direitos do titular", "O titular poderá solicitar confirmação de tratamento, acesso, correção, anonimização ou eliminação de dados, conforme a legislação de proteção de dados aplicável."],
    ["5. Cookies e mapas", "O mapa da página de contato é carregado a partir de serviço de terceiros, que pode utilizar cookies próprios conforme suas políticas."],
    ["6. Contato", `Dúvidas sobre esta política: ${c.email} · ${fullAddress()}.`],
  ],
};
const terms: Doc = {
  title: "Termos de uso",
  description: "Condições de uso do site institucional da VERDANT AMBIENTAL.",
  intro: "Este documento é um modelo demonstrativo e deve ser revisado por assessoria jurídica antes da publicação definitiva.",
  sections: [
    ["1. Objeto", "Este site apresenta a VERDANT AMBIENTAL, seus serviços de consultoria e a plataforma VERDANT CONTROL, atualmente em desenvolvimento."],
    ["2. Natureza das informações", "Os conteúdos publicados têm caráter informativo e geral e não constituem parecer técnico ou jurídico. Decisões devem ser tomadas com base em análise específica do caso."],
    ["3. Dados demonstrativos", "Nomes, perfis, indicadores e telas apresentados são ilustrativos. Não representam clientes, resultados ou profissionais reais."],
    ["4. Plataforma", "A área de acesso ao VERDANT CONTROL é uma estrutura visual. A autenticação e as funcionalidades descritas serão disponibilizadas futuramente, mediante contratação e termos próprios."],
    ["5. Ausência de garantias de resultado", "A VERDANT não garante aprovação de licenças ou decisões de órgãos públicos, que dependem exclusivamente das autoridades competentes."],
    ["6. Propriedade intelectual", "Marcas, textos, imagens e layout deste site pertencem à VERDANT AMBIENTAL ou a seus licenciadores."],
  ],
};

function LegalDoc({ doc }: { doc: Doc }) {
  useSeo(doc.title, doc.description);
  return (
    <div className="pt-36 pb-24 md:pt-44">
      <div className="mx-auto max-w-3xl px-6">
        <p className="eyebrow">Documento institucional</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">{doc.title}</h1>
        <p className="mt-5 rounded-xl bg-[#F5F9F6] p-4 text-sm text-[#58645D]">{doc.intro}</p>
        {doc.sections.map(([h, p]) => (
          <section key={h} className="mt-10"><h2 className="text-xl font-bold">{h}</h2><p className="mt-3 text-lg leading-relaxed text-[#58645D]">{p}</p></section>
        ))}
        <Link href="/contato" className="mt-12 inline-block font-semibold text-[#39845B] underline underline-offset-4">Entrar em contato</Link>
      </div>
    </div>
  );
}

export const PrivacyPage = () => <LegalDoc doc={privacy} />;
export const TermsPage = () => <LegalDoc doc={terms} />;
