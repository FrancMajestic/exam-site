import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subjectsTable = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  examType: text("exam_type").notNull(),
  taskCount: integer("task_count").notNull().default(0),
  color: text("color").notNull().default("#6366f1"),
  icon: text("icon").notNull().default("book"),
  description: text("description"),
});

export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({ id: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjectsTable.$inferSelect;
