import { create } from 'zustand';

interface SettingsState {
  // Heure de rappel par défaut proposée à la création d'une habitude (0-23)
  defaultReminderHour: number;
  hapticsEnabled: boolean;
  setDefaultReminderHour: (h: number) => void;
  setHapticsEnabled: (v: boolean) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  defaultReminderHour: 20,
  hapticsEnabled: true,
  setDefaultReminderHour: (defaultReminderHour) => set({ defaultReminderHour }),
  setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
}));
