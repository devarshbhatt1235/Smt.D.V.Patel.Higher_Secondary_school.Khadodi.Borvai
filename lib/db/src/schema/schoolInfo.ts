import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schoolInfoTable = pgTable("school_info", {
  id: serial("id").primaryKey(),
  nameGujarati: text("name_gujarati").notNull().default(""),
  nameEnglish: text("name_english").notNull().default(""),
  trustName: text("trust_name").notNull().default(""),
  address: text("address").notNull().default(""),
  established: integer("established").notNull().default(1972),
  principalMessage: text("principal_message"),
  principalName: text("principal_name"),
  presidentName: text("president_name"),
  secretaryName: text("secretary_name"),
  facilities: text("facilities").array().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSchoolInfoSchema = createInsertSchema(schoolInfoTable).omit({ id: true, updatedAt: true });
export type InsertSchoolInfo = z.infer<typeof insertSchoolInfoSchema>;
export type SchoolInfo = typeof schoolInfoTable.$inferSelect;
