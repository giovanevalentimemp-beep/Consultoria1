import { pgTable, text, uuid, jsonb, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { controlCompanies } from "./control-companies";

export const controlAlerts = pgTable("vc_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  offsets: jsonb("offsets").notNull(),
  recipients: jsonb("recipients").notNull(),
  cc: jsonb("cc").notNull().default([]),
  frequency: text("frequency").notNull().default("once"),
  responsible: text("responsible").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull().default(""),
  enabled: boolean("enabled").notNull().default(true),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const controlNotifications = pgTable("vc_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  alertId: uuid("alert_id").notNull().references(() => controlAlerts.id),
  unitId: uuid("unit_id"),
  targetTitle: text("target_title").notNull(),
  recipient: text("recipient").notNull(),
  cc: jsonb("cc").notNull().default([]),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  status: text("status").notNull().default("queued"),
  providerId: text("provider_id"),
  error: text("error"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const controlJobs = pgTable("vc_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  kind: text("kind").notNull(),
  entityId: uuid("entity_id").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  error: text("error"),
  runAt: timestamp("run_at", { withTimezone: true }).defaultNow().notNull(),
  leaseUntil: timestamp("lease_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [index("vc_jobs_pending").on(t.status, t.runAt)]);
export const controlChats = pgTable("vc_chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  userId: text("user_id").notNull(),
  scope: text("scope").notNull().default(""),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [index("vc_chats_user_company").on(t.userId, t.companyId)]);
export const controlWorkerState = pgTable("vc_worker_state", {
  key: text("key").primaryKey(),
  lastRun: timestamp("last_run", { withTimezone: true }),
});
