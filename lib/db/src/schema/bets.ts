import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const betsTable = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  targetUserId: integer("target_user_id").notNull(),
  examType: text("exam_type").notNull(),
  subjectId: integer("subject_id").notNull(),
  predictedScore: integer("predicted_score").notNull(),
  wageredCoins: integer("wagered_coins").notNull(),
  potentialWin: integer("potential_win").notNull(),
  status: text("status").notNull().default("active"),
  actualScore: integer("actual_score"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBetSchema = createInsertSchema(betsTable).omit({ id: true, createdAt: true, resolvedAt: true });
export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof betsTable.$inferSelect;
