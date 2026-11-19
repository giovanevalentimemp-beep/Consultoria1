import { ReplitConnectors } from "@replit/connectors-sdk";
import { access,allowed,pool,fail,audit,uuid,recordById,documentById,visible,row } from "./core";
import { Router,type IRouter } from "express";
import { SaveControlAlertBody,SaveControlAlertResponse,ListControlAlertsResponse,ListControlNotificationsResponse } from "@workspace/api-zod";
import { randomUUID } from "node:crypto";

export const connectors=new ReplitConnectors();
export async function verifiedSender(sender:string) {
  if(!sender) return false;
  const response=await connectors.proxy("resend","/domains",{method:"GET"});
  if(!response.ok)fail(503,"Não foi possível verificar os domínios do Resend.");
  const data=await response.json() as {data?:{name:string;status:string}[]};
  return !!data.data?.some(d=>d.status==="verified"&&sender.split("@")[1]?.toLowerCase()===d.name.toLowerCase());
}
export async function alertTarget(a:Awaited<ReturnType<typeof access>>,alert:Record<string,any>) {
  return alert.target_type==="document"?await documentById(a,alert.target_id):await recordById(a,alert.target_id);
}
export async function enqueueNotification(alert:Record<string,any>,target:Record<string,any>,key:string,test=false) {
  const due=String(target.expires_at??target.due_date??"").slice(0,10);
  const title=target.name??target.title;
  for(const recipient of alert.recipients) {
    const result=await pool.query(`INSERT INTO vc_notifications(company_id,alert_id,unit_id,target_title,recipient,cc,subject,body,idempotency_key)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(idempotency_key) DO NOTHING RETURNING id`,
      [alert.company_id,alert.id,target.unit_id,title,recipient,JSON.stringify(alert.cc),`${test?"[TESTE] ":""}${alert.subject||`VERDANT CONTROL — ${title}`}`,`${test?"Este é um envio de teste solicitado na plataforma.\n\n":""}${alert.message||"Um prazo ambiental requer sua atenção."}\n\nRegistro: ${title}\nPrazo: ${due||"não informado"}\nResponsável: ${alert.responsible||target.responsible||"não informado"}\n\nConsulte os documentos e valide as informações na plataforma.`,`${key}:${recipient}`]);
    if(result.rows[0])await pool.query("INSERT INTO vc_jobs(company_id,kind,entity_id) VALUES($1,'email',$2)",[alert.company_id,result.rows[0].id]);
  }
}
export async function sendNotification(id:string,companyId:string) {
  const result=await pool.query("SELECT n.*,c.sender FROM vc_notifications n JOIN vc_companies c ON c.id=n.company_id WHERE n.id=$1 AND n.company_id=$2",[id,companyId]);
  const n=result.rows[0];if(!n||n.status==="sent")return;
  if(Date.now()-new Date(n.created_at).getTime()>23*60*60*1000)fail(422,"Janela segura de reenvio expirada; confira o provedor antes de tentar um novo envio.");
  if(!await verifiedSender(n.sender))fail(422,"Configure um remetente de domínio verificado no Resend.");
  const response=await connectors.proxy("resend","/emails",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":n.idempotency_key},body:JSON.stringify({from:n.sender,to:[n.recipient],...(n.cc?.length?{cc:n.cc}:{}),subject:n.subject,text:n.body})});
  if(!response.ok)fail(response.status===429?429:502,`Resend não aceitou o envio (HTTP ${response.status}).`);
  const data=await response.json() as {id?:string};if(!data.id)fail(502,"O Resend não confirmou o identificador do envio.");
  await pool.query("UPDATE vc_notifications SET status='sent',provider_id=$2,sent_at=now(),error=null WHERE id=$1",[id,data.id]);
}
const router:IRouter=Router();
router.get("/:companyId/alerts",async(req,res)=>{
  const a=await access(req);allowed(a,"documents");
  const all=await pool.query("SELECT * FROM vc_alerts WHERE company_id=$1 ORDER BY created_at DESC",[a.companyId]);
  const visibleAlerts=[];for(const alert of all.rows){try{await alertTarget(a,alert);visibleAlerts.push(row(alert));}catch(e){if((e as any).status!==403&&(e as any).status!==404)throw e;}}
  res.json(ListControlAlertsResponse.parse(visibleAlerts));
});
router.post("/:companyId/alerts",async(req,res)=>{
  const a=await access(req);const d=SaveControlAlertBody.parse(req.body);allowed(a,d.targetType==="document"?"documents":"obligations",true);
  const target=await alertTarget(a,{target_type:d.targetType,target_id:d.targetId});
  if(!target.expires_at&&!target.due_date)fail(400,"Informe o vencimento do documento ou registro antes de configurar alertas.");
  if(d.id){const old=await pool.query("SELECT * FROM vc_alerts WHERE id=$1 AND company_id=$2",[uuid.parse(d.id),a.companyId]);if(!old.rows[0])fail(404,"Alerta não encontrado.");await alertTarget(a,old.rows[0]);}
  const r=await pool.query(`INSERT INTO vc_alerts(id,company_id,target_type,target_id,offsets,recipients,cc,frequency,responsible,subject,message,enabled,created_by)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    ON CONFLICT(id) DO UPDATE SET offsets=EXCLUDED.offsets,recipients=EXCLUDED.recipients,cc=EXCLUDED.cc,frequency=EXCLUDED.frequency,responsible=EXCLUDED.responsible,subject=EXCLUDED.subject,message=EXCLUDED.message,enabled=EXCLUDED.enabled WHERE vc_alerts.company_id=EXCLUDED.company_id AND vc_alerts.target_id=EXCLUDED.target_id AND vc_alerts.target_type=EXCLUDED.target_type RETURNING *`,
    [d.id??randomUUID(),a.companyId,d.targetType,d.targetId,JSON.stringify([...new Set(d.offsets)]),JSON.stringify([...new Set(d.recipients.map(x=>x.toLowerCase()))]),JSON.stringify(d.cc??[]),d.frequency??"once",d.responsible??"",d.subject??"",d.message??"",d.enabled??true,a.userId]);
  if(!r.rows[0])fail(409,"Não é possível alterar o alvo de um alerta existente.");
  await audit(a,"Configurou alerta",target.name??target.title,target.unit_id,"documents");
  res.status(201).json(SaveControlAlertResponse.parse(row(r.rows[0])));
});
router.post("/:companyId/alerts/:id/test",async(req,res)=>{
  const a=await access(req);allowed(a,"documents",true);const r=await pool.query("SELECT * FROM vc_alerts WHERE id=$1 AND company_id=$2",[uuid.parse(req.params.id),a.companyId]);if(!r.rows[0])fail(404,"Alerta não encontrado.");
  const target=await alertTarget(a,r.rows[0]);
  const company=await pool.query("SELECT sender FROM vc_companies WHERE id=$1",[a.companyId]);if(!await verifiedSender(company.rows[0].sender))fail(422,"Configure um remetente de domínio verificado no Resend antes do envio.");
  await enqueueNotification(r.rows[0],target,`test:${randomUUID()}`,true);
  await audit(a,"Solicitou envio real de teste",target.name??target.title,target.unit_id,"documents");res.status(202).json({message:"Envio real enfileirado. Confira a confirmação ou falha no histórico."});
});
router.get("/:companyId/notifications",async(req,res)=>{
  const a=await access(req);allowed(a,"documents");
  const r=await pool.query("SELECT * FROM vc_notifications WHERE company_id=$1 ORDER BY created_at DESC LIMIT 500",[a.companyId]);
  res.json(ListControlNotificationsResponse.parse(r.rows.filter(n=>visible(a,n.unit_id)).map(row)));
});
export default router;
