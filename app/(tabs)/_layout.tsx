import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/theme';

function Icon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Aujourd’hui', tabBarIcon: ({ focused }) => <Icon emoji="🗓️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="habits"
        options={{ title: 'Habitudes', tabBarIcon: ({ focused }) => <Icon emoji="✅" focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Réglages', tabBarIcon: ({ focused }) => <Icon emoji="⚙️" focused={focused} /> }}
      />
    </Tabs>
  );
}
