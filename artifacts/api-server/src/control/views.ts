import { Router,type IRouter } from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { createHash } from "node:crypto";
import { GetControlOverviewResponse,ListControlChatResponse,SendControlChatBody,SendControlChatResponse,ExportControlReportParams,ExportControlReportQueryParams } from "@workspace/api-zod";
import { access,visibleRecords,visible,allowed,pool,rows,row,audit,fail } from "./core";
import { answerChat } from "./intelligence";

const router:IRouter=Router();
const closed=(r:Record<string,any>)=>["Concluída","Concluído","Cancelada","Cancelado","Rejeitada","Rejeitado","Arquivada","Arquivado"].includes(r.status);
router.get("/:companyId/overview",async(req,res)=>{
  const a=await access(req);const r=await visibleRecords(a);
  const d=await pool.query("SELECT id,status,category,expires_at FROM vc_documents WHERE company_id=$1 AND (cardinality($2::uuid[])=0 OR unit_id=ANY($2::uuid[]))",[a.companyId,a.unitIds]);
  const docs=(a.platformAdmin||a.role==="company_admin"||!a.modules.length||a.modules.includes("documents"))?d.rows:[];
  const today=new Date().toLocaleDateString("sv-SE",{timeZone:"America/Sao_Paulo"});const soon=new Date(Date.parse(today)+30*86400000).toISOString().slice(0,10);
  const active=r.filter(x=>!closed(x));
  const overdue=active.filter(x=>x.due_date&&x.due_date<today);
  const dueSoon=active.filter(x=>x.due_date>=today&&x.due_date<=soon);
  const counts:Record<string,number>={totalRecords:r.length,totalDocuments:docs.length,documents:docs.length,overdue:overdue.length,dueSoon:dueSoon.length,pendingValidation:docs.filter(d=>d.status==="Aguardando validação").length,openTasks:active.filter(x=>["task","action"].includes(x.kind)).length,expiredDocuments:docs.filter(d=>d.expires_at&&d.expires_at<today).length,expiringDocuments:docs.filter(d=>d.expires_at>=today&&d.expires_at<=soon).length};
  for(const kind of ["license","condition","obligation","task","action","monitoring","mtr","cdf"])counts[kind]=active.filter(x=>x.kind===kind).length;
  const byCategory=Object.entries(r.reduce((acc:Record<string,number>,x)=>{acc[x.kind]=(acc[x.kind]??0)+1;return acc;},{})).map(([name,value])=>({name,value}));
  const timeline=Array.from({length:6},(_,i)=>{const date=new Date(Date.parse(today));date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+i);const key=date.toISOString().slice(0,7);return{name:key,value:active.filter(x=>x.due_date?.startsWith(key)).length};});
  const attention=active.filter(x=>(x.due_date&&x.due_date<=soon)||x.status==="Aguardando validação").sort((x,y)=>(x.due_date??"9999").localeCompare(y.due_date??"9999")).slice(0,100);
  res.json(GetControlOverviewResponse.parse({counts,attention:rows(attention),byCategory,timeline}));
});
const scope=(a:Awaited<ReturnType<typeof access>>)=>createHash("sha256").update(JSON.stringify([a.role,a.platformAdmin,[...a.unitIds].sort(),[...a.modules].sort()])).digest("hex");
router.get("/:companyId/chat",async(req,res)=>{
  const a=await access(req);
  const r=await pool.query("SELECT id,role,content,created_at FROM vc_chats WHERE company_id=$1 AND user_id=$2 AND scope=$3 ORDER BY created_at LIMIT 100",[a.companyId,a.userId,scope(a)]);
  res.json(ListControlChatResponse.parse(rows(r.rows)));
});
router.post("/:companyId/chat",async(req,res)=>{
  const a=await access(req);const d=SendControlChatBody.parse(req.body);
  const count=await pool.query("SELECT count(*)::int AS n FROM vc_chats WHERE user_id=$1 AND role='user' AND created_at>now()-interval '1 minute'",[a.userId]);if(count.rows[0].n>=5)fail(429,"Aguarde um minuto antes de enviar novas perguntas.");
  const records=await visibleRecords(a);
  const docs=await pool.query("SELECT name,unit_id,analysis,status FROM vc_documents WHERE company_id=$1 AND analysis IS NOT NULL ORDER BY created_at DESC",[a.companyId]);
  const authorizedDocs=(a.platformAdmin||a.role==="company_admin"||!a.modules.length||a.modules.includes("documents"))?docs.rows.filter(d=>visible(a,d.unit_id)):[];
  const context=JSON.stringify({records:records.slice(0,200).map(r=>({title:r.title,kind:r.kind,status:r.status,dueDate:r.due_date,responsible:r.responsible,description:r.description,data:r.data})),documents:authorizedDocs.map(d=>({name:d.name,status:d.status,analysis:d.analysis}))}).slice(0,60000);
  const h=await pool.query("SELECT role,content FROM vc_chats WHERE company_id=$1 AND user_id=$2 AND scope=$3 ORDER BY created_at DESC LIMIT 8",[a.companyId,a.userId,scope(a)]);
  const answer=await answerChat(d.message,context,h.rows.reverse());
  const client=await pool.connect();try{await client.query("BEGIN");await client.query("INSERT INTO vc_chats(company_id,user_id,scope,role,content) VALUES($1,$2,$3,'user',$4)",[a.companyId,a.userId,scope(a),d.message]);const r=await client.query("INSERT INTO vc_chats(company_id,user_id,scope,role,content) VALUES($1,$2,$3,'assistant',$4) RETURNING *",[a.companyId,a.userId,scope(a),answer]);await client.query("COMMIT");res.status(201).json(SendControlChatResponse.parse(row(r.rows[0])));}catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
});
router.get("/:companyId/reports/:format",async(req,res)=>{
  const a=await access(req);const {format}=ExportControlReportParams.parse(req.params);const {kind}=ExportControlReportQueryParams.parse(req.query);
  let records=await visibleRecords(a);if(kind)records=records.filter(r=>r.kind===kind);
  const companies=await pool.query("SELECT name FROM vc_companies WHERE id=$1",[a.companyId]);const company=companies.rows[0].name;
  await audit(a,"Exportou relatório",`${format.toUpperCase()} — ${kind??"todos os registros"}`,null,"reports");
  if(format==="xlsx") {
    const workbook=new ExcelJS.Workbook();workbook.creator="VERDANT CONTROL";
    const sheet=workbook.addWorksheet("Registros ambientais");
    sheet.columns=[{header:"Tipo",key:"kind",width:18},{header:"Título",key:"title",width:50},{header:"Situação",key:"status",width:24},{header:"Responsável",key:"responsible",width:28},{header:"Prazo",key:"due_date",width:16},{header:"Descrição",key:"description",width:65},{header:"Campos específicos",key:"data",width:75}];
    records.forEach(r=>sheet.addRow({...r,data:JSON.stringify(r.data)}));
    sheet.getRow(1).font={bold:true,color:{argb:"FFFFFFFF"}};sheet.getRow(1).fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF194D36"}};
    sheet.views=[{state:"frozen",ySplit:1}];sheet.autoFilter="A1:G1";
    res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");res.setHeader("Content-Disposition",'attachment; filename="verdant-control.xlsx"');
    await workbook.xlsx.write(res);res.end();
  } else {
    res.setHeader("Content-Type","application/pdf");res.setHeader("Content-Disposition",'attachment; filename="verdant-control.pdf"');
    const pdf=new PDFDocument({margin:42,size:"A4",info:{Title:"Relatório ambiental VERDANT CONTROL",Author:"VERDANT CONTROL"}});pdf.pipe(res);
    pdf.fontSize(20).fillColor("#194D36").text("VERDANT CONTROL");pdf.fontSize(12).text(company);pdf.fontSize(9).fillColor("#444444").text(`Relatório emitido em ${new Date().toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}\n${records.length} registros autorizados. Informações sujeitas à validação técnica.`);pdf.moveDown();
    for(const r of records){if(pdf.y>680)pdf.addPage();pdf.fontSize(11).fillColor("#194D36").text(r.title);pdf.fontSize(9).fillColor("#222222").text(`${r.kind} | ${r.status} | Prazo: ${r.due_date??"não definido"} | Responsável: ${r.responsible||"não atribuído"}`);if(r.description)pdf.text(r.description);pdf.moveDown();}
    if(!records.length)pdf.text("Nenhum registro encontrado para o escopo selecionado.");pdf.end();
  }
});
export default router;
