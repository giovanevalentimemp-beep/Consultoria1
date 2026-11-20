import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { ObjectStorageService,objectStorageClient } from "../lib/objectStorage";
import { CompleteControlUploadBody,RequestControlUploadBody,UpdateControlDocumentBody,ValidateControlDocumentBody,ListControlDocumentsResponse,CompleteControlUploadResponse,UpdateControlDocumentResponse,AnalyzeControlDocumentResponse,ValidateControlDocumentResponse } from "@workspace/api-zod";
import { access,allowed,audit,pool,row,visible,validateUnit,documentById,cleanDate,uuid,fail } from "./core";

export const storage=new ObjectStorageService();
const router:IRouter=Router();
const types=new Set(["application/pdf","image/png","image/jpeg","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/csv","application/zip","application/x-zip-compressed"]);
const publicDoc=(d:Record<string,any>)=>{const {object_path,...safe}=d;return row(safe);};
router.post("/:companyId/uploads",async(req,res)=>{
  const a=await access(req);allowed(a,"documents",true);const d=RequestControlUploadBody.parse(req.body);
  if(!types.has(d.contentType)) fail(400,"Formato permitido: PDF, PNG, JPEG, XLSX, CSV ou ZIP.");
  await validateUnit(a,d.unitId??null);
  if(!process.env.PRIVATE_OBJECT_DIR) fail(503,"Armazenamento privado não configurado neste ambiente. O envio de arquivos está indisponível.");
  const uploadUrl=await storage.getObjectEntityUploadURL();
  const objectPath=storage.normalizeObjectEntityPath(uploadUrl);
  const r=await pool.query("INSERT INTO vc_uploads(company_id,user_id,object_path,filename,content_type,size,unit_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",[a.companyId,a.userId,objectPath,d.filename,d.contentType,d.size,d.unitId??null]);
  res.status(201).json({uploadId:r.rows[0].id,uploadUrl});
});
router.get("/:companyId/documents",async(req,res)=>{
  const a=await access(req);allowed(a,"documents");
  const r=await pool.query("SELECT * FROM vc_documents WHERE company_id=$1 ORDER BY created_at DESC",[a.companyId]);
  res.json(ListControlDocumentsResponse.parse(r.rows.filter(d=>visible(a,d.unit_id)).map(publicDoc)));
});
router.post("/:companyId/documents",async(req,res)=>{
  const a=await access(req);allowed(a,"documents",true);
  const d=CompleteControlUploadBody.parse(req.body);await validateUnit(a,d.unitId??null);
  const id=randomUUID();const client=await pool.connect();let finalFile:ReturnType<typeof objectStorageClient.bucket>["file"] extends (...args:any[])=>infer T ? T : never;
  try{
    await client.query("BEGIN");
    const t=await client.query("SELECT * FROM vc_uploads WHERE id=$1 AND company_id=$2 AND user_id=$3 FOR UPDATE",[uuid.parse(d.uploadId),a.companyId,a.userId]);
    const ticket=t.rows[0];
    if(!ticket||ticket.status!=="pending")fail(409,"Envio inexistente ou já utilizado.");
    if(Date.now()-new Date(ticket.created_at).getTime()>30*60*1000)fail(410,"Envio expirado. Envie o arquivo novamente.");
    if(ticket.unit_id!==(d.unitId??null))fail(400,"Unidade diferente da informada no envio.");
    const source=await storage.getObjectEntityFile(ticket.object_path);
    const [meta]=await source.getMetadata();
    if(Number(meta.size)!==Number(ticket.size)) fail(400,"O tamanho do arquivo não corresponde ao envio autorizado.");
    const pinned=source.bucket.file(source.name,{generation:meta.generation});
    const [bytes]=await pinned.download();
    if(bytes.length>20*1024*1024) fail(400,"O arquivo excede 20 MB.");
    const detected=await fileTypeFromBuffer(bytes);
    const actual=detected?.mime??(ticket.content_type==="text/csv"&&!bytes.includes(0)?"text/csv":null);
    const expected=ticket.content_type==="application/x-zip-compressed"?"application/zip":ticket.content_type;
    if(actual!==expected)fail(400,"Conteúdo do arquivo incompatível com o formato informado.");
    let previous:any=null;
    if(d.replacesId) {
      previous=await documentById(a,d.replacesId,true);
      if(previous.unit_id!==(d.unitId??null))fail(400,"Uma versão deve permanecer na mesma unidade.");
      const latest=await client.query("SELECT id FROM vc_documents WHERE previous_id=$1",[previous.id]);
      if(latest.rowCount)fail(409,"Este documento já possui uma versão posterior.");
    }
    const path=`/objects/documents/${a.companyId}/${id}`;
    const dir=storage.getPrivateObjectDir().replace(/^\/|\/$/g,"");const slash=dir.indexOf("/");
    finalFile=objectStorageClient.bucket(dir.slice(0,slash)).file(`${dir.slice(slash+1)}/documents/${a.companyId}/${id}`);
    await finalFile.save(bytes,{resumable:false,preconditionOpts:{ifGenerationMatch:0},metadata:{contentType:actual!,contentDisposition:`attachment; filename*=UTF-8''${encodeURIComponent(ticket.filename)}`,cacheControl:"private, no-store"}});
    const r=await client.query(`INSERT INTO vc_documents(id,company_id,unit_id,name,category,number,responsible,issued_at,expires_at,notes,filename,object_path,content_type,size,version,previous_id)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,[id,a.companyId,d.unitId??null,d.name,d.category,d.number??"",d.responsible??"",cleanDate(d.issuedAt),cleanDate(d.expiresAt),d.notes??"",ticket.filename,path,actual,bytes.length,(previous?.version??0)+1,previous?.id??null]);
    await client.query("UPDATE vc_uploads SET status='completed' WHERE id=$1",[ticket.id]);await client.query("COMMIT");
    await source.delete({ignoreNotFound:true}).catch(()=>{});
    await audit(a,"Armazenou documento",d.name,d.unitId??null,"documents");
    res.status(201).json(CompleteControlUploadResponse.parse(publicDoc(r.rows[0])));
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
router.patch("/:companyId/documents/:id",async(req,res)=>{
  const a=await access(req);const doc=await documentById(a,req.params.id as string,true);const d=UpdateControlDocumentBody.parse(req.body);await validateUnit(a,d.unitId??null);
  if(doc.unit_id!==(d.unitId??null))fail(400,"Não é possível mover documentos entre unidades. Envie uma cópia autorizada na unidade correta.");
  const r=await pool.query("UPDATE vc_documents SET name=$3,category=$4,number=$5,responsible=$6,issued_at=$7,expires_at=$8,notes=$9 WHERE id=$1 AND company_id=$2 RETURNING *",[doc.id,a.companyId,d.name,d.category,d.number??"",d.responsible??"",cleanDate(d.issuedAt),cleanDate(d.expiresAt),d.notes??""]);
  await audit(a,"Atualizou documento",d.name,doc.unit_id,"documents");res.json(UpdateControlDocumentResponse.parse(publicDoc(r.rows[0])));
});
router.get("/:companyId/documents/:id/download",async(req,res)=>{
  const a=await access(req);const doc=await documentById(a,req.params.id as string);
  const file=await storage.getObjectEntityFile(doc.object_path);
  const response=await fetch("http://127.0.0.1:1106/object-storage/signed-object-url",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({bucket_name:file.bucket.name,object_name:file.name,method:"GET",expires_at:new Date(Date.now()+60_000).toISOString()})});
  if(!response.ok)fail(503,"Não foi possível gerar o link de download.");
  const data=await response.json() as {signed_url:string};if(!data.signed_url)fail(503,"Link temporário indisponível.");
  await audit(a,"Acessou arquivo",doc.name,doc.unit_id,"documents");res.json({url:data.signed_url});
});
router.post("/:companyId/documents/:id/analyze",async(req,res)=>{
  const a=await access(req);const doc=await documentById(a,req.params.id as string,true);allowed(a,"conditions",true);
  if(doc.content_type!=="application/pdf")fail(400,"A inteligência documental aceita licenças em PDF.");
  if(doc.status==="Validado")fail(409,"Envie uma nova versão para reanalisar um documento já validado.");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const locked=await client.query("SELECT status FROM vc_documents WHERE id=$1 FOR UPDATE",[doc.id]);
    if(locked.rows[0].status==="Processando")fail(409,"O documento já está na fila.");
    const r=await client.query("UPDATE vc_documents SET status='Processando',error=null WHERE id=$1 RETURNING *",[doc.id]);
    await client.query("INSERT INTO vc_jobs(company_id,kind,entity_id) VALUES($1,'analysis',$2)",[a.companyId,doc.id]);await client.query("COMMIT");
    await audit(a,"Solicitou leitura por IA",doc.name,doc.unit_id,"documents");res.status(202).json(AnalyzeControlDocumentResponse.parse(publicDoc(r.rows[0])));
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
router.post("/:companyId/documents/:id/validate",async(req,res)=>{
  const a=await access(req);const doc=await documentById(a,req.params.id as string,true);allowed(a,"conditions",true);
  const d=ValidateControlDocumentBody.parse(req.body);if(d.conditions.length>500)fail(400,"Máximo de 500 condicionantes por validação.");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    const lock=await client.query("SELECT * FROM vc_documents WHERE id=$1 FOR UPDATE",[doc.id]);const current=lock.rows[0];
    if(current.status!=="Aguardando validação")fail(409,"A análise não está aguardando validação.");
    if(d.metadata?.unitId && d.metadata.unitId!==doc.unit_id)fail(400,"Unidade não pode ser alterada na validação.");
    const accept=d.decision==="accept";
    const draft=await client.query("SELECT * FROM vc_records WHERE document_id=$1 AND data->>'generatedByAI'='true' AND NOT archived ORDER BY (data->>'sourceIndex')::int",[doc.id]);
    for(let i=0;i<Math.max(draft.rows.length,d.conditions.length);i++){
      const c=d.conditions[i];const old=draft.rows[i];
      if(!accept||!c){if(old)await client.query("UPDATE vc_records SET status='Rejeitada',archived=true,updated_at=now() WHERE id=$1",[old.id]);continue;}
      const data=JSON.stringify({generatedByAI:true,sourceIndex:i,source:c.source,page:c.page,frequency:c.frequency??"",evidence:c.evidence??"",validatedBy:a.userId,validatedAt:new Date().toISOString()});
      const args=[c.text.slice(0,300),c.text,cleanDate(c.dueDate),data,d.metadata?.responsible??doc.responsible];
      if(old)await client.query("UPDATE vc_records SET title=$2,description=$3,due_date=$4,data=$5,responsible=$6,status='Aberta',updated_at=now() WHERE id=$1",[old.id,...args]);
      else await client.query("INSERT INTO vc_records(company_id,document_id,unit_id,created_by,kind,status,title,description,due_date,data,responsible) VALUES($1,$2,$3,$4,'condition','Aberta',$5,$6,$7,$8,$9)",[a.companyId,doc.id,doc.unit_id,a.userId,...args]);
    }
    const metadata=d.metadata??{};
    const r=await client.query("UPDATE vc_documents SET status=$2,name=$3,category=$4,number=$5,responsible=$6,issued_at=$7,expires_at=$8 WHERE id=$1 RETURNING *",[doc.id,accept?"Validado":"Rejeitado",metadata.name??doc.name,metadata.category??doc.category,metadata.number??doc.number,metadata.responsible??doc.responsible,cleanDate(metadata.issuedAt??doc.issued_at),cleanDate(metadata.expiresAt??doc.expires_at)]);
    await client.query("COMMIT");await audit(a,accept?"Validou extração documental":"Rejeitou extração documental",doc.name,doc.unit_id,"documents");
    res.json(ValidateControlDocumentResponse.parse(publicDoc(r.rows[0])));
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
export default router;
