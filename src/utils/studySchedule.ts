import type { StudyDay, StudyHoursMap } from "@/types/onboarding.types";

export const STUDY_DAY_LABELS: Record<StudyDay, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Quar",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sab",
  SUNDAY: "Dom",
};

const STUDY_DAY_ORDER: StudyDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function formatPreferredLanguage(language?: string): string {
  if (!language) return "—";
  if (language === "ENGLISH") return "Inglês";
  if (language === "SPANISH") return "Espanhol";
  return language;
}

export function formatStudyHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function getSelectedStudyDays(studyHours?: StudyHoursMap): StudyDay[] {
  if (!studyHours) return [];

  return STUDY_DAY_ORDER.filter((day) => {
    const hours = studyHours[day];
    return Array.isArray(hours) && hours.length > 0;
  });
}

export function getUniqueStudyHours(studyHours?: StudyHoursMap): number[] {
  if (!studyHours) return [];

  const uniqueHours = new Set<number>();

  Object.values(studyHours).forEach((hours) => {
    hours?.forEach((hour) => uniqueHours.add(hour));
  });

  return [...uniqueHours].sort((hourA, hourB) => hourA - hourB);
}

export function sortStudyHours(hours: number[]): number[] {
  return [...hours].sort((hourA, hourB) => hourA - hourB);
}

export function normalizePreferredLanguage(input: string): "ENGLISH" | "SPANISH" | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase();
  if (/(en|ingl)/.test(normalized)) return "ENGLISH";
  if (/(es|espanh|espan)/.test(normalized)) return "SPANISH";
  if (normalized === "english") return "ENGLISH";
  if (normalized === "spanish") return "SPANISH";
  return null;
}

export function buildStudyHoursFromSelection(days: StudyDay[], hours: number[]): StudyHoursMap {
  if (days.length === 0 || hours.length === 0) return {};

  const sortedHours = sortStudyHours(hours);
  const studyHours: StudyHoursMap = {};

  days.forEach((day) => {
    studyHours[day] = sortedHours;
  });

  return studyHours;
}
