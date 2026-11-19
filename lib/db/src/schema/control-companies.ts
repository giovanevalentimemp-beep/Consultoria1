import { pgTable, text, uuid, boolean, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const controlUsers = pgTable("vc_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  platformAdmin: boolean("platform_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const controlCompanies = pgTable("vc_companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").notNull().default({}),
  sender: text("sender").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const controlMembers = pgTable("vc_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => controlCompanies.id),
  email: text("email").notNull(),
  role: text("role").notNull(),
  unitIds: jsonb("unit_ids").notNull().default([]),
  modules: jsonb("modules").notNull().default([]),
  enabled: boolean("enabled").notNull().default(true),
}, t => [uniqueIndex("vc_members_company_email").on(t.companyId, t.email)]);
