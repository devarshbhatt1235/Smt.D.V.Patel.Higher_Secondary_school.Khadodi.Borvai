import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const topStudentsTable = pgTable("top_students", {
  id: serial("id").primaryKey(),
  rank: integer("rank").notNull(),
  name: text("name").notNull(),
  fatherName: text("father_name"),
  class: text("class").notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  totalMarks: integer("total_marks"),
  grade: text("grade"),
  year: text("year").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTopStudentSchema = createInsertSchema(topStudentsTable).omit({ id: true, createdAt: true });
export type InsertTopStudent = z.infer<typeof insertTopStudentSchema>;
export type TopStudent = typeof topStudentsTable.$inferSelect;
