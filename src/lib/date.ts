import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/** Date du jour au format ISO 'YYYY-MM-DD' (fuseau local). */
export function todayISO(d: Date = new Date()): string {
  return format(d, 'yyyy-MM-dd');
}

/** Libellé lisible du jour, ex. « samedi 14 mars ». */
export function humanDay(d: Date = new Date()): string {
  return format(d, 'EEEE d MMMM', { locale: fr });
}

/** Formatte une heure entière (0-23) en 'HH:00'. */
export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}
