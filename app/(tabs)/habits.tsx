import { useMemo } from 'react';
import { Alert, FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db/client';
import { checkins, habits, type Habit } from '@/db/schema';
import { Card } from '@/components/Card';
import { computeStreaks } from '@/lib/streak';
import { cancelReminder } from '@/lib/notifications';
import { formatHour } from '@/lib/date';
import { radius, spacing, useTheme } from '@/theme';

export default function HabitsScreen() {
  const { theme } = useTheme();

  const { data: allHabits } = useLiveQuery(db.select().from(habits));
  const { data: allCheckins } = useLiveQuery(db.select().from(checkins));

  const datesByHabit = useMemo(() => {
    const map = new Map<number, string[]>();
    (allCheckins ?? []).forEach((c) => {
      const arr = map.get(c.habitId) ?? [];
      arr.push(c.date);
      map.set(c.habitId, arr);
    });
    return map;
  }, [allCheckins]);

  const remove = (habit: Habit) => {
    Alert.alert('Supprimer', `Supprimer « ${habit.name} » et son historique ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await cancelReminder(habit.notificationId);
          // Les check-ins sont supprimés en cascade (ON DELETE CASCADE).
          await db.delete(habits).where(eq(habits.id, habit.id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={allHabits ?? []}
        keyExtractor={(h) => String(h.id)}
        ListHeaderComponent={
          <Text style={[styles.title, { color: theme.text }]}>Habitudes</Text>
        }
        renderItem={({ item }) => {
          const { current, best } = computeStreaks(datesByHabit.get(item.id) ?? []);
          const total = (datesByHabit.get(item.id) ?? []).length;
          return (
            <Card style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.icon, { backgroundColor: item.color + '22' }]}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.mid}>
                  <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.meta, { color: theme.muted }]}>
                    {item.frequency === 'weekdays' ? 'En semaine' : 'Chaque jour'}
                    {item.reminderHour != null ? ` · Rappel ${formatHour(item.reminderHour)}` : ''}
                  </Text>
                </View>
                <Pressable onPress={() => remove(item)} hitSlop={8}>
                  <Text style={[styles.delete, { color: theme.danger }]}>Suppr.</Text>
                </Pressable>
              </View>
              <View style={styles.stats}>
                <Stat label="Série" value={`🔥 ${current}`} color={theme.text} muted={theme.muted} />
                <Stat label="Record" value={`🏆 ${best}`} color={theme.text} muted={theme.muted} />
                <Stat label="Total" value={`${total}`} color={theme.text} muted={theme.muted} />
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.muted }]}>
            Aucune habitude pour le moment.
          </Text>
        }
      />
      <Link href="/modals/new-habit" asChild>
        <Pressable style={[styles.fab, { backgroundColor: theme.brand }]}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
  color,
  muted,
}: {
  label: string;
  value: string;
  color: string;
  muted: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: spacing(5), paddingBottom: spacing(24) },
  title: { fontSize: 28, fontWeight: '800', marginTop: spacing(2), marginBottom: spacing(4) },
  card: { marginBottom: spacing(4) },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  icon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  mid: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 2 },
  delete: { fontSize: 13, fontWeight: '600' },
  stats: { flexDirection: 'row', gap: spacing(6), marginTop: spacing(4) },
  stat: {},
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: spacing(10), fontSize: 14 },
  fab: {
    position: 'absolute', right: spacing(6), bottom: spacing(8),
    width: 60, height: 60, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
});
