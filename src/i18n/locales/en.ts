// English — 待母語校稿（structure must mirror zh.ts）。
import type { Translation } from './zh';

export const en: Translation = {
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    done: 'Done',
    times: 'times',
    day: 'day',
  },
  onboarding: {
    tagline: 'One thought, one merit',
    planTitle: 'Vow Plan',
    planSubtitle: 'Structured Vow',
    planDesc: 'Set a daily count and duration to track your chanting as a structured plan',
    dailyTitle: 'Daily Record',
    dailySubtitle: 'Daily Practice',
    dailyDesc: 'Record your chanting freely each day — no goals, pure practice',
  },
  settings: {
    back: 'Back',
    title: 'Settings',
    sectionAppearance: 'Appearance',
    sectionLanguage: 'Language',
    sectionReminders: 'Reminders',
    sectionData: 'Data',
    sectionAbout: 'About',
    light: 'Light',
    dark: 'Dark',
    systemDefault: 'System default',
    noActivePlan: 'No active plan',
    dailyReminder: 'Daily at {{time}}',
    clearData: 'Clear all data',
    version: 'Version',
    tagline: 'One thought, one merit',
    clearTitle: 'Clear all data',
    clearMessage: 'This cannot be undone. All plans, records and settings will be permanently deleted.',
    clearConfirm: 'Confirm',
    reminderFailTitle: 'Cannot enable reminder',
    reminderFailMessage: 'Please check that system notification permission is enabled.',
  },
};
