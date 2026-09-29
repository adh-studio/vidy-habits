import { computeStreaks, currentStreak } from './streak';

// Date de référence figée pour des tests déterministes.
const TODAY = new Date('2026-03-15T10:00:00');

describe('computeStreaks', () => {
  it('renvoie 0/0 pour une liste vide', () => {
    expect(computeStreaks([], TODAY)).toEqual({ current: 0, best: 0 });
  });

  it('compte une série continue se terminant aujourd’hui', () => {
    const dates = ['2026-03-13', '2026-03-14', '2026-03-15'];
    expect(computeStreaks(dates, TODAY)).toEqual({ current: 3, best: 3 });
  });

  it('garde la série en cours si aujourd’hui n’est pas encore fait mais hier oui', () => {
    const dates = ['2026-03-12', '2026-03-13', '2026-03-14'];
    // Dernier check-in = hier -> la série reste active (pas encore cassée).
    expect(currentStreak(dates, TODAY)).toBe(3);
  });

  it('remet la série en cours à 0 quand elle est cassée (avant-hier)', () => {
    const dates = ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13'];
    const { current, best } = computeStreaks(dates, TODAY);
    expect(current).toBe(0);
    expect(best).toBe(4);
  });

  it('calcule le meilleur streak même quand la série courante est courte', () => {
    const dates = [
      // ancienne série de 5
      '2026-02-01',
      '2026-02-02',
      '2026-02-03',
      '2026-02-04',
      '2026-02-05',
      // série courante de 2 (hier + aujourd’hui)
      '2026-03-14',
      '2026-03-15',
    ];
    expect(computeStreaks(dates, TODAY)).toEqual({ current: 2, best: 5 });
  });

  it('ignore les doublons de dates', () => {
    const dates = ['2026-03-14', '2026-03-14', '2026-03-15', '2026-03-15'];
    expect(computeStreaks(dates, TODAY)).toEqual({ current: 2, best: 2 });
  });

  it('gère un unique check-in fait aujourd’hui', () => {
    expect(computeStreaks(['2026-03-15'], TODAY)).toEqual({ current: 1, best: 1 });
  });

  it('n’est pas sensible à l’ordre d’entrée des dates', () => {
    const dates = ['2026-03-15', '2026-03-13', '2026-03-14'];
    expect(computeStreaks(dates, TODAY)).toEqual({ current: 3, best: 3 });
  });
});
