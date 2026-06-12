import { pgTable, serial, integer, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const taskAttemptsTable = pgTable("task_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  answer: text("answer").notNull(),
  correct: boolean("correct").notNull(),
  coinsEarned: integer("coins_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testResultsTable = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  testId: integer("test_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
  coinsEarned: integer("coins_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskAttemptSchema = createInsertSchema(taskAttemptsTable).omit({ id: true, createdAt: true });
export type InsertTaskAttempt = z.infer<typeof insertTaskAttemptSchema>;
export type TaskAttempt = typeof taskAttemptsTable.$inferSelect;
