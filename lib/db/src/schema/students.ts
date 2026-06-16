import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  grNumber: text("gr_number").notNull(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  uidNumber: text("uid_number"),
  panNumber: text("pan_number"),
  mobileNumber: text("mobile_number"),
  villageName: text("village_name"),
  result: text("result"),
  photoUrl: text("photo_url"),
  casteCategory: text("caste_category"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
