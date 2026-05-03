// 延遲載入 expo-notifications，避免在 Expo Go 中 crash
let Notifications: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      return null;
    }
  }
  return Notifications;
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const N = await getNotifications();
    if (!N) return false;
    const { status: existing } = await N.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(
  planId: string,
  planName: string,
  timeStr: string
): Promise<string | null> {
  try {
    const N = await getNotifications();
    if (!N) return null;
    const granted = await requestPermissions();
    if (!granted) return null;

    const [hours, minutes] = timeStr.split(':').map(Number);

    const id = await N.scheduleNotificationAsync({
      content: {
        title: '好願書 · 念誦提醒',
        body: `記得今日念誦 — ${planName}`,
        data: { planId },
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelReminder(notificationId: string) {
  try {
    const N = await getNotifications();
    if (N) await N.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}

export async function cancelAllReminders() {
  try {
    const N = await getNotifications();
    if (N) await N.cancelAllScheduledNotificationsAsync();
  } catch {}
}
