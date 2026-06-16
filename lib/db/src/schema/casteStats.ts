import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casteStatsTable = pgTable("caste_stats", {
  id: serial("id").primaryKey(),
  stBoys: integer("st_boys").notNull().default(0),
  stGirls: integer("st_girls").notNull().default(0),
  obcBoys: integer("obc_boys").notNull().default(0),
  obcGirls: integer("obc_girls").notNull().default(0),
  scBoys: integer("sc_boys").notNull().default(0),
  scGirls: integer("sc_girls").notNull().default(0),
  generalBoys: integer("general_boys").notNull().default(0),
  generalGirls: integer("general_girls").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCasteStatsSchema = createInsertSchema(casteStatsTable).omit({ id: true, updatedAt: true });
export type InsertCasteStats = z.infer<typeof insertCasteStatsSchema>;
export type CasteStats = typeof casteStatsTable.$inferSelect;
