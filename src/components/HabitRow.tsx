import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { radius, spacing, useTheme } from '@/theme';

export interface HabitRowData {
  id: number;
  name: string;
  emoji: string;
  color: string;
  done: boolean;
  streak: number;
}

interface Props {
  habit: HabitRowData;
  onToggle: (id: number, next: boolean) => void;
}

export function HabitRow({ habit, onToggle }: Props) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(250)}>
      <Pressable
        onPress={() => onToggle(habit.id, !habit.done)}
        style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={[styles.icon, { backgroundColor: habit.color + '22' }]}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
        </View>
        <View style={styles.mid}>
          <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
          <Text style={[styles.streak, { color: theme.muted }]}>
            {habit.streak > 0 ? `🔥 ${habit.streak} jour${habit.streak > 1 ? 's' : ''}` : 'Pas encore de série'}
          </Text>
        </View>
        <View
          style={[
            styles.check,
            habit.done
              ? { backgroundColor: habit.color, borderColor: habit.color }
              : { borderColor: theme.border },
          ]}
        >
          {habit.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    padding: spacing(3),
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing(3),
  },
  icon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  mid: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  streak: { fontSize: 12, marginTop: 2 },
  check: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
