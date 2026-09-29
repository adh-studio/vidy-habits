import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  emoji: text('emoji').notNull().default('✅'),
  color: text('color').notNull().default('#7c3aed'),
  // 'daily' | 'weekdays'
  frequency: text('frequency').notNull().default('daily'),
  // Heure de rappel (0-23), null = pas de rappel
  reminderHour: integer('reminder_hour'),
  // Identifiant de la notification locale planifiée (expo-notifications)
  notificationId: text('notification_id'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const checkins = sqliteTable('checkins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habitId: integer('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
  // Date de complétion au format ISO 'YYYY-MM-DD'
  date: text('date').notNull(),
});

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type Checkin = typeof checkins.$inferSelect;
export type NewCheckin = typeof checkins.$inferInsert;
