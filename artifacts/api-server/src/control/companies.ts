import { Router,type IRouter } from "express";
import { CreateControlCompanyBody,CreateControlCompanyResponse,GetControlMeResponse,UpdateControlCompanyBody,UpdateControlCompanyResponse,SaveControlMemberBody,SaveControlMemberResponse,ListControlMembersResponse,ListControlActivityResponse,UpdateControlIntegrationsBody,GetControlIntegrationsResponse } from "@workspace/api-zod";
import { pool,identity,access,allowed,audit,row,rows,fail,uuid,visible,moduleFor } from "./core";
import { verifiedSender } from "./email";

const router:IRouter=Router();
router.get("/me",async(req,res)=>{
  const user=await identity(req);
  const companies=user.platform_admin?await pool.query("SELECT id,name,data,'platform_admin' AS role FROM vc_companies ORDER BY name"):await pool.query("SELECT c.id,c.name,c.data,m.role FROM vc_companies c JOIN vc_members m ON m.company_id=c.id WHERE m.email=$1 AND m.enabled=true ORDER BY c.name",[user.email]);
  res.json(GetControlMeResponse.parse({userId:user.id,email:user.email,platformAdmin:user.platform_admin,companies:companies.rows}));
});
router.post("/companies",async(req,res)=>{
  const u=await identity(req);if(!u.platform_admin)fail(403,"Somente o administrador da plataforma pode cadastrar empresas.");
  const d=CreateControlCompanyBody.parse(req.body);const c=await pool.query("INSERT INTO vc_companies(name,data) VALUES($1,$2) RETURNING id,name,data",[d.name,JSON.stringify(d.data??{})]);
  await pool.query("INSERT INTO vc_members(company_id,email,role) VALUES($1,$2,'company_admin') ON CONFLICT DO NOTHING",[c.rows[0].id,u.email]);
  res.status(201).json(CreateControlCompanyResponse.parse({...c.rows[0],role:"platform_admin"}));
});
router.patch("/:companyId/company",async(req,res)=>{
  const a=await access(req);allowed(a,"settings",true);const d=UpdateControlCompanyBody.parse(req.body);
  const r=await pool.query("UPDATE vc_companies SET name=$2,data=$3 WHERE id=$1 RETURNING id,name,data",[a.companyId,d.name,JSON.stringify(d.data??{})]);
  await audit(a,"Atualizou empresa",d.name);res.json(UpdateControlCompanyResponse.parse({...r.rows[0],role:a.role}));
});
router.get("/:companyId/members",async(req,res)=>{
  const a=await access(req);allowed(a,"settings",true);
  const r=await pool.query("SELECT * FROM vc_members WHERE company_id=$1 ORDER BY email",[a.companyId]);res.json(ListControlMembersResponse.parse(rows(r.rows)));
});
router.post("/:companyId/members",async(req,res)=>{
  const a=await access(req);allowed(a,"settings",true);const d=SaveControlMemberBody.parse(req.body);
  const units=[...new Set(d.unitIds)];for(const id of units){const r=await pool.query("SELECT id FROM vc_records WHERE id=$1 AND company_id=$2 AND kind='unit' AND NOT archived",[uuid.parse(id),a.companyId]);if(!r.rowCount)fail(400,"Unidade do usuário não pertence à empresa.");}
  const supported=["documents","licenses","conditions","obligations","waste","ibama","monitoring","audits","actions","settings"];
  const normalized=[...new Set(d.modules.map(m=>moduleFor(m)))];
  if(normalized.some(m=>!supported.includes(m)))fail(400,"Módulo de permissão inválido.");
  const email=d.email.toLowerCase();
  if(email===a.email && (!d.enabled||d.role!=="company_admin"))fail(400,"Não é possível remover a própria administração.");
  const r=await pool.query("INSERT INTO vc_members(company_id,email,role,unit_ids,modules,enabled) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(company_id,email) DO UPDATE SET role=EXCLUDED.role,unit_ids=EXCLUDED.unit_ids,modules=EXCLUDED.modules,enabled=EXCLUDED.enabled RETURNING *",[a.companyId,email,d.role,JSON.stringify(units),JSON.stringify(normalized),d.enabled]);
  await audit(a,d.enabled?"Cadastrou ou atualizou acesso":"Desativou acesso","Membro da empresa");res.status(201).json(SaveControlMemberResponse.parse(row(r.rows[0])));
});
router.get("/:companyId/activity",async(req,res)=>{
  const a=await access(req);const r=await pool.query("SELECT * FROM vc_activity WHERE company_id=$1 ORDER BY created_at DESC LIMIT 500",[a.companyId]);
  res.json(ListControlActivityResponse.parse(rows(r.rows.filter(r=>visible(a,r.unit_id)&&(a.platformAdmin||a.role==="company_admin"||!a.modules.length||a.modules.includes(r.module))))));
});
export async function integrationStatus(companyId:string){
  const c=await pool.query("SELECT sender FROM vc_companies WHERE id=$1",[companyId]);
  const w=await pool.query("SELECT last_run FROM vc_worker_state WHERE key='worker'");
  const sender=c.rows[0].sender;let email=false;let notice="Configure um remetente de domínio verificado no Resend para habilitar o envio.";
  if(sender){try{email=await verifiedSender(sender);notice=email?"Envios aceitos pelo provedor ficam registrados; aceitação não comprova entrega na caixa postal.":"O domínio do remetente ainda não está verificado.";}catch{notice="Não foi possível consultar o Resend. Nenhum envio é simulado.";}}
  return GetControlIntegrationsResponse.parse({storage:!!process.env.PRIVATE_OBJECT_DIR,ai:!!process.env.AI_INTEGRATIONS_OPENAI_API_KEY,email,sender,workerLastRun:w.rows[0]?.last_run?.toISOString()??null,notice});
}
router.get("/:companyId/integrations",async(req,res)=>{const a=await access(req);allowed(a,"settings",true);res.json(await integrationStatus(a.companyId));});
router.patch("/:companyId/integrations",async(req,res)=>{
  const a=await access(req);allowed(a,"settings",true);const d=UpdateControlIntegrationsBody.parse(req.body);
  if(!await verifiedSender(d.sender))fail(422,"O domínio do remetente precisa estar verificado no Resend.");
  await pool.query("UPDATE vc_companies SET sender=$2 WHERE id=$1",[a.companyId,d.sender.toLowerCase()]);
  await audit(a,"Configurou remetente verificado","Resend");res.json(await integrationStatus(a.companyId));
});
export default router;
