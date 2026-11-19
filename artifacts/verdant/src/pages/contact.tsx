import { useState, type ReactNode } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, MessageCircle, AlertTriangle, Loader2, Send } from "lucide-react";
import { PageHero, Reveal, btnClass, useSeo } from "@/components/site/primitives";
import { siteConfig, fullAddress } from "@/config/site";
import { submitContact } from "@/services/integrations";
import { useWhatsApp } from "@/layouts/SiteLayout";
import { cn } from "@/lib/utils";

const subjects: Record<string, string> = {
  diagnostico: "Solicitar diagnóstico ambiental",
  orcamento: "Solicitar orçamento",
  demonstracao: "Demonstração do VERDANT CONTROL",
  especialista: "Falar com um especialista",
  outro: "Outro assunto",
};

const schema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo."),
  company: z.string().trim().min(2, "Informe o nome da empresa."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z.string().trim().refine((v) => v.replace(/\D/g, "").length >= 10, "Informe um telefone com DDD."),
  subject: z.string().min(1, "Selecione um assunto."),
  message: z.string().trim().min(20, "Descreva sua necessidade em pelo menos 20 caracteres.").max(2000, "Máximo de 2.000 caracteres."),
});
type FormValues = z.infer<typeof schema>;

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#194D36]">{label} <span className="text-[#39845B]" aria-hidden>*</span></label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
}
const inputCls = (err?: unknown) => cn("w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-[#194D36] placeholder:text-[#58645D]/60 transition focus:outline-none focus:ring-4", err ? "border-red-400 focus:ring-red-100" : "border-[#194D36]/15 focus:border-[#39845B] focus:ring-[#B7DCC3]/50");

export default function ContactPage() {
  useSeo("Contato", "Fale com a VERDANT AMBIENTAL: solicite diagnóstico, orçamento ou demonstração do VERDANT CONTROL.");
  const params = new URLSearchParams(useSearch());
  const initialSubject = subjects[params.get("assunto") ?? ""] ? (params.get("assunto") as string) : "";
  const [notice, setNotice] = useState<string | null>(null);
  const openWhats = useWhatsApp();
  const c = siteConfig.contact;
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", email: "", phone: "", subject: initialSubject, message: "" },
  });
  const onSubmit = async (values: FormValues) => {
    const res = await submitContact(values);
    setNotice(res.message);
  };
  const err = (k: keyof FormValues) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <>
      <PageHero eyebrow="Contato" title={<>Vamos conversar sobre a <span className="font-display italic font-normal text-[#39845B]">sua operação.</span></>} intro="Conte-nos o contexto e o que precisa ser resolvido. Responderemos com um próximo passo claro." />
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="mb-8 flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900" data-testid="text-form-demo-mode">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p><strong>Formulário em modo demonstrativo.</strong> A integração de envio ainda não está configurada: as mensagens não são transmitidas. Para contato imediato, use o telefone ou e-mail ao lado.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2" aria-label="Formulário de contato">
              <Field id="name" label="Nome" error={errors.name?.message}><input id="name" autoComplete="name" className={inputCls(errors.name)} {...register("name")} {...err("name")} data-testid="input-name" /></Field>
              <Field id="company" label="Empresa" error={errors.company?.message}><input id="company" autoComplete="organization" className={inputCls(errors.company)} {...register("company")} {...err("company")} data-testid="input-company" /></Field>
              <Field id="email" label="E-mail" error={errors.email?.message}><input id="email" type="email" autoComplete="email" className={inputCls(errors.email)} {...register("email")} {...err("email")} data-testid="input-email" /></Field>
              <Field id="phone" label="Telefone" error={errors.phone?.message}>
                <input id="phone" type="tel" autoComplete="tel" placeholder="(11) 00000-0000" className={inputCls(errors.phone)} {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })} {...err("phone")} data-testid="input-phone" />
              </Field>
              <div className="sm:col-span-2"><Field id="subject" label="Assunto" error={errors.subject?.message}>
                <select id="subject" className={inputCls(errors.subject)} {...register("subject")} {...err("subject")} data-testid="select-subject">
                  <option value="">Selecione</option>
                  {Object.entries(subjects).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field></div>
              <div className="sm:col-span-2"><Field id="message" label="Mensagem" error={errors.message?.message}>
                <textarea id="message" rows={6} className={inputCls(errors.message)} placeholder="Ex.: unidade industrial em processo de renovação de LO, com dúvidas sobre condicionantes..." {...register("message")} {...err("message")} data-testid="input-message" />
              </Field></div>
              <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="submit" disabled={isSubmitting} className={btnClass("primary", "disabled:opacity-60")} data-testid="button-submit-contact">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar mensagem
                </button>
                <p className="text-xs text-[#58645D]">Ao enviar, você concorda com a <a href={`${import.meta.env.BASE_URL}politica-de-privacidade`} className="underline">Política de privacidade</a>.</p>
              </div>
              {notice && (
                <div role="status" aria-live="polite" className="sm:col-span-2 flex gap-3 rounded-xl border border-[#194D36]/15 bg-[#F5F9F6] p-5 text-sm text-[#194D36]" data-testid="status-contact-result">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                  <div><p className="font-semibold">Integração indisponível — mensagem não enviada.</p><p className="mt-1 text-[#58645D]">{notice}</p><p className="mt-2"><a className="font-semibold underline" href={`mailto:${c.email}`}>{c.email}</a> · <a className="font-semibold underline" href={`tel:${c.phoneHref}`}>{c.phone}</a></p></div>
                </div>
              )}
            </form>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-[#194D36] p-8 text-white">
              <ul className="space-y-6">
                <li className="flex gap-4"><MapPin className="h-5 w-5 shrink-0 text-[#B7DCC3]" /><div><p className="eyebrow !text-[#B7DCC3]">Endereço</p><p className="mt-1">{fullAddress()}</p></div></li>
                <li className="flex gap-4"><Phone className="h-5 w-5 shrink-0 text-[#B7DCC3]" /><div><p className="eyebrow !text-[#B7DCC3]">Telefone</p><a href={`tel:${c.phoneHref}`} className="mt-1 block hover:underline">{c.phone}</a></div></li>
                <li className="flex gap-4"><Mail className="h-5 w-5 shrink-0 text-[#B7DCC3]" /><div><p className="eyebrow !text-[#B7DCC3]">E-mail</p><a href={`mailto:${c.email}`} className="mt-1 block break-all hover:underline">{c.email}</a></div></li>
                <li className="flex gap-4"><Clock className="h-5 w-5 shrink-0 text-[#B7DCC3]" /><div><p className="eyebrow !text-[#B7DCC3]">Horário de atendimento</p>{c.hours.map((h) => <p key={h} className="mt-1">{h}</p>)}</div></li>
              </ul>
              <button onClick={openWhats} className={btnClass("light", "mt-8 w-full")} data-testid="button-whatsapp-contact"><MessageCircle className="h-4 w-4" />Conversar pelo WhatsApp</button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#194D36]/10">
              <iframe title="Mapa demonstrativo da localização" loading="lazy" className="h-72 w-full grayscale-[40%]" src={`https://maps.google.com/maps?q=${encodeURIComponent(c.mapEmbedQuery)}&z=15&output=embed`} />
              <p className="bg-[#F5F9F6] px-4 py-2 text-xs text-[#58645D]">Mapa demonstrativo da localização fictícia.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
