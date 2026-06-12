import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testsTable = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subjectId: integer("subject_id").notNull(),
  examType: text("exam_type").notNull(),
  taskCount: integer("task_count").notNull().default(0),
  duration: integer("duration").notNull().default(90),
  difficulty: text("difficulty").notNull().default("medium"),
  year: integer("year"),
  completionCount: integer("completion_count").notNull().default(0),
  averageScore: real("average_score"),
});

export const testTasksTable = pgTable("test_tasks", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  taskId: integer("task_id").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const insertTestSchema = createInsertSchema(testsTable).omit({ id: true });
export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof testsTable.$inferSelect;
