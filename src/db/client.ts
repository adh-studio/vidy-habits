import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('vidy.db', { enableChangeListener: true });
export const db = drizzle(expoDb, { schema });

/**
 * Bootstrap minimal de la base. En production, ceci est remplacé par les
 * migrations générées par drizzle-kit + `useMigrations`.
 */
export function runInitialMigration() {
  expoDb.execSync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL DEFAULT '✅',
      color TEXT NOT NULL DEFAULT '#7c3aed',
      frequency TEXT NOT NULL DEFAULT 'daily',
      reminder_hour INTEGER,
      notification_id TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS checkins_habit_date
      ON checkins (habit_id, date);
  `);

  const count = expoDb.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM habits');
  if (!count || count.c === 0) {
    expoDb.execSync(`
      INSERT INTO habits (name, emoji, color, frequency, reminder_hour) VALUES
        ('Boire 2 L d''eau', '💧', '#2563eb', 'daily', 9),
        ('Lire 20 minutes', '📚', '#7c3aed', 'daily', 21),
        ('Méditer', '🧘', '#16a34a', 'daily', 7),
        ('Sport', '🏃', '#d97706', 'weekdays', 18);
    `);
  }
}
