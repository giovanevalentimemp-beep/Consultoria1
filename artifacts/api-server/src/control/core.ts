import { getAuth, clerkClient } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { pool } from "@workspace/db";
import { z } from "zod";

export { pool };
export type Row = Record<string, any>;
export type Access = { userId: string; email: string; companyId: string; role: string; unitIds: string[]; modules: string[]; platformAdmin: boolean };
export const uuid = z.string().uuid();
export const kinds = ["unit","license","condition","obligation","waste","mtr","cdf","supplier","ibama","tcfa","rapp","monitoring","audit","action","task","requirement"];
export const moduleFor = (kind: string) => ({unit:"settings",license:"licenses",condition:"conditions",obligation:"obligations",requirement:"obligations",waste:"waste",mtr:"waste",cdf:"waste",supplier:"waste",ibama:"ibama",tcfa:"ibama",rapp:"ibama",monitoring:"monitoring",audit:"audits",action:"actions",task:"actions"}[kind] ?? kind);
export function fail(status: number, message: string): never { throw Object.assign(new Error(message), { status }); }
export function row(r: Row): Row {
  return Object.fromEntries(Object.entries(r).map(([k,v]) => [k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), v instanceof Date ? v.toISOString() : v]));
}
export const rows = (items: Row[]) => items.map(row);
export function cleanDate(value: unknown): string | null {
  if(value == null || value === "") return null;
  const parsed = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(value);
  if(!parsed.success || !Number.isFinite(Date.parse(parsed.data)) || new Date(parsed.data).toISOString().slice(0,10)!==parsed.data) fail(400,"Data inválida. Use AAAA-MM-DD.");
  return parsed.data;
}
export function allowed(a: Access, module: string, write = false) {
  if(a.platformAdmin || a.role === "company_admin") return;
  if(a.modules.length && !a.modules.includes(module)) fail(403,"Você não possui permissão para este módulo.");
  if(write && a.role === "collaborator" && !["documents","actions"].includes(module)) fail(403,"Seu perfil permite apenas consultar este módulo.");
  if(module === "settings" && write) fail(403,"Somente administradores podem alterar configurações.");
}
export function visible(a: Access, unitId: string | null) {
  return !a.unitIds.length || (!!unitId && a.unitIds.includes(unitId));
}
export function checkUnit(a: Access, unitId: string | null) {
  if(!visible(a,unitId)) fail(403,"Unidade não autorizada.");
}
export async function audit(a: Access, action: string, entity: string, unitId: string | null = null, module="settings") {
  await pool.query("INSERT INTO vc_activity(company_id,actor,action,entity,unit_id,module) VALUES($1,$2,$3,$4,$5,$6)",[a.companyId,a.email,action,entity,unitId,module]);
}
export async function identity(req: Request) {
  const userId = getAuth(req).userId;
  if(!userId) fail(401,"Entre na plataforma para continuar.");
  const existing = await pool.query("SELECT * FROM vc_users WHERE id=$1",[userId]);
  if(existing.rows[0]) return existing.rows[0] as Row;
  const u=await clerkClient.users.getUser(userId);
  const email=u.emailAddresses.find(e=>e.id===u.primaryEmailAddressId && e.verification?.status==="verified")?.emailAddress.toLowerCase();
  if(!email) fail(403,"Confirme seu e-mail antes de acessar.");
  const result = await pool.query("INSERT INTO vc_users(id,email,platform_admin) VALUES($1,$2,false) ON CONFLICT(id) DO UPDATE SET email=EXCLUDED.email RETURNING *",[userId,email]);
  return result.rows[0] as Row;
}
export async function access(req: Request): Promise<Access> {
  const user=await identity(req);
  const companyId=uuid.parse(req.params.companyId);
  const c=await pool.query("SELECT id FROM vc_companies WHERE id=$1",[companyId]);
  if(!c.rows[0]) fail(404,"Empresa não encontrada.");
  const m=await pool.query("SELECT * FROM vc_members WHERE company_id=$1 AND email=$2 AND enabled=true",[companyId,user.email]);
  if(!m.rows[0] && !user.platform_admin) fail(403,"Empresa não autorizada.");
  return {userId:user.id,email:user.email,platformAdmin:user.platform_admin,companyId,role:m.rows[0]?.role??"platform_admin",unitIds:m.rows[0]?.unit_ids??[],modules:m.rows[0]?.modules??[]};
}
export async function recordById(a: Access,id: string,write=false): Promise<Row> {
  uuid.parse(id);
  const {rows:r}=await pool.query("SELECT r.*, COALESCE((SELECT jsonb_agg(to_id) FROM vc_links WHERE from_id=r.id),'[]') AS related_ids FROM vc_records r WHERE r.id=$1 AND r.company_id=$2 AND NOT r.archived",[id,a.companyId]);
  if(!r[0]) fail(404,"Registro não encontrado.");
  allowed(a,moduleFor(r[0].kind),write);
  checkUnit(a,r[0].kind==="unit"?r[0].id:r[0].unit_id);
  return r[0];
}
export async function documentById(a: Access,id:string,write=false): Promise<Row> {
  uuid.parse(id); allowed(a,"documents",write);
  const {rows:r}=await pool.query("SELECT * FROM vc_documents WHERE id=$1 AND company_id=$2",[id,a.companyId]);
  if(!r[0]) fail(404,"Documento não encontrado.");
  checkUnit(a,r[0].unit_id); return r[0];
}
export async function validateUnit(a:Access,id:string|null) {
  checkUnit(a,id);
  if(id) {
    const u=await pool.query("SELECT id FROM vc_records WHERE id=$1 AND company_id=$2 AND kind='unit' AND NOT archived",[uuid.parse(id),a.companyId]);
    if(!u.rows[0]) fail(400,"Unidade inválida para esta empresa.");
  }
}
export async function visibleRecords(a:Access) {
  const r=await pool.query("SELECT r.*, COALESCE((SELECT jsonb_agg(to_id) FROM vc_links WHERE from_id=r.id),'[]') AS related_ids FROM vc_records r WHERE company_id=$1 AND NOT archived ORDER BY created_at DESC",[a.companyId]);
  return r.rows.filter(r=>visible(a,r.kind==="unit"?r.id:r.unit_id) && (a.platformAdmin||a.role==="company_admin"||!a.modules.length||a.modules.includes(moduleFor(r.kind))));
}
export function controlGuard(req:Request,res:Response,next:NextFunction) {
  if(!getAuth(req).userId){res.status(401).json({error:"Entre na plataforma para continuar."});return;}
  if(!["GET","HEAD","OPTIONS"].includes(req.method)) {
    const origin=req.get("origin");
    const host=req.get("x-forwarded-host")?.split(",")[0].trim()||req.get("host");
    if(origin && new URL(origin).host!==host){res.status(403).json({error:"Origem não autorizada."});return;}
  }
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff"); next();
}
