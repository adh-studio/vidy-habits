import { differenceInCalendarDays, parseISO } from 'date-fns';

/**
 * Calcul des séries (streaks) d'une habitude à partir d'une liste de dates
 * de complétion au format ISO 'YYYY-MM-DD'.
 *
 * - `current` : série en cours. Elle reste valide si la dernière complétion
 *   date d'aujourd'hui OU d'hier (on ne "casse" pas la série avant la fin de
 *   la journée en cours).
 * - `best` : plus longue série jamais réalisée.
 */
export interface StreakResult {
  current: number;
  best: number;
}

/**
 * Normalise une date ISO 'YYYY-MM-DD' vers minuit local pour comparer
 * des jours calendaires sans effet de fuseau/heure.
 */
function toDay(iso: string): Date {
  return parseISO(iso);
}

export function computeStreaks(dates: string[], today: Date = new Date()): StreakResult {
  if (dates.length === 0) return { current: 0, best: 0 };

  // Dédoublonnage puis tri croissant.
  const unique = [...new Set(dates)].sort();
  const days = unique.map(toDay);

  // Meilleure série : on parcourt les jours consécutifs.
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = differenceInCalendarDays(days[i], days[i - 1]);
    if (gap === 1) {
      run += 1;
    } else if (gap === 0) {
      // même jour (ne devrait pas arriver après dédoublonnage), on ignore
      continue;
    } else {
      run = 1;
    }
    if (run > best) best = run;
  }

  // Série en cours : on part du dernier jour complété.
  const last = days[days.length - 1];
  const distanceToToday = differenceInCalendarDays(today, last);

  // La série est considérée cassée si le dernier check-in est antérieur à hier.
  if (distanceToToday > 1) {
    return { current: 0, best };
  }

  let current = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const gap = differenceInCalendarDays(days[i], days[i - 1]);
    if (gap === 1) current += 1;
    else break;
  }

  return { current, best };
}

/** Série en cours uniquement (raccourci pratique). */
export function currentStreak(dates: string[], today: Date = new Date()): number {
  return computeStreaks(dates, today).current;
}
