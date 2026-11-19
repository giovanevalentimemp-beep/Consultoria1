import { Router, type IRouter } from "express";
import { CreateControlRecordBody,UpdateControlRecordBody,ListControlRecordsResponse,CreateControlRecordResponse,UpdateControlRecordResponse,ListControlRecordsQueryParams } from "@workspace/api-zod";
import { pool,access,allowed,audit,row,rows,visibleRecords,recordById,documentById,validateUnit,cleanDate,uuid,fail,moduleFor } from "./core";

const router:IRouter=Router();
router.get("/:companyId/records",async(req,res)=>{
  const a=await access(req); const q=ListControlRecordsQueryParams.parse(req.query);
  let result=await visibleRecords(a);
  if(q.kind){allowed(a,moduleFor(q.kind));result=result.filter(r=>r.kind===q.kind);}
  if(q.unitId) result=result.filter(r=>r.unit_id===q.unitId||r.id===q.unitId);
  if(q.search){const s=q.search.toLocaleLowerCase("pt-BR");result=result.filter(r=>`${r.title} ${r.description} ${JSON.stringify(r.data)}`.toLocaleLowerCase("pt-BR").includes(s));}
  res.json(ListControlRecordsResponse.parse(rows(result)));
});
async function prepare(a:Awaited<ReturnType<typeof access>>,data:ReturnType<typeof CreateControlRecordBody.parse>) {
  allowed(a,moduleFor(data.kind),true);
  const unitId=data.unitId??null;
  if(data.kind!=="unit") await validateUnit(a,unitId);
  else {allowed(a,"settings",true);if(unitId) fail(400,"Uma unidade não pode pertencer a outra unidade.");}
  if(data.parentId){const p=await recordById(a,data.parentId);if(unitId!==p.unit_id) fail(400,"Vínculo deve pertencer à mesma unidade.");}
  if(data.documentId){const d=await documentById(a,data.documentId);if(unitId!==d.unit_id)fail(400,"Documento deve pertencer à mesma unidade.");}
  for(const id of data.relatedIds??[])await recordById(a,id);
  const extra=data.data??{};
  if(data.kind==="obligation" && data.status==="Validado" && (!extra.legalBasis||!extra.source)) fail(400,"Informe a fundamentação e a fonte normativa antes de validar a obrigação.");
  if(data.kind==="monitoring" && extra.referenceLimit && !extra.limitSource) fail(400,"Informe a fonte e a versão do limite de referência.");
  return [data.kind,data.title,data.description??"",data.status??"Aberta",unitId,data.responsible??"",cleanDate(data.dueDate),data.parentId??null,data.documentId??null,JSON.stringify(extra)];
}
router.post("/:companyId/records",async(req,res)=>{
  const a=await access(req);const d=CreateControlRecordBody.parse(req.body);const values=await prepare(a,d);
  const client=await pool.connect();
  try {
    await client.query("BEGIN");
    const r=await client.query("INSERT INTO vc_records(company_id,kind,title,description,status,unit_id,responsible,due_date,parent_id,document_id,data,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",[a.companyId,...values,a.userId]);
    for(const id of [...new Set(d.relatedIds??[])])await client.query("INSERT INTO vc_links(from_id,to_id) VALUES($1,$2)",[r.rows[0].id,id]);
    await client.query("COMMIT");
    await audit(a,"Criou registro",d.title,d.unitId??null,moduleFor(d.kind));
    res.status(201).json(CreateControlRecordResponse.parse({...row(r.rows[0]),relatedIds:d.relatedIds??[]}));
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
router.patch("/:companyId/records/:id",async(req,res)=>{
  const a=await access(req);const id=uuid.parse(req.params.id);const old=await recordById(a,id,true);const d=UpdateControlRecordBody.parse(req.body);
  if(old.kind!==d.kind)fail(400,"Não é possível trocar o módulo do registro.");
  const values=await prepare(a,d);const client=await pool.connect();
  try {
    await client.query("BEGIN");
    const r=await client.query("UPDATE vc_records SET kind=$3,title=$4,description=$5,status=$6,unit_id=$7,responsible=$8,due_date=$9,parent_id=$10,document_id=$11,data=$12,updated_at=now() WHERE id=$1 AND company_id=$2 RETURNING *",[id,a.companyId,...values]);
    await client.query("DELETE FROM vc_links WHERE from_id=$1",[id]);
    for(const related of [...new Set(d.relatedIds??[])])await client.query("INSERT INTO vc_links(from_id,to_id) VALUES($1,$2)",[id,related]);
    await client.query("COMMIT");await audit(a,"Atualizou registro",d.title,d.unitId??null,moduleFor(d.kind));
    res.json(UpdateControlRecordResponse.parse({...row(r.rows[0]),relatedIds:d.relatedIds??[]}));
  }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
router.delete("/:companyId/records/:id",async(req,res)=>{
  const a=await access(req);const r=await recordById(a,uuid.parse(req.params.id),true);
  if(r.kind==="unit") {
    const count=await pool.query("SELECT 1 FROM vc_records WHERE unit_id=$1 AND NOT archived UNION ALL SELECT 1 FROM vc_documents WHERE unit_id=$1 LIMIT 1",[r.id]);
    if(count.rowCount) fail(409,"A unidade possui registros ou documentos vinculados e não pode ser arquivada.");
  }
  await pool.query("UPDATE vc_records SET archived=true,updated_at=now() WHERE id=$1 AND company_id=$2",[r.id,a.companyId]);
  await audit(a,"Arquivou registro",r.title,r.unit_id,moduleFor(r.kind));res.sendStatus(204);
});
export default router;
