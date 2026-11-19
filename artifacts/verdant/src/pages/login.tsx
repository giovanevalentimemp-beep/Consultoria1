import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, ArrowLeft, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { Logo, btnClass, useSeo } from "@/components/site/primitives";
import { siteConfig } from "@/config/site";
import { signIn, requestPasswordReset } from "@/services/integrations";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  useSeo(`Acessar ${siteConfig.product.name}`, "Área de acesso à plataforma VERDANT CONTROL. Autenticação em desenvolvimento.");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (password.length < 1) next.password = "Informe sua senha.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const res = await signIn(email); // a senha não é repassada
    setPassword(""); // descarta a senha da memória do componente
    setBusy(false);
    setNotice(res.message);
  };
  const onForgot = async () => {
    const res = await requestPasswordReset(email);
    setNotice(res.message);
  };
  const inputCls = (err?: string) => cn("w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-[#194D36] focus:outline-none focus:ring-4", err ? "border-red-400 focus:ring-red-100" : "border-[#194D36]/15 focus:border-[#39845B] focus:ring-[#B7DCC3]/50");

  return (
    <div className="grain relative min-h-[100dvh] overflow-hidden bg-[#F5F9F6]">
      <div className="absolute inset-0 contour" aria-hidden />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#58645D] hover:text-[#194D36]" data-testid="link-back-site"><ArrowLeft className="h-4 w-4" />Voltar ao site</Link>
        <div className="mt-8 flex justify-center"><Logo /></div>
        <div className="mt-8 rounded-3xl border border-[#194D36]/8 bg-white p-8 shadow-[0_30px_60px_-40px_rgba(25,77,54,.5)]">
          <p className="text-center text-xs font-extrabold tracking-[0.3em] text-[#39845B]">{siteConfig.product.name}</p>
          <h1 className="mt-2 text-center text-2xl font-bold">Acesse a plataforma</h1>
          <div className="mt-6 flex gap-2.5 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-900" data-testid="text-login-demo">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>Área em desenvolvimento. A autenticação ainda não está disponível e nenhuma credencial é enviada ou armazenada.</p>
          </div>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#194D36]">E-mail</label>
              <input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "login-email-error" : undefined} className={inputCls(errors.email)} data-testid="input-login-email" />
              {errors.email && <p id="login-email-error" role="alert" className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-semibold text-[#194D36]">Senha</label>
                <button type="button" onClick={onForgot} className="text-xs font-semibold text-[#39845B] hover:underline" data-testid="button-forgot-password">Esqueci minha senha</button>
              </div>
              <div className="relative">
                <input id="login-password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? "login-password-error" : undefined} className={cn(inputCls(errors.password), "pr-12")} data-testid="input-login-password" />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#58645D] hover:bg-[#F5F9F6] hover:text-[#194D36]" data-testid="button-toggle-password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id="login-password-error" role="alert" className="mt-1.5 text-sm text-red-700">{errors.password}</p>}
            </div>
            <button type="submit" disabled={busy} className={btnClass("primary", "w-full disabled:opacity-60")} data-testid="button-login">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Entrar na plataforma
            </button>
            {notice && <p role="status" aria-live="polite" className="rounded-xl border border-[#194D36]/12 bg-[#F5F9F6] p-3.5 text-sm text-[#194D36]" data-testid="status-login">{notice}</p>}
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-[#58645D]">Ainda não conhece a plataforma? <Link href="/tecnologia" className="font-semibold text-[#194D36] underline underline-offset-4">Conheça o VERDANT CONTROL</Link></p>
      </div>
    </div>
  );
}
