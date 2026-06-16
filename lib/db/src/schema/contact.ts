import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactTable = pgTable("contact", {
  id: serial("id").primaryKey(),
  phone: text("phone"),
  email: text("email"),
  mapLink: text("map_link"),
  facebookUrl: text("facebook_url"),
  whatsappNumber: text("whatsapp_number"),
  youtubeUrl: text("youtube_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertContactSchema = createInsertSchema(contactTable).omit({ id: true, updatedAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactTable.$inferSelect;
