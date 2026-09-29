import { View, ViewProps, StyleSheet } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';

export function Card({ style, ...props }: ViewProps) {
  const { theme } = useTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing(4),
  },
});
