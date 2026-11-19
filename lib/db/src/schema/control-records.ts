import { pgTable, text, uuid, jsonb, timestamp, date, boolean, index, uniqueIndex, type AnyPgColumn } from "drizzle-orm/pg-core";
import { controlCompanies } from "./control-companies";

export const controlRecords = pgTable("vc_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("Aberta"),
  unitId: uuid("unit_id").references((): AnyPgColumn => controlRecords.id),
  responsible: text("responsible").notNull().default(""),
  dueDate: date("due_date", { mode: "string" }),
  parentId: uuid("parent_id").references((): AnyPgColumn => controlRecords.id),
  documentId: uuid("document_id"),
  data: jsonb("data").notNull().default({}),
  archived: boolean("archived").notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [index("vc_records_company_kind_due").on(t.companyId, t.kind, t.dueDate)]);
export const controlLinks = pgTable("vc_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromId: uuid("from_id").notNull().references(() => controlRecords.id),
  toId: uuid("to_id").notNull().references(() => controlRecords.id),
}, t => [uniqueIndex("vc_links_pair").on(t.fromId, t.toId)]);
export const controlActivity = pgTable("vc_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  unitId: uuid("unit_id"),
  module: text("module").notNull().default("settings"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [index("vc_activity_company").on(t.companyId, t.createdAt)]);
