import { pgTable, text, uuid, integer, bigint, jsonb, timestamp, date, index, type AnyPgColumn } from "drizzle-orm/pg-core";
import { controlCompanies } from "./control-companies";
import { controlRecords } from "./control-records";

export const controlUploads = pgTable("vc_uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  userId: text("user_id").notNull(),
  objectPath: text("object_path").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  unitId: uuid("unit_id").references(() => controlRecords.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const controlDocuments = pgTable("vc_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  unitId: uuid("unit_id").references(() => controlRecords.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  number: text("number").notNull().default(""),
  responsible: text("responsible").notNull().default(""),
  issuedAt: date("issued_at", { mode: "string" }),
  expiresAt: date("expires_at", { mode: "string" }),
  notes: text("notes").notNull().default(""),
  filename: text("filename").notNull(),
  objectPath: text("object_path").notNull().unique(),
  contentType: text("content_type").notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  version: integer("version").notNull().default(1),
  previousId: uuid("previous_id").references((): AnyPgColumn => controlDocuments.id),
  status: text("status").notNull().default("Aguardando análise"),
  error: text("error"),
  analysis: jsonb("analysis"),
  analysisVersion: integer("analysis_version").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [index("vc_documents_company_unit").on(t.companyId, t.unitId)]);
