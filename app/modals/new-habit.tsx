import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { habits } from '@/db/schema';
import { scheduleDailyReminder } from '@/lib/notifications';
import { formatHour } from '@/lib/date';
import { palette, radius, spacing, useTheme } from '@/theme';
import { useSettings } from '@/store/useSettings';

const EMOJIS = ['✅', '💧', '📚', '🧘', '🏃', '💪', '🥗', '😴', '✍️', '🎯'];
const COLORS = [palette.brand, palette.brandAlt, palette.success, palette.warning, palette.danger];
const HOURS = [6, 8, 12, 18, 20, 21];

export default function NewHabitModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const defaultReminderHour = useSettings((s) => s.defaultReminderHour);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [frequency, setFrequency] = useState<'daily' | 'weekdays'>('daily');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(defaultReminderHour);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const [inserted] = await db
      .insert(habits)
      .values({
        name: trimmed,
        emoji,
        color,
        frequency,
        reminderHour: reminderEnabled ? reminderHour : null,
      })
      .returning({ id: habits.id });

    // Planifie une notification locale quotidienne et mémorise son identifiant.
    if (reminderEnabled && inserted) {
      const notificationId = await scheduleDailyReminder(trimmed, reminderHour);
      if (notificationId) {
        await db
          .update(habits)
          .set({ notificationId })
          .where(eq(habits.id, inserted.id));
      }
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color: theme.muted }]}>Nom de l’habitude</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex : Boire 2 L d’eau"
        placeholderTextColor={theme.muted}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
      />

      <Text style={[styles.label, { color: theme.muted }]}>Icône</Text>
      <View style={styles.chips}>
        {EMOJIS.map((e) => {
          const active = emoji === e;
          return (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[
                styles.emojiChip,
                { borderColor: active ? theme.brand : theme.border, backgroundColor: active ? theme.brand + '18' : theme.card },
              ]}
            >
              <Text style={styles.emoji}>{e}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.muted }]}>Couleur</Text>
      <View style={styles.chips}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorDot,
              { backgroundColor: c, borderColor: color === c ? theme.text : 'transparent' },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: theme.muted }]}>Fréquence</Text>
      <View style={styles.segment}>
        {(['daily', 'weekdays'] as const).map((f) => {
          const active = frequency === f;
          return (
            <Text
              key={f}
              onPress={() => setFrequency(f)}
              style={[
                styles.segItem,
                { color: active ? '#fff' : theme.text, backgroundColor: active ? theme.brand : theme.card, borderColor: theme.border },
              ]}
            >
              {f === 'daily' ? 'Chaque jour' : 'En semaine'}
            </Text>
          );
        })}
      </View>

      <View style={styles.reminderRow}>
        <Text style={[styles.value, { color: theme.text }]}>Rappel quotidien</Text>
        <Switch value={reminderEnabled} onValueChange={setReminderEnabled} trackColor={{ true: theme.brand }} />
      </View>

      {reminderEnabled && (
        <View style={styles.chips}>
          {HOURS.map((h) => {
            const active = reminderHour === h;
            return (
              <Text
                key={h}
                onPress={() => setReminderHour(h)}
                style={[
                  styles.hourChip,
                  { color: active ? '#fff' : theme.text, backgroundColor: active ? theme.brand : theme.card, borderColor: theme.border },
                ]}
              >
                {formatHour(h)}
              </Text>
            );
          })}
        </View>
      )}

      <Pressable onPress={save} style={[styles.save, { backgroundColor: theme.brand }]}>
        <Text style={styles.saveText}>Créer l’habitude</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing(5), gap: spacing(1) },
  label: { fontSize: 13, fontWeight: '600', marginTop: spacing(4) },
  input: { borderWidth: 1, borderRadius: radius.md, padding: spacing(4), marginTop: spacing(2), fontSize: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2), marginTop: spacing(2) },
  emojiChip: { width: 46, height: 46, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  colorDot: { width: 40, height: 40, borderRadius: radius.pill, borderWidth: 3 },
  segment: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(2) },
  segItem: { flex: 1, textAlign: 'center', paddingVertical: spacing(3), borderRadius: 10, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, fontWeight: '600' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing(5) },
  value: { fontSize: 15, fontWeight: '600' },
  hourChip: { paddingHorizontal: spacing(4), paddingVertical: spacing(2), borderRadius: 10, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, fontWeight: '600' },
  save: { marginTop: spacing(8), padding: spacing(4), borderRadius: radius.md, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
