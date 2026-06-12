import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("student"),
  gradeLevel: integer("grade_level"),
  selectedSubjectIds: jsonb("selected_subject_ids").$type<number[]>().default([]),
  level: integer("level").notNull().default(1),
  coinBalance: integer("coin_balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalTasksSolved: integer("total_tasks_solved").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  maxStreak: integer("max_streak").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, lastActiveAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
