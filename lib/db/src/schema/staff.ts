import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffTable = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  dateOfBirth: text("date_of_birth"),
  appointmentDate: text("appointment_date"),
  joiningDate: text("joining_date"),
  retirementDate: text("retirement_date"),
  employeeNumber: text("employee_number"),
  gpscPfNumber: text("gpsc_pf_number"),
  uidNumber: text("uid_number"),
  aadhaarNumber: text("aadhaar_number"),
  panNumber: text("pan_number"),
  qualification: text("qualification"),
  subjectsTaught: text("subjects_taught").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStaffSchema = createInsertSchema(staffTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;
