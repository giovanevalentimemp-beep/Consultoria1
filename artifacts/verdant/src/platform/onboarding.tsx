import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetControlMeQueryKey, useCreateControlCompany, type ControlMe } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Logo, btnClass } from "@/components/site/primitives";
import { inputCls } from "@/platform/ui";

export function Onboarding({ me }: { me: ControlMe }) {
  const queryClient = useQueryClient();
  const createCompany = useCreateControlCompany();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setError("Informe o nome da empresa.");
      return;
    }
    setError(null);
    createCompany.mutate(
      { data: { name: cleanName } },
      {
        onSuccess: async (company) => {
          localStorage.setItem("vd.company", company.id);
          await queryClient.invalidateQueries({ queryKey: getGetControlMeQueryKey() });
        },
        onError: (cause) => setError(cause instanceof Error ? cause.message : "Não foi possível cadastrar a empresa."),
      },
    );
  };

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#F5F9F6] px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-[#194D36]/10 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(25,77,54,.35)] sm:p-9">
        <Logo />
        {me.platformAdmin ? (
          <>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-[#39845B]">Primeiro acesso</p>
            <h1 className="mt-2 text-2xl font-bold text-[#194D36]">Cadastre a empresa</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#58645D]">
              O cadastro será salvo na plataforma e sua conta receberá acesso de administração.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label htmlFor="onboarding-company" className="block text-sm font-semibold text-[#194D36]">
                Nome da empresa
              </label>
              <input
                id="onboarding-company"
                className={inputCls}
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={200}
                required
                autoFocus
                data-testid="input-onboarding-company"
              />
              {error && <p role="alert" className="rounded-lg bg-[#FBE7E4] px-3 py-2 text-sm text-[#7E2A22]">{error}</p>}
              <button
                type="submit"
                disabled={createCompany.isPending}
                className={btnClass("primary", "w-full disabled:opacity-60")}
                data-testid="button-create-company"
              >
                {createCompany.isPending ? "Salvando..." : "Cadastrar empresa"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-8 text-2xl font-bold text-[#194D36]">Acesso ainda não vinculado</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#58645D]">
              Sua conta autenticou com sucesso, mas ainda não pertence a uma empresa. Peça ao administrador da plataforma para cadastrar ou vincular seu acesso.
            </p>
          </>
        )}
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-[#39845B] underline underline-offset-4">
          Voltar ao site institucional
        </Link>
      </section>
    </main>
  );
}
