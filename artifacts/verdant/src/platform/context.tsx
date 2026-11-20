import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useGetControlMe, useListControlRecords, type ControlCompany, type ControlMe, type ControlRecord } from "@workspace/api-client-react";
import { Onboarding } from "@/platform/onboarding";
import { ErrorState, ShellSkeleton } from "@/platform/ui";

interface Ctx { me: ControlMe; company: ControlCompany; companyId: string; setCompanyId: (id: string) => void; unitId: string | null; setUnitId: (id: string | null) => void; units: ControlRecord[] }
const PlatformCtx = createContext<Ctx | null>(null);
export const usePlatform = () => { const c = useContext(PlatformCtx); if (!c) throw new Error("PlatformProvider ausente"); return c; };

export function invalidateCompany(qc: QueryClient, companyId: string) {
  return qc.invalidateQueries({ predicate: (q) => String(q.queryKey[0] ?? "").startsWith(`/api/control/${companyId}/`) });
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Não foi possível concluir a operação.");

function UnitLoader({ companyId, children }: { companyId: string; children: (units: ControlRecord[]) => ReactNode }) {
  const { data } = useListControlRecords(companyId, { kind: "unit" });
  return <>{children((data ?? []).filter((u) => u.status !== "archived"))}</>;
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const me = useGetControlMe();
  const [companyId, setCid] = useState<string | null>(() => localStorage.getItem("vd.company"));
  const [unitId, setUnit] = useState<string | null>(null);
  const companies = me.data?.companies ?? [];
  const company = useMemo(() => companies.find((c) => c.id === companyId) ?? companies[0], [companies, companyId]);

  useEffect(() => { if (company && company.id !== companyId) setCid(company.id); }, [company, companyId]);

  const setCompanyId = (id: string) => {
    if (id === companyId) return;
    localStorage.setItem("vd.company", id);
    setUnit(null);
    qc.removeQueries({ predicate: (q) => String(q.queryKey[0] ?? "").startsWith("/api/control/") && q.queryKey[0] !== "/api/control/me" });
    setCid(id);
  };

  if (me.isLoading) return <ShellSkeleton />;
  if (me.isError || !me.data) return <div className="min-h-[100dvh] grid place-items-center p-6 bg-[#F5F9F6]"><ErrorState error={me.error} onRetry={() => me.refetch()} /></div>;
  if (!company) return <Onboarding me={me.data} />;

  return (
    <UnitLoader companyId={company.id}>
      {(units) => (
        <PlatformCtx.Provider value={{ me: me.data!, company, companyId: company.id, setCompanyId, unitId, setUnitId: setUnit, units }}>
          {children}
        </PlatformCtx.Provider>
      )}
    </UnitLoader>
  );
}
