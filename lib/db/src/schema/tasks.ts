import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  topicId: integer("topic_id").notNull(),
  taskNumber: integer("task_number").notNull(),
  examType: text("exam_type").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  question: text("question").notNull(),
  imageUrl: text("image_url"),
  answerType: text("answer_type").notNull().default("text"),
  options: json("options").$type<string[]>(),
  correctAnswer: text("correct_answer").default(""),
  solution: text("solution").default(""),
  lifehack: text("lifehack"),
  year: integer("year"),
  source: text("source"),
});

export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
