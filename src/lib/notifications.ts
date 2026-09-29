import * as Notifications from 'expo-notifications';

/**
 * Configure le comportement d'affichage des notifications au premier plan.
 * À appeler une fois au démarrage de l'application.
 */
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Demande la permission d'envoyer des notifications locales.
 * Renvoie `true` si l'autorisation est accordée.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

/**
 * Planifie un rappel quotidien à l'heure indiquée (0-23) et renvoie
 * l'identifiant de la notification (à conserver pour pouvoir l'annuler).
 */
export async function scheduleDailyReminder(
  habitName: string,
  hour: number,
  minute = 0
): Promise<string | null> {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Vidy · Rappel',
      body: `C'est l'heure de : ${habitName} 💪`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/** Annule une notification planifiée si un identifiant est fourni. */
export async function cancelReminder(notificationId: string | null | undefined): Promise<void> {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
