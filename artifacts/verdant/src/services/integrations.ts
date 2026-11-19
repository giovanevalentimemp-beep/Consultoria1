/**
 * Camada preparada para integrações futuras (backend, autenticação, e-mail, IA, armazenamento).
 * NENHUMA integração está ativa. As funções retornam explicitamente "unavailable"
 * para que a interface nunca simule envio ou autenticação bem-sucedidos.
 */
import { siteConfig } from "@/config/site";

export type IntegrationResult = { status: "unavailable"; message: string };

export interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function submitContact(_payload: ContactPayload): Promise<IntegrationResult> {
  // TODO: quando houver endpoint, enviar via POST para siteConfig.integrations.contactFormEndpoint
  void siteConfig.integrations.contactFormEndpoint;
  return {
    status: "unavailable",
    message:
      "Formulário em modo demonstrativo: a integração de envio ainda não está disponível. Sua mensagem NÃO foi enviada. Use o e-mail ou telefone ao lado.",
  };
}

/** Recebe apenas o e-mail. A senha nunca é repassada, armazenada ou registrada. */
export async function signIn(_email: string): Promise<IntegrationResult> {
  // TODO: integrar ao provedor de autenticação do VERDANT CONTROL (siteConfig.integrations.authProvider)
  return {
    status: "unavailable",
    message:
      "A autenticação da plataforma ainda não está disponível. Nenhum acesso foi realizado e nenhuma credencial foi enviada ou armazenada.",
  };
}

export async function requestPasswordReset(_email: string): Promise<IntegrationResult> {
  return {
    status: "unavailable",
    message: "A recuperação de senha será habilitada junto com a autenticação da plataforma.",
  };
}
