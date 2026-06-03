// 한국어 — 원어민 검수 대기 (structure must mirror zh.ts).
import type { Translation } from './zh';

export const ko: Translation = {
  common: {
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    done: '완료',
    times: '편',
    day: '일',
  },
  onboarding: {
    tagline: '한 생각 한 공덕',
    planTitle: '발원 플랜',
    planSubtitle: 'Structured Vow',
    planDesc: '매일 횟수와 기간을 설정하여 염송을 플랜으로 기록합니다',
    dailyTitle: '일상 기록',
    dailySubtitle: 'Daily Practice',
    dailyDesc: '목표 없이 매일의 염송을 자유롭게 기록하는 순수한 수행',
  },
  settings: {
    back: '뒤로',
    title: '설정',
    sectionAppearance: '외관',
    sectionLanguage: '언어',
    sectionReminders: '알림',
    sectionData: '데이터',
    sectionAbout: '정보',
    light: '라이트 모드',
    dark: '다크 모드',
    systemDefault: '시스템 설정 따름',
    noActivePlan: '진행 중인 플랜이 없습니다',
    dailyReminder: '매일 {{time}}',
    clearData: '모든 데이터 삭제',
    version: '버전',
    tagline: '한 생각 한 공덕',
    clearTitle: '모든 데이터 삭제',
    clearMessage: '이 작업은 되돌릴 수 없습니다. 모든 플랜, 기록, 설정이 영구 삭제됩니다.',
    clearConfirm: '삭제',
    reminderFailTitle: '알림을 활성화할 수 없습니다',
    reminderFailMessage: '시스템 알림 권한이 켜져 있는지 확인하세요.',
  },
};
