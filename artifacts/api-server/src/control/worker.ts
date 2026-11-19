import { pool,visible,moduleFor } from "./core";
import { analyzePDF } from "./intelligence";
import { enqueueNotification,sendNotification } from "./email";
import { logger } from "../lib/logger";

let busy=false;
/** Database-backed queue; timers only wake the worker. Jobs and schedules survive restart. */
export async function scheduleAlerts(now=new Date()) {
  const client=await pool.connect();
  try {
    const lock=await client.query("SELECT pg_try_advisory_lock(814271) AS locked");if(!lock.rows[0].locked)return;
    try {
      const last=await client.query("SELECT last_run FROM vc_worker_state WHERE key='scheduler'");
      if(last.rows[0]?.last_run&&now.getTime()-new Date(last.rows[0].last_run).getTime()<60_000)return;
      const alerts=await client.query("SELECT * FROM vc_alerts WHERE enabled=true");
      const today=now.toLocaleDateString("sv-SE",{timeZone:"America/Sao_Paulo"});const todayMs=Date.parse(today);
      for(const alert of alerts.rows) {
        if(!await alertStillAuthorized(alert))continue;
        const table=alert.target_type==="document"?"vc_documents":"vc_records";
        const r=await client.query(`SELECT * FROM ${table} WHERE id=$1 AND company_id=$2`,[alert.target_id,alert.company_id]);const target=r.rows[0];
        if(!target||target.archived||["Concluída","Concluído","Cancelada","Cancelado","Rejeitado","Rejeitada","Aguardando validação"].includes(target.status))continue;
        const due=String(target.expires_at??target.due_date??"").slice(0,10);if(!due)continue;
        const days=Math.round((Date.parse(due)-todayMs)/86_400_000);
        const reached=(alert.offsets as number[]).filter(n=>days<=n).sort((a,b)=>a-b);if(!reached.length)continue;
        const offset=reached[0];let occurrence=`offset:${offset}`;
        if(alert.frequency==="daily")occurrence=`day:${today}`;
        if(alert.frequency==="weekly")occurrence=`week:${Math.floor((todayMs-Date.parse(due)+Math.max(...alert.offsets)*86_400_000)/(7*86_400_000))}`;
        await enqueueNotification(alert,target,`alert:${alert.id}:due:${due}:${occurrence}`);
      }
      await client.query("INSERT INTO vc_worker_state(key,last_run) VALUES('scheduler',$1) ON CONFLICT(key) DO UPDATE SET last_run=EXCLUDED.last_run",[now]);
    }finally{await client.query("SELECT pg_advisory_unlock(814271)");}
  }finally{client.release();}
}
export async function alertStillAuthorized(alert:Record<string,any>) {
  const u=await pool.query("SELECT * FROM vc_users WHERE id=$1",[alert.created_by]);if(!u.rows[0])return false;
  if(u.rows[0].platform_admin)return true;
  const m=await pool.query("SELECT * FROM vc_members WHERE company_id=$1 AND email=$2 AND enabled=true",[alert.company_id,u.rows[0].email]);if(!m.rows[0])return false;
  const member=m.rows[0];const table=alert.target_type==="document"?"vc_documents":"vc_records";
  const r=await pool.query(`SELECT * FROM ${table} WHERE id=$1 AND company_id=$2`,[alert.target_id,alert.company_id]);const t=r.rows[0];if(!t)return false;
  return visible({unitIds:member.unit_ids} as any,t.unit_id)&&(!member.modules.length||member.modules.includes(alert.target_type==="document"?"documents":moduleFor(t.kind)));
}
export async function workerTick() {
  if(busy)return;busy=true;
  try {
    await scheduleAlerts();
    const claimed=await pool.query(`WITH candidate AS (
      SELECT id FROM vc_jobs WHERE ((status='pending' AND run_at<=now()) OR (status='running' AND lease_until<now())) AND attempts<3
      ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 3)
      UPDATE vc_jobs j SET status='running',attempts=j.attempts+1,lease_until=now()+interval '15 minutes'
      FROM candidate c WHERE j.id=c.id RETURNING j.*`);
    await Promise.all(claimed.rows.map(async job=>{
      try {
        if(job.kind==="analysis")await analyzePDF(job.entity_id,job.company_id);
        else {
          const a=await pool.query("SELECT a.* FROM vc_alerts a JOIN vc_notifications n ON n.alert_id=a.id WHERE n.id=$1 AND n.company_id=$2",[job.entity_id,job.company_id]);
          if(!a.rows[0]||!await alertStillAuthorized(a.rows[0]))throw Object.assign(new Error("Envio cancelado: autor do alerta não possui mais acesso."),{status:403});
          await sendNotification(job.entity_id,job.company_id);
        }
        await pool.query("UPDATE vc_jobs SET status='done',lease_until=null,error=null WHERE id=$1",[job.id]);
      }catch(e){
        const error=(e as Error).message.slice(0,600);const terminal=job.attempts>=3||[400,403,404,410,422].includes((e as any).status);
        await pool.query("UPDATE vc_jobs SET status=$2,error=$3,lease_until=null,run_at=now()+interval '2 minutes' WHERE id=$1",[job.id,terminal?"failed":"pending",error]);
        if(job.kind==="analysis")await pool.query("UPDATE vc_documents SET status=$2,error=$3 WHERE id=$1 AND company_id=$4",[job.entity_id,terminal?"Erro na análise":"Processando",error,job.company_id]);
        else await pool.query("UPDATE vc_notifications SET status=$2,error=$3 WHERE id=$1 AND company_id=$4 AND status<>'sent'",[job.entity_id,terminal?"failed":"queued",error,job.company_id]);
        logger.warn({kind:job.kind,terminal},"Processamento não concluído; estado registrado para consulta");
      }
    }));
    await pool.query("INSERT INTO vc_worker_state(key,last_run) VALUES('worker',now()) ON CONFLICT(key) DO UPDATE SET last_run=EXCLUDED.last_run");
  }catch{logger.error("Worker ambiental indisponível; tarefas permanecem registradas no banco");}
  finally{busy=false;}
}
export function startControlWorker() {
  void workerTick();
  const timer=setInterval(()=>void workerTick(),30_000);
  timer.unref();return timer;
}
