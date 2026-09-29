import { ScrollView, Text, View, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { useSettings } from '@/store/useSettings';
import { formatHour } from '@/lib/date';
import { spacing, useTheme } from '@/theme';

const HOURS = [6, 8, 12, 18, 20, 21];

export default function SettingsScreen() {
  const { theme, scheme } = useTheme();
  const { defaultReminderHour, hapticsEnabled, setDefaultReminderHour, setHapticsEnabled } =
    useSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Réglages</Text>

        <Text style={[styles.section, { color: theme.muted }]}>Heure de rappel par défaut</Text>
        <View style={styles.grid}>
          {HOURS.map((h) => {
            const active = defaultReminderHour === h;
            return (
              <Text
                key={h}
                onPress={() => setDefaultReminderHour(h)}
                style={[
                  styles.chip,
                  {
                    color: active ? '#fff' : theme.text,
                    backgroundColor: active ? theme.brand : theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                {formatHour(h)}
              </Text>
            );
          })}
        </View>

        <Card style={[styles.card, styles.rowCard]}>
          <Text style={[styles.value, { color: theme.text }]}>Retour haptique</Text>
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ true: theme.brand }}
          />
        </Card>

        <Card style={[styles.card, styles.rowCard]}>
          <Text style={[styles.value, { color: theme.text }]}>Thème</Text>
          <Text style={[styles.themeVal, { color: theme.muted }]}>
            {scheme === 'dark' ? '🌙 Sombre' : '☀️ Clair'} (auto)
          </Text>
        </Card>

        <Text style={[styles.footer, { color: theme.muted }]}>
          Vidy v0.3.0 · ADH Studio · Données stockées localement (SQLite).
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing(5), paddingBottom: spacing(16) },
  title: { fontSize: 28, fontWeight: '800', marginBottom: spacing(4) },
  section: { fontSize: 13, fontWeight: '600', marginBottom: spacing(3) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2), marginBottom: spacing(5) },
  chip: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    fontWeight: '600',
  },
  card: { marginBottom: spacing(4) },
  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { fontSize: 15, fontWeight: '600' },
  themeVal: { fontSize: 14 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: spacing(6) },
});
