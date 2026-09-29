import { useMemo } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { and, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db/client';
import { checkins, habits } from '@/db/schema';
import { HabitRow, HabitRowData } from '@/components/HabitRow';
import { ProgressRing } from '@/components/ProgressRing';
import { computeStreaks } from '@/lib/streak';
import { humanDay, todayISO } from '@/lib/date';
import { spacing, useTheme } from '@/theme';
import { useSettings } from '@/store/useSettings';

export default function TodayScreen() {
  const { theme } = useTheme();
  const hapticsEnabled = useSettings((s) => s.hapticsEnabled);
  const today = todayISO();

  const { data: allHabits } = useLiveQuery(db.select().from(habits));
  const { data: allCheckins } = useLiveQuery(db.select().from(checkins));

  // Regroupe les dates de complétion par habitude (pour les séries).
  const datesByHabit = useMemo(() => {
    const map = new Map<number, string[]>();
    (allCheckins ?? []).forEach((c) => {
      const arr = map.get(c.habitId) ?? [];
      arr.push(c.date);
      map.set(c.habitId, arr);
    });
    return map;
  }, [allCheckins]);

  const rows: HabitRowData[] = (allHabits ?? []).map((h) => {
    const dates = datesByHabit.get(h.id) ?? [];
    return {
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      color: h.color,
      done: dates.includes(today),
      streak: computeStreaks(dates).current,
    };
  });

  const doneCount = rows.filter((r) => r.done).length;
  const progress = rows.length > 0 ? doneCount / rows.length : 0;

  const toggle = async (habitId: number, next: boolean) => {
    if (hapticsEnabled) {
      await Haptics.impactAsync(
        next ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
      );
    }
    if (next) {
      await db.insert(checkins).values({ habitId, date: today }).onConflictDoNothing();
    } else {
      await db
        .delete(checkins)
        .where(and(eq(checkins.habitId, habitId), eq(checkins.date, today)));
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={rows}
        keyExtractor={(r) => String(r.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Aujourd’hui</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>{humanDay()}</Text>
            <View style={styles.ringWrap}>
              <ProgressRing progress={progress} color={theme.brand} trackColor={theme.border}>
                <Text style={[styles.ringPct, { color: theme.text }]}>
                  {Math.round(progress * 100)}%
                </Text>
                <Text style={[styles.ringMeta, { color: theme.muted }]}>
                  {doneCount}/{rows.length}
                </Text>
              </ProgressRing>
            </View>
            <Text style={[styles.section, { color: theme.muted }]}>Mes habitudes</Text>
          </View>
        }
        renderItem={({ item }) => <HabitRow habit={item} onToggle={toggle} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Aucune habitude. Ajoutez-en une depuis l’onglet Habitudes.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: spacing(5), paddingBottom: spacing(16) },
  header: { marginBottom: spacing(2) },
  title: { fontSize: 28, fontWeight: '800', marginTop: spacing(2) },
  subtitle: { fontSize: 14, marginTop: spacing(1), textTransform: 'capitalize' },
  ringWrap: { alignItems: 'center', marginVertical: spacing(6) },
  ringPct: { fontSize: 30, fontWeight: '800' },
  ringMeta: { fontSize: 13, marginTop: 2 },
  section: { fontSize: 13, fontWeight: '600', marginBottom: spacing(3) },
  empty: { textAlign: 'center', marginTop: spacing(10), fontSize: 14 },
});
